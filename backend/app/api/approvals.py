from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Approval, Task, Event, now_utc
from ..security import get_current_user_id
from ..orchestrator.dispatcher import JobDispatcher
from ..orchestrator.state_machine import validate_state_transition

router = APIRouter(prefix="/approvals", tags=["Approvals"])

class ApprovalDecisionRequest(BaseModel):
    decision: str # "approved" or "rejected"
    justification: Optional[str] = None

@router.get("")
def list_approvals(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    approvals = db.query(Approval).filter(Approval.user_id == user_id).order_by(Approval.created_at.desc()).all()
    return [
        {
            "approval_id": a.approval_id,
            "task_id": a.task_id,
            "target_tool": a.target_tool,
            "action_summary": a.action_summary,
            "parameters": a.parameters,
            "risk_level": a.risk_level,
            "status": a.status,
            "expires_at": a.expires_at.isoformat(),
            "created_at": a.created_at.isoformat()
        }
        for a in approvals
    ]

@router.get("/{approval_id}")
def get_approval(approval_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    approval = db.query(Approval).filter(Approval.approval_id == approval_id, Approval.user_id == user_id).first()
    if not approval:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval ticket not found")
    return {
        "approval_id": approval.approval_id,
        "task_id": approval.task_id,
        "target_tool": approval.target_tool,
        "action_summary": approval.action_summary,
        "parameters": approval.parameters,
        "risk_level": approval.risk_level,
        "status": approval.status,
        "expires_at": approval.expires_at.isoformat(),
        "created_at": approval.created_at.isoformat()
    }

@router.post("/{approval_id}")
@router.post("/{approval_id}/decision")
def submit_decision(approval_id: str, payload: ApprovalDecisionRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    approval = db.query(Approval).filter(Approval.approval_id == approval_id, Approval.user_id == user_id).first()
    if not approval:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval not found")

    if approval.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Approval ticket is already '{approval.status}'")

    if now_utc() > approval.expires_at:
        approval.status = "expired"
        db.commit()
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="Approval ticket has expired")

    task = db.query(Task).filter(Task.task_id == approval.task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated task not found")

    decision = payload.decision.lower()
    approval.decision_at = now_utc()
    approval.decision_by_user_id = user_id
    approval.decision_reason = payload.justification

    if decision in ("approved", "approve"):
        approval.status = "approved"
        validate_state_transition(task.status, "approved")
        task.status = "approved"
        db.add(Event(task_id=task.task_id, event_name="approval_granted", payload={"reason": payload.justification}))
        db.commit()

        # Dispatch job now
        job = JobDispatcher.dispatch_task(db, task)
        return {"status": "approved", "task_status": "executing", "job_id": job.job_id if job else None}
    else:
        approval.status = "rejected"
        validate_state_transition(task.status, "rejected")
        task.status = "rejected"
        db.add(Event(task_id=task.task_id, event_name="approval_rejected", payload={"reason": payload.justification}))
        db.commit()
        return {"status": "rejected", "task_status": "rejected"}
