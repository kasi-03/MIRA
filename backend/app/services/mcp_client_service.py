import sys
from pathlib import Path

# Add windows-mcp-server to path for direct high-performance dispatch
MCP_DIR = Path(__file__).resolve().parent.parent.parent.parent / "windows-mcp-server"
if str(MCP_DIR) not in sys.path:
    sys.path.insert(0, str(MCP_DIR))

try:
    from mira_mcp.tools.artifact_tools import generate_svg_poster, build_document, export_telemetry
    from mira_mcp.tools.task_execution import run_sandboxed_script
    DIRECT_TOOLS_AVAILABLE = True
except ImportError:
    DIRECT_TOOLS_AVAILABLE = False

class McpClientService:
    @staticmethod
    def call_tool(tool_name: str, arguments: dict) -> dict:
        """Invokes a tool on the Windows workstation FastMCP agent."""
        if DIRECT_TOOLS_AVAILABLE:
            if tool_name == "generate_svg_poster":
                return generate_svg_poster(**arguments)
            elif tool_name == "build_document":
                return build_document(**arguments)
            elif tool_name == "export_telemetry":
                return export_telemetry(**arguments)
            elif tool_name == "run_sandboxed_script":
                return run_sandboxed_script(**arguments)
            else:
                raise ValueError(f"Unknown tool '{tool_name}'")
        raise RuntimeError("Windows MCP execution engine unavailable")
