import os
import datetime
from datetime import timezone
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from sqlalchemy import text
from .config import settings
from .database import engine, Base, SessionLocal
from .models import User, Device, Task, Approval, Artifact, Event, Job, now_utc
from .security import (
    hash_password, verify_password, hash_token,
    create_access_token, decode_access_token, verify_agent_secret
)
from .orchestrator.planner import TaskPlanner
from .orchestrator.policy_engine import PolicyEngine
from .orchestrator.state_machine import validate_state_transition, InvalidStateTransitionError
from .orchestrator.dispatcher import JobDispatcher
from .orchestrator.verifier import ResultVerifier

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed default user and devices
    with SessionLocal() as db:
        user = db.query(User).filter(User.username == "mira_user").first()
        if not user:
            user = User(
                user_id="00000000-0000-4000-8000-000000000001",
                username="mira_user",
                email="alexa@mira.local",
                display_name="MIRA Companion User",
                password_hash=hash_password("mira-password-123")
            )
            db.add(user)
            db.commit()

        phone2 = db.query(Device).filter(Device.device_name == "Phone 2 (Primary Companion)").first()
        if not phone2:
            phone2 = Device(
                device_id="00000000-0000-4000-8000-000000000002",
                user_id=user.user_id,
                device_name="Phone 2 (Primary Companion)",
                device_type="phone_companion",
                platform="android",
                status="online",
                auth_token_hash=hash_token("phone2-token"),
                capabilities=["voice_input", "display_screen", "approval_shield"],
                last_heartbeat_at=now_utc()
            )
            db.add(phone2)

        win_agent = db.query(Device).filter(Device.device_type == "windows_workstation").first()
        if not win_agent:
            win_agent = Device(
                device_id="00000000-0000-4000-8000-000000000003",
                user_id=user.user_id,
                device_name="Windows 11 Workstation Agent",
                device_type="windows_workstation",
                platform="windows_11",
                status="online",
                auth_token_hash=hash_token("win-token"),
                capabilities=["filesystem_write", "filesystem_read", "filesystem_list"],
                last_heartbeat_at=now_utc()
            )
            db.add(win_agent)
            
        db.commit()

    # Per-request DB session
    @app.before_request
    def before_request():
        g.db = SessionLocal()

    @app.teardown_request
    def teardown_request(exception=None):
        db = g.pop('db', None)
        if db is not None:
            db.close()

    def get_current_user_id() -> str:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
            payload = decode_access_token(token)
            if payload and "sub" in payload:
                return payload["sub"]
        return "00000000-0000-4000-8000-000000000001"

    # --- Health Endpoints ---
    @app.route("/")
    def index():
        return jsonify({
            "service": "MIRA Backend API",
            "status": "online",
            "health": "/api/health"
        })

    @app.route("/health")
    @app.route("/api/health")
    @app.route("/api/v1/health")
    def health_check():
        db_healthy = False
        try:
            g.db.execute(text("SELECT 1"))
            db_healthy = True
        except Exception:
            db_healthy = False

        agent_count = g.db.query(Device).filter(Device.device_type == "windows_workstation").count()
        return jsonify({
            "status": "healthy" if db_healthy else "degraded",
            "app_env": settings.APP_ENV,
            "database": {
                "status": "connected" if db_healthy else "error",
                "dialect": g.db.bind.dialect.name
            },
            "windows_workstation_agents": agent_count,
            "workspace_root": settings.WORKSPACE_ROOT
        })

    # --- Authentication Endpoints ---
    @app.route("/api/v1/auth/register", methods=["POST"])
    def register():
        data = request.get_json(force=True) or {}
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        display_name = data.get("display_name", username)

        if not username or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        existing = g.db.query(User).filter((User.username == username) | (User.email == email)).first()
        if existing:
            return jsonify({"error": "Username or email already exists"}), 409

        user = User(
            username=username,
            email=email,
            display_name=display_name,
            password_hash=hash_password(password)
        )
        g.db.add(user)
        g.db.commit()
        g.db.refresh(user)

        token = create_access_token({"sub": user.user_id, "username": user.username})
        return jsonify({
            "user_id": user.user_id,
            "username": user.username,
            "display_name": user.display_name,
            "access_token": token,
            "token_type": "bearer"
        }), 201

    @app.route("/api/v1/auth/login", methods=["POST"])
    def login():
        data = request.get_json(force=True) or {}
        username = data.get("username")
        password = data.get("password")

        user = g.db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.password_hash):
            return jsonify({"error": "Invalid credentials"}), 401

        token = create_access_token({"sub": user.user_id, "username": user.username})
        return jsonify({
            "user_id": user.user_id,
            "username": user.username,
            "display_name": user.display_name,
            "access_token": token,
            "token_type": "bearer"
        })

    @app.route("/api/v1/auth/me")
    def get_me():
        user_id = get_current_user_id()
        user = g.db.query(User).filter(User.user_id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "display_name": user.display_name,
            "created_at": user.created_at.isoformat()
        })

    # --- Device Management ---
    @app.route("/api/devices", methods=["GET"])
    @app.route("/api/v1/devices", methods=["GET"])
    def list_devices():
        user_id = get_current_user_id()
        devices = g.db.query(Device).filter(Device.user_id == user_id).all()
        return jsonify([
            {
                "device_id": d.device_id,
                "device_name": d.device_name,
                "device_type": d.device_type,
                "platform": d.platform,
                "status": d.status,
                "capabilities": d.capabilities,
                "last_heartbeat_at": d.last_heartbeat_at.isoformat() if d.last_heartbeat_at else None,
                "registered_at": d.registered_at.isoformat()
            }
            for d in devices
        ])

    @app.route("/api/v1/devices/enroll", methods=["POST"])
    def enroll_device():
        user_id = get_current_user_id()
        data = request.get_json(force=True) or {}
        device = Device(
            user_id=user_id,
            device_name=data.get("device_name", "Registered Device"),
            device_type=data.get("device_type", "windows_workstation"),
            platform=data.get("platform", "windows_11"),
            status="online",
            auth_token_hash=hash_token(data.get("auth_token", "default")),
            capabilities=data.get("capabilities", []),
            last_heartbeat_at=now_utc()
        )
        g.db.add(device)
        g.db.commit()
        g.db.refresh(device)
        return jsonify({
            "device_id": device.device_id,
            "device_name": device.device_name,
            "status": device.status,
            "registered_at": device.registered_at.isoformat()
        }), 201

    @app.route("/api/v1/devices/<device_id>/heartbeat", methods=["POST"])
    def device_heartbeat(device_id):
        device = g.db.query(Device).filter(Device.device_id == device_id).first()
        if not device:
            return jsonify({"error": "Device not found"}), 404
        device.last_heartbeat_at = now_utc()
        device.status = "online"
        data = request.get_json(silent=True) or {}
        if "capabilities" in data:
            device.capabilities = data["capabilities"]
        g.db.commit()
        return jsonify({"status": "acknowledged", "last_heartbeat": device.last_heartbeat_at.isoformat()})

    @app.route("/api/v1/devices/<device_id>/revoke", methods=["POST"])
    def revoke_device(device_id):
        user_id = get_current_user_id()
        device = g.db.query(Device).filter(Device.device_id == device_id, Device.user_id == user_id).first()
        if not device:
            return jsonify({"error": "Device not found"}), 404
        device.status = "suspended"
        g.db.commit()
        return jsonify({"status": "revoked", "device_id": device_id})

    # --- Task Management ---
    @app.route("/api/tasks", methods=["GET"])
    @app.route("/api/v1/tasks", methods=["GET"])
    def list_tasks():
        user_id = get_current_user_id()
        tasks = g.db.query(Task).filter(Task.user_id == user_id).order_by(Task.created_at.desc()).all()
        return jsonify([
            {
                "task_id": t.task_id,
                "title": t.title,
                "description": t.description,
                "raw_prompt": t.raw_prompt,
                "status": t.status,
                "risk_level": t.risk_level,
                "consequential": t.consequential,
                "approval_id": t.approval_id,
                "created_at": t.created_at.isoformat(),
                "updated_at": t.updated_at.isoformat(),
                "completed_at": t.completed_at.isoformat() if t.completed_at else None
            }
            for t in tasks
        ])

    @app.route("/api/tasks", methods=["POST"])
    @app.route("/api/v1/tasks", methods=["POST"])
    def create_task():
        user_id = get_current_user_id()
        data = request.get_json(force=True) or {}
        raw_prompt = data.get("raw_prompt", "").strip()
        if not raw_prompt:
            return jsonify({"error": "raw_prompt is required"}), 400

        device_id = data.get("device_id")
        if not device_id:
            dev = g.db.query(Device).filter(Device.user_id == user_id).first()
            device_id = dev.device_id if dev else "00000000-0000-4000-8000-000000000002"

        plan = TaskPlanner.plan_task(raw_prompt)
        title = data.get("title") or plan["title"]
        desc = data.get("description") or plan["description"]

        risk, consequential, requires_approval = PolicyEngine.evaluate_task(
            plan["tool_name"], plan["arguments"]
        )

        task = Task(
            user_id=user_id,
            device_id=device_id,
            title=title,
            description=desc,
            raw_prompt=raw_prompt,
            status="pending_confirmation",
            risk_level=risk,
            consequential=consequential,
            tool_calls=[{
                "call_id": "call-1",
                "tool_name": plan["tool_name"],
                "arguments": plan["arguments"],
                "verification_plan": plan.get("verification_plan")
            }]
        )
        g.db.add(task)
        g.db.commit()
        g.db.refresh(task)

        g.db.add(Event(
            task_id=task.task_id,
            event_name="task_created",
            payload={"status": task.status, "risk_level": risk}
        ))
        g.db.commit()

        return jsonify({
            "task_id": task.task_id,
            "title": task.title,
            "description": task.description,
            "raw_prompt": task.raw_prompt,
            "status": task.status,
            "risk_level": task.risk_level,
            "consequential": task.consequential,
            "plan": plan,
            "created_at": task.created_at.isoformat()
        }), 201

    @app.route("/api/tasks/<task_id>", methods=["GET"])
    @app.route("/api/v1/tasks/<task_id>", methods=["GET"])
    def get_task(task_id):
        user_id = get_current_user_id()
        task = g.db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404

        artifacts = g.db.query(Artifact).filter(Artifact.task_id == task_id).all()
        events = g.db.query(Event).filter(Event.task_id == task_id).order_by(Event.created_at.asc()).all()

        return jsonify({
            "task_id": task.task_id,
            "title": task.title,
            "description": task.description,
            "raw_prompt": task.raw_prompt,
            "status": task.status,
            "risk_level": task.risk_level,
            "consequential": task.consequential,
            "approval_id": task.approval_id,
            "tool_calls": task.tool_calls,
            "verification_result": task.verification_result,
            "artifacts": [
                {
                    "artifact_id": a.artifact_id,
                    "filename": a.filename,
                    "byte_size": a.byte_size,
                    "sha256": a.sha256_hash,
                    "storage_path": a.storage_path,
                    "verification_status": a.verification_status
                }
                for a in artifacts
            ],
            "events": [
                {"event_name": e.event_name, "payload": e.payload, "created_at": e.created_at.isoformat()}
                for e in events
            ],
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat(),
            "completed_at": task.completed_at.isoformat() if task.completed_at else None
        })

    @app.route("/api/tasks/<task_id>/confirm", methods=["POST"])
    @app.route("/api/v1/tasks/<task_id>/confirm", methods=["POST"])
    def confirm_task(task_id):
        user_id = get_current_user_id()
        task = g.db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404

        try:
            validate_state_transition(task.status, "confirmed")
        except InvalidStateTransitionError as e:
            return jsonify({"error": str(e)}), 400

        task.status = "confirmed"
        task.updated_at = now_utc()
        g.db.add(Event(task_id=task.task_id, event_name="intent_confirmed", payload={"confirmed_by": user_id}))
        g.db.commit()

        tool_name = task.tool_calls[0]["tool_name"] if task.tool_calls else "filesystem_write"
        args = task.tool_calls[0].get("arguments", {}) if task.tool_calls else {}
        risk, consequential, requires_approval = PolicyEngine.evaluate_task(tool_name, args)

        if requires_approval:
            task.status = "awaiting_approval"
            approval = Approval(
                task_id=task.task_id,
                user_id=task.user_id,
                requested_by_device_id=task.device_id,
                target_tool=tool_name,
                action_summary=task.title,
                parameters=args,
                risk_level=risk,
                status="pending",
                expires_at=now_utc() + datetime.timedelta(seconds=settings.DEFAULT_APPROVAL_TTL_SECONDS)
            )
            g.db.add(approval)
            g.db.commit()
            g.db.refresh(approval)
            task.approval_id = approval.approval_id
            g.db.commit()
            return jsonify({
                "status": "awaiting_approval",
                "approval_id": approval.approval_id,
                "expires_at": approval.expires_at.isoformat()
            })
        else:
            job = JobDispatcher.dispatch_task(g.db, task)
            return jsonify({
                "status": "executing",
                "job_id": job.job_id if job else None,
                "dispatched_to": job.device_id if job else None
            })

    @app.route("/api/tasks/<task_id>/cancel", methods=["POST"])
    @app.route("/api/v1/tasks/<task_id>/cancel", methods=["POST"])
    def cancel_task(task_id):
        user_id = get_current_user_id()
        task = g.db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        try:
            validate_state_transition(task.status, "cancelled")
        except InvalidStateTransitionError as e:
            return jsonify({"error": str(e)}), 400
        task.status = "cancelled"
        task.updated_at = now_utc()
        g.db.add(Event(task_id=task.task_id, event_name="task_cancelled", payload={"cancelled_by": user_id}))
        g.db.commit()
        return jsonify({"status": "cancelled", "task_id": task_id})

    @app.route("/api/tasks/<task_id>/events", methods=["GET"])
    @app.route("/api/v1/tasks/<task_id>/events", methods=["GET"])
    def get_task_events(task_id):
        user_id = get_current_user_id()
        task = g.db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        events = g.db.query(Event).filter(Event.task_id == task_id).order_by(Event.created_at.asc()).all()
        return jsonify([
            {"event_id": e.event_id, "event_name": e.event_name, "payload": e.payload, "created_at": e.created_at.isoformat()}
            for e in events
        ])

    @app.route("/api/tasks/<task_id>/result", methods=["GET"])
    @app.route("/api/v1/tasks/<task_id>/result", methods=["GET"])
    def get_task_result(task_id):
        user_id = get_current_user_id()
        task = g.db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        artifacts = g.db.query(Artifact).filter(Artifact.task_id == task_id).all()
        return jsonify({
            "task_id": task.task_id,
            "status": task.status,
            "verification_result": task.verification_result,
            "artifacts": [
                {
                    "artifact_id": a.artifact_id,
                    "filename": a.filename,
                    "byte_size": a.byte_size,
                    "sha256": a.sha256_hash,
                    "storage_path": a.storage_path,
                    "verification_status": a.verification_status,
                    "verification_details": a.verification_details
                }
                for a in artifacts
            ],
            "completed_at": task.completed_at.isoformat() if task.completed_at else None
        })

    # --- Approval Management ---
    @app.route("/api/approvals", methods=["GET"])
    @app.route("/api/v1/approvals", methods=["GET"])
    def list_approvals():
        user_id = get_current_user_id()
        approvals = g.db.query(Approval).filter(Approval.user_id == user_id).order_by(Approval.created_at.desc()).all()
        return jsonify([
            {
                "approval_id": a.approval_id,
                "task_id": a.task_id,
                "target_tool": a.target_tool,
                "action_summary": a.action_summary,
                "parameters": a.parameters,
                "risk_level": a.risk_level,
                "status": a.status,
                "expires_at": a.expires_at.isoformat(),
                "created_at": a.created_at.isoformat()
            }
            for a in approvals
        ])

    @app.route("/api/approvals/<approval_id>", methods=["GET"])
    @app.route("/api/v1/approvals/<approval_id>", methods=["GET"])
    def get_approval(approval_id):
        user_id = get_current_user_id()
        approval = g.db.query(Approval).filter(Approval.approval_id == approval_id, Approval.user_id == user_id).first()
        if not approval:
            return jsonify({"error": "Approval not found"}), 404
        return jsonify({
            "approval_id": approval.approval_id,
            "task_id": approval.task_id,
            "target_tool": approval.target_tool,
            "action_summary": approval.action_summary,
            "parameters": approval.parameters,
            "risk_level": approval.risk_level,
            "status": approval.status,
            "expires_at": approval.expires_at.isoformat(),
            "created_at": approval.created_at.isoformat()
        })

    @app.route("/api/approvals/<approval_id>", methods=["POST"])
    @app.route("/api/approvals/<approval_id>/approve", methods=["POST"])
    @app.route("/api/v1/approvals/<approval_id>/approve", methods=["POST"])
    def approve_approval(approval_id):
        user_id = get_current_user_id()
        approval = g.db.query(Approval).filter(Approval.approval_id == approval_id, Approval.user_id == user_id).first()
        if not approval:
            return jsonify({"error": "Approval not found"}), 404

        data = request.get_json(silent=True) or {}
        decision = data.get("decision", "approved").lower()
        if decision in ("reject", "rejected"):
            return reject_approval(approval_id)

        if approval.status != "pending":
            return jsonify({"error": f"Approval ticket is already '{approval.status}'"}), 400

        if now_utc() > approval.expires_at:
            approval.status = "expired"
            g.db.commit()
            return jsonify({"error": "Approval ticket has expired"}), 410

        task = g.db.query(Task).filter(Task.task_id == approval.task_id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404

        approval.status = "approved"
        approval.decision_at = now_utc()
        approval.decision_by_user_id = user_id
        approval.decision_reason = data.get("justification")
        
        validate_state_transition(task.status, "approved")
        task.status = "approved"
        g.db.add(Event(task_id=task.task_id, event_name="approval_granted", payload={"reason": data.get("justification")}))
        g.db.commit()

        job = JobDispatcher.dispatch_task(g.db, task)
        return jsonify({"status": "approved", "task_status": "executing", "job_id": job.job_id if job else None})

    @app.route("/api/approvals/<approval_id>/reject", methods=["POST"])
    @app.route("/api/v1/approvals/<approval_id>/reject", methods=["POST"])
    def reject_approval(approval_id):
        user_id = get_current_user_id()
        approval = g.db.query(Approval).filter(Approval.approval_id == approval_id, Approval.user_id == user_id).first()
        if not approval:
            return jsonify({"error": "Approval not found"}), 404
        data = request.get_json(silent=True) or {}

        approval.status = "rejected"
        approval.decision_at = now_utc()
        approval.decision_by_user_id = user_id
        approval.decision_reason = data.get("justification")

        task = g.db.query(Task).filter(Task.task_id == approval.task_id).first()
        if task:
            validate_state_transition(task.status, "rejected")
            task.status = "rejected"
            g.db.add(Event(task_id=task.task_id, event_name="approval_rejected", payload={"reason": data.get("justification")}))
        g.db.commit()
        return jsonify({"status": "rejected", "task_status": "rejected"})

    # --- Agent Bridge ---
    @app.route("/api/v1/agent/jobs/pending", methods=["GET"])
    def get_pending_jobs():
        device_id = request.args.get("device_id")
        query = g.db.query(Job).filter(Job.status == "dispatched")
        if device_id:
            query = query.filter(Job.device_id == device_id)
        jobs = query.order_by(Job.dispatched_at.asc()).all()
        return jsonify([
            {
                "job_id": j.job_id,
                "task_id": j.task_id,
                "device_id": j.device_id,
                "tool_name": j.tool_name,
                "arguments": j.arguments,
                "dispatched_at": j.dispatched_at.isoformat()
            }
            for j in jobs
        ])

    @app.route("/api/v1/agent/jobs/<job_id>/result", methods=["POST"])
    def submit_job_result(job_id):
        job = g.db.query(Job).filter(Job.job_id == job_id).first()
        if not job:
            return jsonify({"error": "Job not found"}), 404

        task = g.db.query(Task).filter(Task.task_id == job.task_id).first()
        if not task:
            return jsonify({"error": "Associated task not found"}), 404

        data = request.get_json(force=True) or {}
        exec_status = data.get("status", "completed")
        tool_output = data.get("tool_output", {})
        error_summary = data.get("error_summary")

        job.completed_at = now_utc()
        job.result = tool_output
        job.error_summary = error_summary

        if exec_status == "failed":
            job.status = "failed"
            validate_state_transition(task.status, "failed")
            task.status = "failed"
            g.db.add(Event(task_id=task.task_id, event_name="tool_execution_failed", payload={"error": error_summary}))
            g.db.commit()
            return jsonify({"status": "recorded", "task_status": "failed"})

        # Transition to verifying
        validate_state_transition(task.status, "verifying")
        task.status = "verifying"
        g.db.commit()

        # Independent result verification
        filename = tool_output.get("filename", "mira-test.txt")
        reported_hash = tool_output.get("sha256")
        expected_content = None
        if task.tool_calls and len(task.tool_calls) > 0:
            expected_content = task.tool_calls[0].get("arguments", {}).get("content")

        verified, v_details = ResultVerifier.verify_file_artifact(
            filename=filename,
            expected_content=expected_content,
            expected_hash=reported_hash,
            workspace_root=settings.WORKSPACE_ROOT
        )

        task.verification_result = v_details

        if verified:
            artifact = Artifact(
                task_id=task.task_id,
                user_id=task.user_id,
                device_id=job.device_id,
                filename=v_details["filename"],
                content_type="text/plain",
                byte_size=v_details["byte_size"],
                sha256_hash=v_details["sha256"],
                storage_path=v_details["path"],
                retention_policy={"tier": "standard", "ttl_days": 30},
                verification_status="verified",
                verification_details=v_details
            )
            g.db.add(artifact)
            job.status = "completed"
            validate_state_transition(task.status, "completed")
            task.status = "completed"
            task.completed_at = now_utc()

            g.db.add(Event(
                task_id=task.task_id,
                event_name="verification_succeeded",
                payload={"sha256": v_details["sha256"], "size": v_details["byte_size"]}
            ))
            g.db.add(Event(
                task_id=task.task_id,
                event_name="task_completed",
                payload={"artifact_id": artifact.artifact_id}
            ))
            g.db.commit()
            return jsonify({
                "status": "verified_and_completed",
                "task_status": "completed",
                "artifact_id": artifact.artifact_id,
                "verification": v_details
            })
        else:
            job.status = "failed"
            validate_state_transition(task.status, "failed")
            task.status = "failed"
            task.completed_at = now_utc()
            g.db.add(Event(task_id=task.task_id, event_name="verification_failed", payload=v_details))
            g.db.commit()
            return jsonify({
                "status": "verification_failed",
                "task_status": "failed",
                "verification": v_details
            })

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
