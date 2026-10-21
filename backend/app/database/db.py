import sqlite3
from .. import config

def get_db_connection() -> sqlite3.Connection:
    """Returns a SQLite connection with WAL journal mode and dictionary row access."""
    conn = sqlite3.connect(str(config.DB_PATH), timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    """Initializes tables matching the MIRA JSON schemas."""
    conn = get_db_connection()
    with conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS devices (
            device_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            device_name TEXT NOT NULL,
            device_type TEXT NOT NULL,
            status TEXT NOT NULL,
            last_seen_at TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tasks (
            task_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            device_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            raw_prompt TEXT NOT NULL,
            status TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            consequential INTEGER NOT NULL,
            approval_id TEXT,
            tool_name TEXT,
            tool_arguments TEXT,
            error_message TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS approvals (
            approval_id TEXT PRIMARY KEY,
            task_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            requested_by_device_id TEXT NOT NULL,
            target_tool TEXT NOT NULL,
            action_summary TEXT NOT NULL,
            parameters TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            status TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS artifacts (
            artifact_id TEXT PRIMARY KEY,
            task_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            device_id TEXT NOT NULL,
            filename TEXT NOT NULL,
            content_type TEXT NOT NULL,
            byte_size INTEGER NOT NULL,
            sha256_hash TEXT NOT NULL,
            retention_policy TEXT NOT NULL,
            verification_status TEXT NOT NULL,
            download_url TEXT NOT NULL,
            file_path TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        """)
    conn.close()
