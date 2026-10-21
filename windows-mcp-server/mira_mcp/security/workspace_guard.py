import os
from pathlib import Path
from ..config import WORKSPACE_ROOT

class WorkspaceViolationError(Exception):
    """Raised when a path traversal attempt is detected outside the workspace."""
    pass

def validate_workspace_path(path: str | Path, subfolder: str | None = None) -> Path:
    """
    Validates that a given relative or absolute path is strictly contained within WORKSPACE_ROOT.
    Rejects directory traversal sequences and outside references.
    """
    base = (WORKSPACE_ROOT / subfolder) if subfolder else WORKSPACE_ROOT
    base_resolved = base.resolve()

    target = Path(path)
    if not target.is_absolute():
        target = (base / target)
    target_resolved = target.resolve()

    try:
        target_resolved.relative_to(base_resolved)
    except ValueError:
        raise WorkspaceViolationError(f"Access denied: path '{path}' escapes workspace boundary '{base_resolved}'")

    return target_resolved
