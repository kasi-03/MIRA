from flask import Flask, jsonify
from flask_cors import CORS
from .database.db import init_db
from .api.tasks import tasks_bp
from .api.approvals import approvals_bp
from .api.artifacts import artifacts_bp
from .api.events import events_bp
from .api.health import health_bp

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize SQLite database tables
    init_db()

    # Register API Blueprints
    app.register_blueprint(tasks_bp)
    app.register_blueprint(approvals_bp)
    app.register_blueprint(artifacts_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(health_bp)

    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({"success": False, "error": "NOT_FOUND", "message": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"success": False, "error": "SERVER_ERROR", "message": str(e)}), 500

    return app
