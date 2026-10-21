import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

STORAGE_DIR = BASE_DIR / "storage"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = STORAGE_DIR / "mira.db"

ARTIFACTS_DIR = STORAGE_DIR / "artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

MCP_SERVER_URL = os.getenv("MIRA_MCP_URL", "http://127.0.0.1:8000")
HOST = os.getenv("MIRA_BACKEND_HOST", "0.0.0.0")
PORT = int(os.getenv("MIRA_BACKEND_PORT", "5000"))

DEFAULT_USER_ID = "00000000-0000-4000-8000-000000000001"
DEFAULT_DEVICE_ID = "00000000-0000-4000-8000-000000000002"
