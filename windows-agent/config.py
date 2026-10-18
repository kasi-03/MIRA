import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class AgentConfig:
    BACKEND_URL: str = os.getenv("MIRA_BACKEND_URL", "http://127.0.0.1:5000")
    DEVICE_ID: str = os.getenv("WINDOWS_AGENT_DEVICE_ID", "00000000-0000-4000-8000-000000000003")
    DEVICE_NAME: str = "Windows 11 Workstation Agent"
    AGENT_SECRET: str = os.getenv("WINDOWS_MCP_SECRET_KEY", "mira-workstation-shared-secret-key-8888")
    WORKSPACE_ROOT: str = os.getenv("WINDOWS_WORKSPACE_ROOT", str(BASE_DIR / "storage" / "workspace"))
    NODE_PATH: str = os.getenv("NODE_PATH", "node")
    MCP_SERVER_SCRIPT: str = str(BASE_DIR / "mcp-runtime" / "src" / "server.js")
    POLL_INTERVAL_SECONDS: float = 2.0
    HEARTBEAT_INTERVAL_SECONDS: float = 30.0

config = AgentConfig()
