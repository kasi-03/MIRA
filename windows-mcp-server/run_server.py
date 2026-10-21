import sys
from pathlib import Path

# Add project root to path for imports
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import uvicorn
from mira_mcp.config import HOST, PORT
from mira_mcp.server import asgi_app

def main():
    print(f"[*] Starting MIRA Windows Laptop MCP Server on http://{HOST}:{PORT}")
    print(f"[*] Transport: Streamable HTTP (JSON-RPC) targeting MCP 2025-11-25")
    uvicorn.run(asgi_app, host=HOST, port=PORT, log_level="info")

if __name__ == "__main__":
    main()
