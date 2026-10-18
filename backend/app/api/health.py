from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db
from ..config import settings
from ..models import Device

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_healthy = False
    try:
        db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception:
        db_healthy = False

    active_agents = db.query(Device).filter(Device.device_type == "windows_workstation").count()

    return {
        "status": "healthy" if db_healthy else "degraded",
        "app_env": settings.APP_ENV,
        "database": {
            "status": "connected" if db_healthy else "error",
            "dialect": db.bind.dialect.name
        },
        "windows_workstation_agents": active_agents,
        "workspace_root": settings.WORKSPACE_ROOT
    }
