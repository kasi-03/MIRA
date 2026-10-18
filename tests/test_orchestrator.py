import pytest
from pathlib import Path
from backend.app.orchestrator.planner import TaskPlanner
from backend.app.orchestrator.policy_engine import PolicyEngine
from backend.app.orchestrator.verifier import ResultVerifier
from backend.app.config import settings

def test_planner_file_extraction():
    prompt = "Create a file named mira-test.txt containing 'MIRA integration test' inside the configured workspace"
    plan = TaskPlanner.plan_task(prompt)
    assert plan["tool_name"] == "filesystem_write"
    assert plan["arguments"]["filename"] == "mira-test.txt"
    assert plan["arguments"]["content"] == "MIRA integration test"
    assert plan["verification_plan"]["type"] == "file_content"

def test_policy_engine_risk_and_approval():
    # Low risk
    risk, cons, req_app = PolicyEngine.evaluate_task("filesystem_read", {"filename": "doc.txt"})
    assert risk == "low"
    assert cons is False
    assert req_app is False

    # Medium consequential
    risk, cons, req_app = PolicyEngine.evaluate_task("filesystem_write", {"filename": "mira.txt", "content": "hi"})
    assert risk == "medium"
    assert cons is True

    # High risk terminal
    risk, cons, req_app = PolicyEngine.evaluate_task("terminal_run", {"command": "ls"})
    assert risk == "critical"
    assert req_app is True

def test_policy_engine_path_traversal_protection():
    # Safe path
    safe_path = PolicyEngine.validate_workspace_path("subfolder/test.txt")
    assert str(safe_path).startswith(str(Path(settings.WORKSPACE_ROOT).resolve()))

    # Traversal attempt
    with pytest.raises(PermissionError):
        PolicyEngine.validate_workspace_path("../../windows/system32/cmd.exe")

    with pytest.raises(PermissionError):
        PolicyEngine.validate_workspace_path("../../../secrets.env")

def test_result_verifier_success_and_failure(tmp_path):
    test_file = tmp_path / "sample.txt"
    test_file.write_text("expected text", encoding="utf-8")

    # Success case
    ok, details = ResultVerifier.verify_file_artifact(
        filename="sample.txt",
        expected_content="expected text",
        workspace_root=str(tmp_path)
    )
    assert ok is True
    assert details["status"] == "verified"
    assert "sha256" in details

    # Content mismatch case
    ok, details = ResultVerifier.verify_file_artifact(
        filename="sample.txt",
        expected_content="different text",
        workspace_root=str(tmp_path)
    )
    assert ok is False
    assert "Content mismatch" in details["error"]

    # Missing file case
    ok, details = ResultVerifier.verify_file_artifact(
        filename="nonexistent.txt",
        workspace_root=str(tmp_path)
    )
    assert ok is False
    assert "File does not exist" in details["error"]
