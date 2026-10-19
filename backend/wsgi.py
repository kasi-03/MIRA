import sys
import os
from pathlib import Path

root_dir = str(Path(__file__).resolve().parent.parent)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.main import app

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 5000))
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    print(f"Starting MIRA Flask Backend on http://{host}:{port} ...")
    app.run(host=host, port=port, debug=False)
