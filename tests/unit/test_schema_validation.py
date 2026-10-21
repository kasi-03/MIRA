import json
from pathlib import Path
import jsonschema
from app.services.task_service import TaskService
from app.services.approval_service import ApprovalService

SCHEMAS_DIR = Path(__file__).resolve().parent.parent.parent / "schemas"

def test_task_schema_conformance():
    schema = json.loads((SCHEMAS_DIR / "task.schema.json").read_text("utf-8"))
    task = TaskService.create_task("Test task for schema validation")
    # Validate against JSON schema
    jsonschema.validate(instance=task, schema=schema)

def test_approval_schema_conformance():
    schema = json.loads((SCHEMAS_DIR / "approval.schema.json").read_text("utf-8"))
    approval = ApprovalService.create_approval(
        task_id="00000000-0000-4000-8000-000000000001",
        user_id="00000000-0000-4000-8000-000000000001",
        requested_by_device_id="00000000-0000-4000-8000-000000000002",
        target_tool="run_sandboxed_script",
        action_summary="Action summary adhering to schema length requirements",
        parameters={"test": True},
        risk_level="high",
    )
    jsonschema.validate(instance=approval, schema=schema)
