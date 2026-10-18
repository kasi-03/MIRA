from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Device, User, now_utc
from ..security import get_current_user_id, hash_token

router = APIRouter(prefix="/devices", tags=["Devices"])

class DeviceEnrollRequest(BaseModel):
    device_name: str
    device_type: str # phone_primary, phone_companion, windows_workstation, cloud_backend
    platform: str # android, ios, windows_11, linux_container
    capabilities: Optional[List[str]] = []
    auth_token: Optional[str] = "mira-default-token"

class HeartbeatRequest(BaseModel):
    status: Optional[str] = "online"
    capabilities: Optional[List[str]] = None
    ip_address: Optional[str] = None

@router.get("")
def list_devices(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    devices = db.query(Device).filter(Device.user_id == user_id).all()
    return [
        {
            "device_id": d.device_id,
            "device_name": d.device_name,
            "device_type": d.device_type,
            "platform": d.platform,
            "status": d.status,
            "capabilities": d.capabilities,
            "last_heartbeat_at": d.last_heartbeat_at.isoformat() if d.last_heartbeat_at else None,
            "registered_at": d.registered_at.isoformat()
        }
        for d in devices
    ]

@router.post("/enroll", status_code=status.HTTP_201_CREATED)
def enroll_device(payload: DeviceEnrollRequest, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Check user exists or auto-create dev user
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        user = User(
            user_id=user_id,
            username="devuser",
            email="dev@mira.local",
            display_name="Dev User",
            password_hash="dev"
        )
        db.add(user)
        db.commit()

    device = Device(
        user_id=user_id,
        device_name=payload.device_name,
        device_type=payload.device_type,
        platform=payload.platform,
        status="online",
        auth_token_hash=hash_token(payload.auth_token or "dev-token"),
        capabilities=payload.capabilities or [],
        last_heartbeat_at=now_utc()
    )
    db.add(device)
    db.commit()
    db.refresh(device)

    return {
        "device_id": device.device_id,
        "device_name": device.device_name,
        "status": device.status,
        "registered_at": device.registered_at.isoformat()
    }

@router.post("/{device_id}/heartbeat")
def device_heartbeat(device_id: str, payload: HeartbeatRequest = None, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not registered")
    
    device.last_heartbeat_at = now_utc()
    device.status = "online"
    if payload:
        if payload.capabilities:
            device.capabilities = payload.capabilities
        if payload.ip_address:
            device.ip_address = payload.ip_address
    db.commit()
    return {"status": "acknowledged", "last_heartbeat": device.last_heartbeat_at.isoformat()}

@router.post("/{device_id}/revoke")
def revoke_device(device_id: str, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.device_id == device_id, Device.user_id == user_id).first()
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")
    device.status = "suspended"
    db.commit()
    return {"status": "revoked", "device_id": device_id}
