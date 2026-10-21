from flask import Blueprint, request, jsonify
from ..services.approval_service import ApprovalService
from ..services.task_service import TaskService

approvals_bp = Blueprint("approvals", __name__, url_prefix="/api/approvals")

@approvals_bp.route("", methods=["GET"])
def list_approvals():
    status = request.args.get("status")
    if status == "pending":
        approvals = ApprovalService.get_pending_approvals()
    else:
        approvals = ApprovalService.get_pending_approvals()
    return jsonify({"success": True, "data": approvals})

@approvals_bp.route("/<approval_id>", methods=["GET"])
def get_approval(approval_id):
    approval = ApprovalService.get_approval(approval_id)
    if not approval:
        return jsonify({"success": False, "error": "APPROVAL_NOT_FOUND", "message": "Approval request not found"}), 404
    return jsonify({"success": True, "data": approval})

@approvals_bp.route("/<approval_id>/approve", methods=["POST"])
def approve_request(approval_id):
    try:
        approval = ApprovalService.approve(approval_id)
        # Execute parent task after approval
        task = TaskService.execute_task_after_approval(approval["task_id"])
        return jsonify({"success": True, "data": {"approval": approval, "task": task}})
    except ValueError as e:
        return jsonify({"success": False, "error": "INVALID_DECISION", "message": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": "EXECUTION_ERROR", "message": str(e)}), 500

@approvals_bp.route("/<approval_id>/reject", methods=["POST"])
def reject_request(approval_id):
    body = request.get_json() or {}
    reason = body.get("reason", "Rejected by user")
    try:
        approval = ApprovalService.reject(approval_id, reason=reason)
        task = TaskService.cancel_task(approval["task_id"], reason=f"Rejected: {reason}")
        return jsonify({"success": True, "data": {"approval": approval, "task": task}})
    except Exception as e:
        return jsonify({"success": False, "error": "REJECTION_ERROR", "message": str(e)}), 500
