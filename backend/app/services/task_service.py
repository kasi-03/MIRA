import json
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from ..config import ARTIFACTS_DIR, DEFAULT_USER_ID, DEFAULT_DEVICE_ID
from ..database.db import get_db_connection
from ..security.policy_engine import PolicyEngine
from .intent_service import IntentService
from .mcp_client_service import McpClientService
from .verification_service import VerificationService, VerificationError
from .approval_service import ApprovalService

class TaskService:
    @staticmethod
    def create_task(raw_prompt: str, device_id: str | None = None, user_id: str | None = None) -> dict:
        task_id = str(uuid.uuid4())
        user_id = user_id or DEFAULT_USER_ID
        device_id = device_id or DEFAULT_DEVICE_ID
        now_str = datetime.now(timezone.utc).isoformat()

        # Parse intent into tool and arguments
        intent = IntentService.parse_intent(raw_prompt, task_id)
        policy = PolicyEngine.evaluate(intent["tool_name"])

        conn = get_db_connection()
        with conn:
            conn.execute(
                """
                INSERT INTO tasks (
                    task_id, user_id, device_id, title, description,
                    raw_prompt, status, risk_level, consequential,
                    approval_id, tool_name, tool_arguments, error_message,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    task_id, user_id, device_id, intent["title"], intent["description"],
                    raw_prompt, "pending_confirmation", policy["risk_level"],
                    1 if policy["consequential"] else 0, None, intent["tool_name"],
                    json.dumps(intent["tool_arguments"]), None, now_str, now_str,
                ),
            )
        conn.close()
        return TaskService.get_task(task_id)

    @staticmethod
    def get_task(task_id: str) -> dict | None:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,)).fetchone()
        if not row:
            conn.close()
            return None

        art_rows = conn.execute("SELECT * FROM artifacts WHERE task_id = ?", (task_id,)).fetchall()
        artifacts = []
        for a in art_rows:
            artifacts.append({
                "artifact_id": a["artifact_id"],
                "filename": a["filename"],
                "content_type": a["content_type"],
                "byte_size": a["byte_size"],
                "sha256_hash": a["sha256_hash"],
                "verification_status": a["verification_status"],
            })
        conn.close()

        tool_args = json.loads(row["tool_arguments"]) if row["tool_arguments"] else {}
        tool_calls = []
        if row["tool_name"]:
            tool_calls.append({
                "call_id": row["task_id"],
                "tool_name": row["tool_name"],
                "status": "succeeded" if row["status"] == "completed" else "dispatched",
                "arguments": tool_args,
                "started_at": row["created_at"],
            })

        metadata = {}
        if row["error_message"]:
            metadata["error"] = row["error_message"]

        return {
            "task_id": row["task_id"],
            "user_id": row["user_id"],
            "device_id": row["device_id"],
            "title": row["title"],
            "description": row["description"],
            "raw_prompt": row["raw_prompt"],
            "status": row["status"],
            "risk_level": row["risk_level"],
            "consequential": bool(row["consequential"]),
            "approval_id": row["approval_id"],
            "tool_calls": tool_calls,
            "artifacts": artifacts,
            "metadata": metadata,
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }

    @staticmethod
    def get_tasks(limit: int = 50) -> list[dict]:
        conn = get_db_connection()
        rows = conn.execute("SELECT task_id FROM tasks ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
        conn.close()
        return [TaskService.get_task(r["task_id"]) for r in rows if r]

    @staticmethod
    def confirm_task(task_id: str) -> dict:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,)).fetchone()
        if not row:
            conn.close()
            raise ValueError(f"Task '{task_id}' not found")

        now_str = datetime.now(timezone.utc).isoformat()

        if bool(row["consequential"]):
            # Requires approval modal gate
            tool_args = json.loads(row["tool_arguments"]) if row["tool_arguments"] else {}
            approval = ApprovalService.create_approval(
                task_id=task_id,
                user_id=row["user_id"],
                requested_by_device_id=row["device_id"],
                target_tool=row["tool_name"],
                action_summary=f"Authorize execution of tool '{row['tool_name']}' on workstation",
                parameters=tool_args,
                risk_level=row["risk_level"],
            )
            with conn:
                conn.execute(
                    "UPDATE tasks SET status = 'awaiting_approval', approval_id = ?, updated_at = ? WHERE task_id = ?",
                    (approval["approval_id"], now_str, task_id),
                )
            conn.close()
            return TaskService.get_task(task_id)

        # Safe low-risk tool: execute immediately
        conn.close()
        return TaskService._execute_and_verify(task_id)

    @staticmethod
    def execute_task_after_approval(task_id: str) -> dict:
        return TaskService._execute_and_verify(task_id)

    @staticmethod
    def cancel_task(task_id: str, reason: str = "") -> dict:
        now_str = datetime.now(timezone.utc).isoformat()
        conn = get_db_connection()
        with conn:
            conn.execute(
                "UPDATE tasks SET status = 'cancelled', error_message = ?, updated_at = ? WHERE task_id = ?",
                (reason, now_str, task_id),
            )
        conn.close()
        return TaskService.get_task(task_id)

    @staticmethod
    def _execute_and_verify(task_id: str) -> dict:
        now_str = datetime.now(timezone.utc).isoformat()
        conn = get_db_connection()

        # Transition to executing
        with conn:
            conn.execute("UPDATE tasks SET status = 'executing', updated_at = ? WHERE task_id = ?", (now_str, task_id))

        row = conn.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,)).fetchone()
        tool_name = row["tool_name"]
        tool_args = json.loads(row["tool_arguments"]) if row["tool_arguments"] else {}

        try:
            # 1. MCP tool dispatch
            result = McpClientService.call_tool(tool_name, tool_args)

            # 2. Transition to verifying
            now_str = datetime.now(timezone.utc).isoformat()
            with conn:
                conn.execute("UPDATE tasks SET status = 'verifying', updated_at = ? WHERE task_id = ?", (now_str, task_id))

            # 3. Verification if artifact returned
            if "artifact" in result:
                art = result["artifact"]
                VerificationService.verify_artifact(
                    file_path=art["path"],
                    expected_sha256=art["sha256"],
                    content_type=art["content_type"],
                )

                # Copy to backend artifacts storage if not already there
                dest_path = ARTIFACTS_DIR / art["filename"]
                if Path(art["path"]).resolve() != dest_path.resolve():
                    shutil.copy2(art["path"], dest_path)

                artifact_id = str(uuid.uuid4())
                with conn:
                    conn.execute(
                        """
                        INSERT INTO artifacts (
                            artifact_id, task_id, user_id, device_id,
                            filename, content_type, byte_size, sha256_hash,
                            retention_policy, verification_status, download_url,
                            file_path, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            artifact_id, task_id, row["user_id"], row["device_id"],
                            art["filename"], art["content_type"], art["byte_size"],
                            art["sha256"], "session_persistent", "verified",
                            f"/api/artifacts/{artifact_id}/content", str(dest_path), now_str,
                        ),
                    )

            # 4. Mark completed
            now_str = datetime.now(timezone.utc).isoformat()
            with conn:
                conn.execute("UPDATE tasks SET status = 'completed', updated_at = ? WHERE task_id = ?", (now_str, task_id))

        except Exception as e:
            now_str = datetime.now(timezone.utc).isoformat()
            with conn:
                conn.execute(
                    "UPDATE tasks SET status = 'failed', error_message = ?, updated_at = ? WHERE task_id = ?",
                    (str(e), now_str, task_id),
                )
        finally:
            conn.close()

        return TaskService.get_task(task_id)
