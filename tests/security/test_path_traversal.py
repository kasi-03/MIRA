import pytest
from mira_mcp.security.workspace_guard import validate_workspace_path, WorkspaceViolationError

def test_valid_path_inside_workspace():
    path = validate_workspace_path("poster_1.svg", subfolder="artifacts")
    assert "artifacts" in str(path)
    assert path.name == "poster_1.svg"

def test_reject_directory_traversal():
    with pytest.raises(WorkspaceViolationError, match="escapes workspace boundary"):
        validate_workspace_path("../../secret.txt", subfolder="artifacts")

def test_reject_absolute_path_escape():
    with pytest.raises(WorkspaceViolationError, match="escapes workspace boundary"):
        validate_workspace_path(r"C:\Windows\System32\cmd.exe", subfolder="artifacts")
