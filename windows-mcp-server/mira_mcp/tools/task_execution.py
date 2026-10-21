import re
import subprocess
import sys
from pathlib import Path
from ..config import SCRIPTS_DIR
from ..security.workspace_guard import validate_workspace_path, WorkspaceViolationError

SCRIPT_NAME_REGEX = re.compile(r"^[a-zA-Z0-9_\-]+\.py$")

def run_sandboxed_script(
    task_id: str,
    script_name: str,
    arguments: list[str] | None = None,
    timeout_seconds: int = 60,
) -> dict:
    """Executes a pre-registered python script inside the sandboxed workspace."""
    if not SCRIPT_NAME_REGEX.match(script_name):
        raise ValueError(f"Invalid script name '{script_name}'. Must match pattern ^[a-zA-Z0-9_-]+\\.py$")

    script_path = validate_workspace_path(script_name, subfolder="scripts")
    if not script_path.exists():
        raise FileNotFoundError(f"Script '{script_name}' does not exist in sandboxed scripts directory")

    cmd = [sys.executable, str(script_path)] + (arguments or [])

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=min(timeout_seconds, 120),
            cwd=str(SCRIPTS_DIR),
        )
        return {
            "status": "success" if proc.returncode == 0 else "error",
            "tool_name": "run_sandboxed_script",
            "task_id": task_id,
            "returncode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "timeout",
            "tool_name": "run_sandboxed_script",
            "task_id": task_id,
            "error": f"Script execution exceeded timeout limit of {timeout_seconds}s",
        }
