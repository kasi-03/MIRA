import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "MIRA Backend"
    APP_ENV: str = os.getenv("MIRA_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")
    
    # Database: SQLite WAL by default, or Postgres if DATABASE_URL is provided
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{BASE_DIR}/storage/mira.db"
    )
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mira-insecure-development-secret-key-change-in-prod-0123456789")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "mira-jwt-dev-secret-key-0123456789abcdef")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 # 24 hours
    
    # Workspace & Agent
    WORKSPACE_ROOT: str = os.getenv("WINDOWS_WORKSPACE_ROOT", str(BASE_DIR / "storage" / "workspace"))
    ARTIFACT_STORAGE_PATH: str = os.getenv("ARTIFACT_STORAGE_PATH", str(BASE_DIR / "storage" / "artifacts"))
    DEFAULT_APPROVAL_TTL_SECONDS: int = 180
    
    # Agent Communication Secret
    AGENT_SHARED_SECRET: str = os.getenv("WINDOWS_MCP_SECRET_KEY", "mira-workstation-shared-secret-key-8888")

settings = Settings()

# Ensure directories exist
os.makedirs(Path(settings.WORKSPACE_ROOT), exist_ok=True)
os.makedirs(Path(settings.ARTIFACT_STORAGE_PATH), exist_ok=True)
os.makedirs(Path(BASE_DIR / "storage"), exist_ok=True)
