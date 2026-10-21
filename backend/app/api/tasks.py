from flask import Blueprint, request, jsonify
from ..services.task_service import TaskService

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

@tasks_bp.route("", methods=["GET"])
def list_tasks():
    limit = request.args.get("limit", 50, type=int)
    tasks = TaskService.get_tasks(limit=limit)
    return jsonify({"success": True, "data": tasks})

@tasks_bp.route("/<task_id>", methods=["GET"])
def get_task(task_id):
    task = TaskService.get_task(task_id)
    if not task:
        return jsonify({"success": False, "error": "TASK_NOT_FOUND", "message": f"Task '{task_id}' not found"}), 404
    return jsonify({"success": True, "data": task})

@tasks_bp.route("", methods=["POST"])
def create_task():
    body = request.get_json() or {}
    raw_prompt = body.get("raw_prompt")
    if not raw_prompt or not raw_prompt.strip():
        return jsonify({"success": False, "error": "INVALID_PROMPT", "message": "raw_prompt is required"}), 400

    device_id = body.get("device_id")
    task = TaskService.create_task(raw_prompt.strip(), device_id=device_id)
    return jsonify({"success": True, "data": task}), 201

@tasks_bp.route("/<task_id>/confirm", methods=["POST"])
def confirm_task(task_id):
    try:
        task = TaskService.confirm_task(task_id)
        return jsonify({"success": True, "data": task})
    except ValueError as e:
        return jsonify({"success": False, "error": "NOT_FOUND", "message": str(e)}), 404
    except Exception as e:
        return jsonify({"success": False, "error": "EXECUTION_ERROR", "message": str(e)}), 500

@tasks_bp.route("/<task_id>/cancel", methods=["POST"])
def cancel_task(task_id):
    body = request.get_json() or {}
    reason = body.get("reason", "Cancelled by user")
    task = TaskService.cancel_task(task_id, reason=reason)
    return jsonify({"success": True, "data": task})
