import json
import uuid
from datetime import datetime, timezone, timedelta
from ..database.db import get_db_connection

class ApprovalService:
    @staticmethod
    def create_approval(
        task_id: str,
        user_id: str,
        requested_by_device_id: str,
        target_tool: str,
        action_summary: str,
        parameters: dict,
        risk_level: str,
    ) -> dict:
        approval_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        expires_at = (now + timedelta(seconds=180)).isoformat()
        now_str = now.isoformat()

        conn = get_db_connection()
        with conn:
            conn.execute(
                """
                INSERT INTO approvals (
                    approval_id, task_id, user_id, requested_by_device_id,
                    target_tool, action_summary, parameters, risk_level,
                    status, expires_at, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    approval_id, task_id, user_id, requested_by_device_id,
                    target_tool, action_summary, json.dumps(parameters), risk_level,
                    "pending", expires_at, now_str, now_str,
                ),
            )
        conn.close()
        return ApprovalService.get_approval(approval_id)

    @staticmethod
    def get_approval(approval_id: str) -> dict | None:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM approvals WHERE approval_id = ?", (approval_id,)).fetchone()
        conn.close()
        if not row:
            return None
        return {
            "approval_id": row["approval_id"],
            "task_id": row["task_id"],
            "user_id": row["user_id"],
            "requested_by_device_id": row["requested_by_device_id"],
            "target_tool": row["target_tool"],
            "action_summary": row["action_summary"],
            "parameters": json.loads(row["parameters"]) if row["parameters"] else {},
            "risk_level": row["risk_level"],
            "status": row["status"],
            "expires_at": row["expires_at"],
            "created_at": row["created_at"],
        }

    @staticmethod
    def get_pending_approvals() -> list[dict]:
        conn = get_db_connection()
        now_str = datetime.now(timezone.utc).isoformat()
        rows = conn.execute(
            "SELECT * FROM approvals WHERE status = 'pending' AND expires_at > ? ORDER BY created_at DESC",
            (now_str,),
        ).fetchall()
        conn.close()
        result = []
        for r in rows:
            d = dict(r)
            d["parameters"] = json.loads(d["parameters"]) if d["parameters"] else {}
            result.append(d)
        return result

    @staticmethod
    def approve(approval_id: str) -> dict:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM approvals WHERE approval_id = ?", (approval_id,)).fetchone()
        if not row:
            conn.close()
            raise ValueError(f"Approval '{approval_id}' not found")

        now = datetime.now(timezone.utc)
        expires_at = datetime.fromisoformat(row["expires_at"])
        if now > expires_at:
            conn.execute("UPDATE approvals SET status = 'expired', updated_at = ? WHERE approval_id = ?", (now.isoformat(), approval_id))
            conn.commit()
            conn.close()
            raise ValueError("Approval request has expired (180s TTL)")

        conn.execute(
            "UPDATE approvals SET status = 'approved', updated_at = ? WHERE approval_id = ?",
            (now.isoformat(), approval_id),
        )
        conn.commit()
        conn.close()
        return ApprovalService.get_approval(approval_id)

    @staticmethod
    def reject(approval_id: str, reason: str = "") -> dict:
        conn = get_db_connection()
        now_str = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "UPDATE approvals SET status = 'rejected', updated_at = ? WHERE approval_id = ?",
            (now_str, approval_id),
        )
        conn.commit()
        conn.close()
        return ApprovalService.get_approval(approval_id)
