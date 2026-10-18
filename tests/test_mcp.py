import pytest
import sys
from pathlib import Path

# Add windows-agent to path
agent_dir = Path(__file__).resolve().parent.parent / "windows-agent"
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from mcp_client import MCPRuntimeClient

@pytest.fixture
def mcp():
    return MCPRuntimeClient()

def test_mcp_filesystem_write_and_read(mcp):
    # Write
    filename = "mcp_test_file.txt"
    content = "Hello Model Context Protocol"
    ok, res = mcp.execute_tool("filesystem_write", {"filename": filename, "content": content})
    assert ok is True
    assert res["success"] is True
    assert res["filename"] == filename
    assert "sha256" in res
    assert res["size"] == len(content.encode("utf-8"))

    # Read back
    read_ok, read_res = mcp.execute_tool("filesystem_read", {"filename": filename})
    assert read_ok is True
    assert read_res["content"] == content
    assert read_res["sha256"] == res["sha256"]

def test_mcp_filesystem_list(mcp):
    ok, res = mcp.execute_tool("filesystem_list", {"directory": "."})
    assert ok is True
    assert "files" in res
    assert isinstance(res["files"], list)

def test_mcp_path_traversal_rejection(mcp):
    ok, res = mcp.execute_tool("filesystem_write", {"filename": "../../escape_mcp.txt", "content": "attack"})
    assert ok is False
    assert "Path traversal escape detected" in res["error"]
