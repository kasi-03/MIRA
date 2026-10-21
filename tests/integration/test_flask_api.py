def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"
    assert data["service"] == "mira-backend"

def test_task_creation_and_confirmation_flow(client):
    # 1. Create task
    res = client.post("/api/tasks", json={"raw_prompt": "Create an emerald modern poster for AI Lab"})
    assert res.status_code == 201
    task = res.get_json()["data"]
    task_id = task["task_id"]
    assert task["status"] == "pending_confirmation"

    # 2. Confirm task
    res_confirm = client.post(f"/api/tasks/{task_id}/confirm")
    assert res_confirm.status_code == 200
    confirmed_task = res_confirm.get_json()["data"]
    assert confirmed_task["status"] == "completed"

    # 3. Retrieve artifacts
    res_art = client.get("/api/artifacts")
    assert res_art.status_code == 200
    artifacts = res_art.get_json()["data"]
    assert len(artifacts) >= 1
    art_id = artifacts[0]["artifact_id"]

    # 4. Download artifact content
    res_content = client.get(f"/api/artifacts/{art_id}/content")
    assert res_content.status_code == 200
    assert "image/svg+xml" in res_content.content_type
