from flask import Blueprint, jsonify, send_file
from ..services.artifact_service import ArtifactService

artifacts_bp = Blueprint("artifacts", __name__, url_prefix="/api/artifacts")

@artifacts_bp.route("", methods=["GET"])
def list_artifacts():
    artifacts = ArtifactService.get_artifacts()
    return jsonify({"success": True, "data": artifacts})

@artifacts_bp.route("/<artifact_id>", methods=["GET"])
def get_artifact(artifact_id):
    art = ArtifactService.get_artifact(artifact_id)
    if not art:
        return jsonify({"success": False, "error": "NOT_FOUND", "message": "Artifact not found"}), 404
    return jsonify({"success": True, "data": art})

@artifacts_bp.route("/<artifact_id>/content", methods=["GET"])
def get_artifact_content(artifact_id):
    result = ArtifactService.get_artifact_file(artifact_id)
    if not result:
        return jsonify({"success": False, "error": "NOT_FOUND", "message": "Physical artifact not found"}), 404
    file_path, content_type, filename = result
    return send_file(
        str(file_path),
        mimetype=content_type,
        as_attachment=False,
        download_name=filename,
    )
