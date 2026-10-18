from typing import Optional
from sqlalchemy.orm import Session
from ..models import Task, Job, Device, Event, now_utc
from .state_machine import validate_state_transition

class JobDispatcher:
    @staticmethod
    def dispatch_task(db: Session, task: Task) -> Optional[Job]:
        """
        Dispatches a confirmed/approved task to an available Windows workstation agent.
        """
        # Find Windows agent
        agent_device = db.query(Device).filter(
            Device.device_type == "windows_workstation",
            Device.status.in_(["online", "paired"])
        ).first()

        # If none found, assign to task's device or fallback
        target_device_id = agent_device.device_id if agent_device else task.device_id

        # Update task state
        validate_state_transition(task.status, "executing")
        task.status = "executing"
        task.updated_at = now_utc()

        # Extract tool calls from task or plan
        tool_name = "filesystem_write"
        args = {"filename": "mira-test.txt", "content": "MIRA integration test"}
        
        if task.tool_calls and len(task.tool_calls) > 0:
            tool_name = task.tool_calls[0].get("tool_name", tool_name)
            args = task.tool_calls[0].get("arguments", args)

        job = Job(
            task_id=task.task_id,
            device_id=target_device_id,
            tool_name=tool_name,
            arguments=args,
            status="dispatched"
        )
        db.add(job)

        event = Event(
            task_id=task.task_id,
            event_name="job_dispatched",
            payload={"job_id": job.job_id, "tool_name": tool_name, "device_id": target_device_id}
        )
        db.add(event)
        db.commit()
        db.refresh(job)
        return job
