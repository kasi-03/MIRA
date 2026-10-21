from pathlib import Path
from ..database.db import get_db_connection

class ArtifactService:
    @staticmethod
    def get_artifacts(limit: int = 50) -> list[dict]:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM artifacts ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
        conn.close()
        results = []
        for r in rows:
            d = dict(r)
            try:
                p = Path(d["file_path"])
                if p.exists() and p.stat().st_size < 500000:
                    d["raw_content"] = p.read_text(encoding="utf-8", errors="replace")
                else:
                    d["raw_content"] = ""
            except Exception:
                d["raw_content"] = ""
            results.append(d)
        return results

    @staticmethod
    def get_artifact(artifact_id: str) -> dict | None:
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM artifacts WHERE artifact_id = ?", (artifact_id,)).fetchone()
        conn.close()
        if not row:
            return None
        d = dict(row)
        try:
            p = Path(d["file_path"])
            if p.exists() and p.stat().st_size < 500000:
                d["raw_content"] = p.read_text(encoding="utf-8", errors="replace")
            else:
                d["raw_content"] = ""
        except Exception:
            d["raw_content"] = ""
        return d

    @staticmethod
    def get_artifact_file(artifact_id: str) -> tuple[Path, str, str] | None:
        art = ArtifactService.get_artifact(artifact_id)
        if not art:
            return None
        path = Path(art["file_path"])
        if not path.exists():
            return None
        return path, art["content_type"], art["filename"]
