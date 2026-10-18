import pytest
import json
from backend.app.main import create_app
from backend.app.database import Base, engine, SessionLocal
from backend.app.models import User, Device, Task, Approval, Artifact, Event, Job
from backend.app.orchestrator.state_machine import validate_state_transition, InvalidStateTransitionError

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as test_client:
        yield test_client

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"
    assert "windows_workstation_agents" in data

def test_user_registration_and_login(client):
    import uuid
    uname = f"user_{uuid.uuid4().hex[:8]}"
    email = f"{uname}@example.com"
    reg_payload = {
        "username": uname,
        "email": email,
        "password": "Password123!",
        "display_name": "Test User 1"
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    reg_data = res.get_json()
    assert "access_token" in reg_data
    assert reg_data["username"] == uname

    # Login
    login_res = client.post("/api/v1/auth/login", json={"username": uname, "password": "Password123!"})
    assert login_res.status_code == 200
    assert "access_token" in login_res.get_json()

    # Invalid login
    bad_login = client.post("/api/v1/auth/login", json={"username": uname, "password": "wrong"})
    assert bad_login.status_code == 401

def test_device_enrollment_and_heartbeat(client):
    enroll_payload = {
        "device_name": "Test Laptop",
        "device_type": "windows_workstation",
        "platform": "windows_11",
        "capabilities": ["filesystem_write", "filesystem_read"]
    }
    res = client.post("/api/v1/devices/enroll", json=enroll_payload)
    assert res.status_code == 201
    data = res.get_json()
    device_id = data["device_id"]
    assert device_id is not None

    # Heartbeat
    hb_res = client.post(f"/api/v1/devices/{device_id}/heartbeat", json={"capabilities": ["filesystem_write"]})
    assert hb_res.status_code == 200
    assert hb_res.get_json()["status"] == "acknowledged"

def test_task_lifecycle_creation_and_confirmation(client):
    task_payload = {
        "raw_prompt": "Create a file named demo.txt containing 'Unit test content'"
    }
    res = client.post("/api/tasks", json=task_payload)
    assert res.status_code == 201
    data = res.get_json()
    task_id = data["task_id"]
    assert data["status"] == "pending_confirmation"
    assert data["plan"]["tool_name"] == "filesystem_write"

    # Confirm task
    confirm_res = client.post(f"/api/tasks/{task_id}/confirm")
    assert confirm_res.status_code == 200
    confirm_data = confirm_res.get_json()
    assert confirm_data["status"] == "executing"
    assert "job_id" in confirm_data

def test_invalid_state_transition():
    # Attempting to move from 'completed' to 'executing' must raise error
    with pytest.raises(InvalidStateTransitionError):
        validate_state_transition("completed", "executing")

    with pytest.raises(InvalidStateTransitionError):
        validate_state_transition("failed", "verifying")
