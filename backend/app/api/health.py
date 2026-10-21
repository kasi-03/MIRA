import socket
from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__, url_prefix="/api/health")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

@health_bp.route("", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "mira-backend",
        "version": "1.0.0",
        "storage": "sqlite-wal",
        "workstation_agent": "fastmcp-windows",
        "local_ip": get_local_ip(),
    })
