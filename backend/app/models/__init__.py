import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, Integer, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from ..database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=gen_uuid)
    username = Column(String(64), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    display_name = Column(String(120), nullable=False)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=now_utc, nullable=False)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc, nullable=False)

    devices = relationship("Device", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")

class Device(Base):
    __tablename__ = "devices"

    device_id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    device_name = Column(String(120), nullable=False)
    device_type = Column(String(32), nullable=False) # phone_primary, phone_companion, windows_workstation, cloud_backend
    platform = Column(String(32), nullable=False) # android, ios, windows_11, linux_container
    status = Column(String(32), default="offline", nullable=False) # online, offline, paired, unpaired, suspended
    auth_token_hash = Column(String(256), nullable=False)
    capabilities = Column(JSON, default=list, nullable=False)
    ip_address = Column(String(64), nullable=True)
    last_heartbeat_at = Column(DateTime, nullable=True)
    registered_at = Column(DateTime, default=now_utc, nullable=False)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc, nullable=False)

    user = relationship("User", back_populates="devices")
    tasks = relationship("Task", back_populates="device")

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    device_id = Column(String(36), ForeignKey("devices.device_id"), nullable=False, index=True)
    title = Column(String(120), nullable=False)
    description = Column(String(1000), nullable=True)
    raw_prompt = Column(Text, nullable=False)
    status = Column(String(32), default="pending_confirmation", nullable=False, index=True)
    risk_level = Column(String(16), default="low", nullable=False) # low, medium, high, critical
    consequential = Column(Boolean, default=False, nullable=False)
    approval_id = Column(String(36), nullable=True)
    tool_calls = Column(JSON, default=list, nullable=True)
    verification_result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=now_utc, nullable=False)
    updated_at = Column(DateTime, default=now_utc, onupdate=now_utc, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="tasks")
    device = relationship("Device", back_populates="tasks")
    events = relationship("Event", back_populates="task", cascade="all, delete-orphan")
    artifacts = relationship("Artifact", back_populates="task", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="task", cascade="all, delete-orphan")

class Approval(Base):
    __tablename__ = "approvals"

    approval_id = Column(String(36), primary_key=True, default=gen_uuid)
    task_id = Column(String(36), ForeignKey("tasks.task_id"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    requested_by_device_id = Column(String(36), ForeignKey("devices.device_id"), nullable=False)
    target_tool = Column(String(64), nullable=False)
    action_summary = Column(String(255), nullable=False)
    parameters = Column(JSON, nullable=False)
    risk_level = Column(String(16), default="medium", nullable=False)
    status = Column(String(16), default="pending", nullable=False, index=True) # pending, approved, rejected, expired, revoked
    expires_at = Column(DateTime, nullable=False)
    decision_at = Column(DateTime, nullable=True)
    decision_by_user_id = Column(String(36), nullable=True)
    decision_by_device_id = Column(String(36), nullable=True)
    decision_reason = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=now_utc, nullable=False)

class Artifact(Base):
    __tablename__ = "artifacts"

    artifact_id = Column(String(36), primary_key=True, default=gen_uuid)
    task_id = Column(String(36), ForeignKey("tasks.task_id"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    device_id = Column(String(36), ForeignKey("devices.device_id"), nullable=False)
    filename = Column(String(255), nullable=False)
    content_type = Column(String(64), nullable=False)
    byte_size = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    storage_path = Column(String(500), nullable=False)
    retention_policy = Column(JSON, default=dict, nullable=False)
    verification_status = Column(String(32), default="unverified", nullable=False) # unverified, verified, failed
    verification_details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=now_utc, nullable=False)

    task = relationship("Task", back_populates="artifacts")

class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String(36), ForeignKey("tasks.task_id"), nullable=False, index=True)
    event_name = Column(String(64), nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=now_utc, nullable=False)

    task = relationship("Task", back_populates="events")

class Job(Base):
    __tablename__ = "jobs"

    job_id = Column(String(36), primary_key=True, default=gen_uuid)
    task_id = Column(String(36), ForeignKey("tasks.task_id"), nullable=False, index=True)
    device_id = Column(String(36), ForeignKey("devices.device_id"), nullable=False, index=True)
    tool_name = Column(String(64), nullable=False)
    arguments = Column(JSON, nullable=False)
    status = Column(String(32), default="dispatched", nullable=False) # dispatched, in_progress, completed, failed
    dispatched_at = Column(DateTime, default=now_utc, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)
    error_summary = Column(String(500), nullable=True)

    task = relationship("Task", back_populates="jobs")

__all__ = ["User", "Device", "Task", "Approval", "Artifact", "Event", "Job", "gen_uuid", "now_utc"]
