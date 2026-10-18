import os
from backend.app.main import app

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 5000))
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    print(f"Starting MIRA Flask Backend on http://{host}:{port} ...")
    app.run(host=host, port=port, debug=False)
