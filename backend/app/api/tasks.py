import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Task, Device, Approval, Event, Artifact, User, now_utc
from ..security import get_current_user_id
from ..orchestrator.planner import TaskPlanner
from ..orchestrator.policy_engine import PolicyEngine
from ..orchestrator.state_machine import validate_state_transition
from ..orchestrator.dispatcher import JobDispatcher
from ..config import settings

router = APIRouter(prefix="/tasks", tags=["Tasks"])

class CreateTaskRequest(BaseModel):
    raw_prompt: str
    device_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

@router.get("")
def list_tasks(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).order_by(Task.created_at.desc()).all()
    return [
        {
            "task_id": t.task_id,
            "title": t.title,
            "description": t.description,
            "raw_prompt": t.raw_prompt,
            "status": t.status,
            "risk_level": t.risk_level,
            "consequential": t.consequential,
            "created_at": t.created_at.isoformat(),
            "updated_at": t.updated_at.isoformat(),
            "completed_at": t.completed_at.isoformat() if t.completed_at else None
        }
        for t in tasks
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
def create_task(payload: CreateTaskRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Verify or ensure user exists
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        user = User(user_id=user_id, username="devuser", email="dev@mira.local", display_name="Dev User", password_hash="dev")
        db.add(user)
        db.commit()

    # Determine initiating device
    device_id = payload.device_id
    if not device_id:
        dev = db.query(Device).filter(Device.user_id == user_id).first()
        if dev:
            device_id = dev.device_id
        else:
            dev = Device(
                user_id=user_id,
                device_name="Phone 2 (Primary Companion)",
                device_type="phone_companion",
                platform="android",
                status="online",
                auth_token_hash="dev",
                capabilities=["speech_input", "display_screen"]
            )
            db.add(dev)
            db.commit()
            device_id = dev.device_id

    # Plan task
    plan = TaskPlanner.plan_task(payload.raw_prompt)
    title = payload.title or plan["title"]
    desc = payload.description or plan["description"]
    
    # Assess policy
    risk, consequential, requires_approval = PolicyEngine.evaluate_task(
        plan["tool_name"], plan["arguments"]
    )

    task = Task(
        user_id=user_id,
        device_id=device_id,
        title=title,
        description=desc,
        raw_prompt=payload.raw_prompt,
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
    db.add(task)
    db.commit()
    db.refresh(task)

    # Emit event
    event = Event(
        task_id=task.task_id,
        event_name="task_created",
        payload={"status": task.status, "risk_level": risk}
    )
    db.add(event)
    db.commit()

    return {
        "task_id": task.task_id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "risk_level": task.risk_level,
        "consequential": task.consequential,
        "plan": plan,
        "created_at": task.created_at.isoformat()
    }

@router.get("/{task_id}")
def get_task(task_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    artifacts = db.query(Artifact).filter(Artifact.task_id == task_id).all()
    events = db.query(Event).filter(Event.task_id == task_id).order_by(Event.created_at.asc()).all()

    return {
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
    }

@router.post("/{task_id}/confirm")
def confirm_task(task_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    validate_state_transition(task.status, "confirmed")
    task.status = "confirmed"
    task.updated_at = now_utc()

    event = Event(task_id=task.task_id, event_name="intent_confirmed", payload={"confirmed_by": user_id})
    db.add(event)
    db.commit()

    # Check if policy requires explicit approval
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
        db.add(approval)
        db.commit()
        db.refresh(approval)
        task.approval_id = approval.approval_id
        db.commit()
        return {
            "status": "awaiting_approval",
            "approval_id": approval.approval_id,
            "expires_at": approval.expires_at.isoformat()
        }
    else:
        # Safe to dispatch to agent directly
        job = JobDispatcher.dispatch_task(db, task)
        return {
            "status": "executing",
            "job_id": job.job_id if job else None,
            "dispatched_to": job.device_id if job else None
        }

@router.post("/{task_id}/cancel")
def cancel_task(task_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    validate_state_transition(task.status, "cancelled")
    task.status = "cancelled"
    task.updated_at = now_utc()
    db.add(Event(task_id=task.task_id, event_name="task_cancelled", payload={"cancelled_by": user_id}))
    db.commit()
    return {"status": "cancelled", "task_id": task_id}

@router.get("/{task_id}/events")
def get_task_events(task_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    events = db.query(Event).filter(Event.task_id == task_id).order_by(Event.created_at.asc()).all()
    return [
        {"event_id": e.event_id, "event_name": e.event_name, "payload": e.payload, "created_at": e.created_at.isoformat()}
        for e in events
    ]

@router.get("/{task_id}/result")
def get_task_result(task_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    artifacts = db.query(Artifact).filter(Artifact.task_id == task_id).all()
    return {
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
    }
