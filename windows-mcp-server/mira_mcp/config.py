import os
from pathlib import Path

# Base project directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Target standard workstation directory with safe project-local fallback
DEFAULT_WORKSPACE = Path(r"C:\mira\workspace")
try:
    DEFAULT_WORKSPACE.mkdir(parents=True, exist_ok=True)
    WORKSPACE_ROOT = DEFAULT_WORKSPACE
except (PermissionError, OSError):
    WORKSPACE_ROOT = (BASE_DIR / "storage" / "workspace").resolve()
    WORKSPACE_ROOT.mkdir(parents=True, exist_ok=True)

# Artifacts staging path within workspace
ARTIFACTS_DIR = WORKSPACE_ROOT / "artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

# Scripts path within workspace
SCRIPTS_DIR = WORKSPACE_ROOT / "scripts"
SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)

HOST = os.getenv("MIRA_MCP_HOST", "127.0.0.1")
PORT = int(os.getenv("MIRA_MCP_PORT", "8000"))
