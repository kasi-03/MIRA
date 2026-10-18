from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Job, Task, Artifact, Event, Device, now_utc
from ..security import verify_agent_secret
from ..orchestrator.verifier import ResultVerifier
from ..orchestrator.state_machine import validate_state_transition
from ..config import settings

router = APIRouter(prefix="/agent", tags=["Agent Bridge"])

class JobResultPayload(BaseModel):
    status: str # "completed", "failed"
    tool_output: Dict[str, Any]
    error_summary: Optional[str] = None

@router.get("/jobs/pending")
def get_pending_jobs(
    device_id: Optional[str] = None,
    x_agent_secret: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.status == "dispatched")
    if device_id:
        query = query.filter(Job.device_id == device_id)
    jobs = query.order_by(Job.dispatched_at.asc()).all()

    return [
        {
            "job_id": j.job_id,
            "task_id": j.task_id,
            "device_id": j.device_id,
            "tool_name": j.tool_name,
            "arguments": j.arguments,
            "dispatched_at": j.dispatched_at.isoformat()
        }
        for j in jobs
    ]

@router.post("/jobs/{job_id}/result")
def submit_job_result(
    job_id: str,
    payload: JobResultPayload,
    x_agent_secret: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    task = db.query(Task).filter(Task.task_id == job.task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated task not found")

    job.completed_at = now_utc()
    job.result = payload.tool_output
    job.error_summary = payload.error_summary

    if payload.status == "failed":
        job.status = "failed"
        validate_state_transition(task.status, "failed")
        task.status = "failed"
        db.add(Event(task_id=task.task_id, event_name="tool_execution_failed", payload={"error": payload.error_summary}))
        db.commit()
        return {"status": "recorded", "task_status": "failed"}

    # Execution succeeded -> Transition to verifying
    validate_state_transition(task.status, "verifying")
    task.status = "verifying"
    db.commit()

    # Step 12: Independent backend verification
    filename = payload.tool_output.get("filename", "mira-test.txt")
    reported_hash = payload.tool_output.get("sha256")
    
    # Expected content from plan if available
    expected_content = None
    if task.tool_calls and len(task.tool_calls) > 0:
        expected_content = task.tool_calls[0].get("arguments", {}).get("content")

    verified, v_details = ResultVerifier.verify_file_artifact(
        filename=filename,
        expected_content=expected_content,
        expected_hash=reported_hash,
        workspace_root=settings.WORKSPACE_ROOT
    )

    task.verification_result = v_details

    if verified:
        # Create Artifact record
        artifact = Artifact(
            task_id=task.task_id,
            user_id=task.user_id,
            device_id=job.device_id,
            filename=v_details["filename"],
            content_type="text/plain",
            byte_size=v_details["byte_size"],
            sha256_hash=v_details["sha256"],
            storage_path=v_details["path"],
            retention_policy={"tier": "standard", "ttl_days": 30},
            verification_status="verified",
            verification_details=v_details
        )
        db.add(artifact)
        
        job.status = "completed"
        validate_state_transition(task.status, "completed")
        task.status = "completed"
        task.completed_at = now_utc()
        
        db.add(Event(
            task_id=task.task_id,
            event_name="verification_succeeded",
            payload={"sha256": v_details["sha256"], "size": v_details["byte_size"]}
        ))
        db.add(Event(
            task_id=task.task_id,
            event_name="task_completed",
            payload={"artifact_id": artifact.artifact_id}
        ))
        db.commit()
        db.refresh(artifact)
        
        return {
            "status": "verified_and_completed",
            "task_status": "completed",
            "artifact_id": artifact.artifact_id,
            "verification": v_details
        }
    else:
        job.status = "failed"
        validate_state_transition(task.status, "failed")
        task.status = "failed"
        task.completed_at = now_utc()
        db.add(Event(
            task_id=task.task_id,
            event_name="verification_failed",
            payload=v_details
        ))
        db.commit()
        return {
            "status": "verification_failed",
            "task_status": "failed",
            "verification": v_details
        }
