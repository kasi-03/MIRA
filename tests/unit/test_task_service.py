import pytest
from app.services.task_service import TaskService

def test_create_and_confirm_low_risk_task():
    task = TaskService.create_task("Create a sunset gradient poster for Design Sprint")
    assert task["status"] == "pending_confirmation"
    assert task["tool_calls"][0]["tool_name"] == "generate_svg_poster"
    assert task["consequential"] is False

    # Confirm execution
    confirmed = TaskService.confirm_task(task["task_id"])
    assert confirmed["status"] == "completed"
    assert confirmed["approval_id"] is None
    assert len(confirmed["artifacts"]) == 1

def test_create_and_confirm_consequential_task():
    task = TaskService.create_task("Run script migration.py")
    assert task["status"] == "pending_confirmation"
    assert task["tool_calls"][0]["tool_name"] == "run_sandboxed_script"
    assert task["consequential"] is True

    # Confirming consequential task enters awaiting_approval
    confirmed = TaskService.confirm_task(task["task_id"])
    assert confirmed["status"] == "awaiting_approval"
    assert confirmed["approval_id"] is not None

def test_cancel_task():
    task = TaskService.create_task("Show system telemetry")
    cancelled = TaskService.cancel_task(task["task_id"], reason="No longer needed")
    assert cancelled["status"] == "cancelled"
    assert cancelled["metadata"]["error"] == "No longer needed"
