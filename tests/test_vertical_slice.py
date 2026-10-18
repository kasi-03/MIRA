import pytest
import sys
import json
from pathlib import Path

# Add windows-agent to path
agent_dir = Path(__file__).resolve().parent.parent / "windows-agent"
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from backend.app.main import create_app
from backend.app.config import settings
from mcp_client import MCPRuntimeClient
from agent import WindowsAgent

@pytest.fixture
def app_client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_end_to_end_vertical_slice_milestone(app_client):
    """
    Executes the exact 15-step Milestone End-to-End Vertical Slice:
    'Create a file named mira-test.txt containing 'MIRA integration test' inside the configured MIRA test workspace.'
    """
    # Clean up any previous test artifact
    target_file = Path(settings.WORKSPACE_ROOT) / "mira-test.txt"
    if target_file.exists():
        target_file.unlink()

    # Step 1 & 2: Phone 2 submits task to the backend, backend authenticates and creates task
    task_payload = {
        "raw_prompt": "Create a file named mira-test.txt containing 'MIRA integration test' inside the configured MIRA test workspace."
    }
    create_res = app_client.post("/api/tasks", json=task_payload)
    assert create_res.status_code == 201
    task_data = create_res.get_json()
    task_id = task_data["task_id"]

    # Step 3 & 4: Orchestrator validates request, produces structured plan, checks policy
    assert task_data["status"] == "pending_confirmation"
    plan = task_data["plan"]
    assert plan["tool_name"] == "filesystem_write"
    assert plan["arguments"]["filename"] == "mira-test.txt"
    assert plan["arguments"]["content"] == "MIRA integration test"
    assert task_data["risk_level"] == "medium"
    assert task_data["consequential"] is True

    # Step 5 & 6: Phone 2 confirms task -> backend dispatches job to Windows Agent
    confirm_res = app_client.post(f"/api/tasks/{task_id}/confirm")
    assert confirm_res.status_code == 200
    confirm_data = confirm_res.get_json()
    assert confirm_data["status"] == "executing"
    job_id = confirm_data["job_id"]
    assert job_id is not None

    # Step 7: Windows Agent polls for pending jobs
    agent = WindowsAgent()
    pending_jobs_res = app_client.get(f"/api/v1/agent/jobs/pending?device_id={agent.device_id}")
    assert pending_jobs_res.status_code == 200
    pending_jobs = pending_jobs_res.get_json()
    target_job = next((j for j in pending_jobs if j["job_id"] == job_id), None)
    assert target_job is not None
    assert target_job["tool_name"] == "filesystem_write"

    # Step 8, 9 & 10: Windows Agent invokes Node.js MCP runtime, creates file, returns evidence
    mcp = MCPRuntimeClient()
    success, mcp_evidence = mcp.execute_tool(target_job["tool_name"], target_job["arguments"])
    assert success is True
    assert mcp_evidence["success"] is True
    assert mcp_evidence["filename"] == "mira-test.txt"
    assert "sha256" in mcp_evidence
    assert mcp_evidence["size"] == len("MIRA integration test".encode("utf-8"))

    # Verify physical file existence at step 9
    assert target_file.exists()
    assert target_file.read_text(encoding="utf-8") == "MIRA integration test"

    # Step 11: Agent reports the result back to backend
    report_payload = {
        "status": "completed",
        "tool_output": mcp_evidence
    }
    report_res = app_client.post(f"/api/v1/agent/jobs/{job_id}/result", json=report_payload)
    assert report_res.status_code == 200
    report_data = report_res.get_json()

    # Step 12 & 13: Backend verifier checks file existence, hash and content, stores artifact in DB
    assert report_data["status"] == "verified_and_completed"
    assert report_data["task_status"] == "completed"
    assert "artifact_id" in report_data
    assert report_data["verification"]["status"] == "verified"
    assert report_data["verification"]["byte_size"] == len("MIRA integration test")

    # Step 14 & 15: API exposes the verified result to Phone 2; Task reaches COMPLETED only after verification
    task_final_res = app_client.get(f"/api/tasks/{task_id}")
    assert task_final_res.status_code == 200
    final_task = task_final_res.get_json()
    assert final_task["status"] == "completed"
    assert len(final_task["artifacts"]) == 1
    artifact = final_task["artifacts"][0]
    assert artifact["filename"] == "mira-test.txt"
    assert artifact["verification_status"] == "verified"
    assert artifact["sha256"] == mcp_evidence["sha256"]

    # Verify task result endpoint
    result_res = app_client.get(f"/api/tasks/{task_id}/result")
    assert result_res.status_code == 200
    result_data = result_res.get_json()
    assert result_data["status"] == "completed"
    assert len(result_data["artifacts"]) == 1

    # Verify audit event history
    events_res = app_client.get(f"/api/tasks/{task_id}/events")
    assert events_res.status_code == 200
    event_names = [e["event_name"] for e in events_res.get_json()]
    assert "task_created" in event_names
    assert "intent_confirmed" in event_names
    assert "job_dispatched" in event_names
    assert "verification_succeeded" in event_names
    assert "task_completed" in event_names
