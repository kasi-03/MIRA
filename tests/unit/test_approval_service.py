from datetime import datetime, timezone, timedelta
import pytest
from app.services.approval_service import ApprovalService
from app.database.db import get_db_connection

def test_approval_lifecycle():
    approval = ApprovalService.create_approval(
        task_id="00000000-0000-4000-8000-000000000010",
        user_id="00000000-0000-4000-8000-000000000001",
        requested_by_device_id="00000000-0000-4000-8000-000000000002",
        target_tool="run_sandboxed_script",
        action_summary="Execute benchmark script",
        parameters={"script_name": "benchmark.py"},
        risk_level="high",
    )
    assert approval["status"] == "pending"

    # Approve
    approved = ApprovalService.approve(approval["approval_id"])
    assert approved["status"] == "approved"

def test_approval_expiry():
    approval = ApprovalService.create_approval(
        task_id="00000000-0000-4000-8000-000000000011",
        user_id="00000000-0000-4000-8000-000000000001",
        requested_by_device_id="00000000-0000-4000-8000-000000000002",
        target_tool="run_sandboxed_script",
        action_summary="Execute script",
        parameters={},
        risk_level="high",
    )

    # Force expiration in DB
    past_time = (datetime.now(timezone.utc) - timedelta(seconds=10)).isoformat()
    conn = get_db_connection()
    with conn:
        conn.execute("UPDATE approvals SET expires_at = ? WHERE approval_id = ?", (past_time, approval["approval_id"]))
    conn.close()

    # Attempting to approve expired record must raise ValueError
    with pytest.raises(ValueError, match="expired"):
        ApprovalService.approve(approval["approval_id"])

def test_approval_rejection():
    approval = ApprovalService.create_approval(
        task_id="00000000-0000-4000-8000-000000000012",
        user_id="00000000-0000-4000-8000-000000000001",
        requested_by_device_id="00000000-0000-4000-8000-000000000002",
        target_tool="run_sandboxed_script",
        action_summary="Execute script",
        parameters={},
        risk_level="high",
    )

    rejected = ApprovalService.reject(approval["approval_id"], reason="Dangerous action")
    assert rejected["status"] == "rejected"
