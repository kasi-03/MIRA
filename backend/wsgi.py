import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app import create_app
from app.config import HOST, PORT

app = create_app()

if __name__ == "__main__":
    print(f"[*] Starting MIRA Backend Orchestrator on http://{HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=False)
