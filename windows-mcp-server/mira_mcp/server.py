from mcp.server.mcpserver import MCPServer
from .tools.artifact_tools import (
    generate_svg_poster as tool_generate_svg,
    build_document as tool_build_doc,
    export_telemetry as tool_export_telemetry,
)
from .tools.task_execution import run_sandboxed_script as tool_run_script

server = MCPServer(
    name="mira-workstation",
    title="MIRA Windows Workstation Execution Server",
    description="Native host agent executing sandboxed vector graphics, telemetry, and scripts on Windows 11",
    version="1.0.0",
)

@server.tool(name="generate_svg_poster", description="Generates a high-fidelity vector graphics poster with themes, geometry, and typography.")
def generate_svg_poster(
    task_id: str,
    title: str,
    subtitle: str = "",
    theme: str = "cyber_neon",
    width: int = 1200,
    height: int = 1600,
) -> dict:
    return tool_generate_svg(task_id, title, subtitle, theme, width, height)

@server.tool(name="build_document", description="Compiles structured markdown documents or notes into verified files.")
def build_document(task_id: str, title: str, sections: list[dict], format: str = "markdown") -> dict:
    return tool_build_doc(task_id, title, sections, format)

@server.tool(name="export_telemetry", description="Collects CPU, memory, disk, and battery counters from host Windows workstation.")
def export_telemetry(task_id: str, include_gpu: bool = False) -> dict:
    return tool_export_telemetry(task_id, include_gpu)

@server.tool(name="run_sandboxed_script", description="Executes an authorized python script in the sandboxed workspace. Requires user approval.")
def run_sandboxed_script(
    task_id: str,
    script_name: str,
    arguments: list[str] | None = None,
    timeout_seconds: int = 60,
) -> dict:
    return tool_run_script(task_id, script_name, arguments, timeout_seconds)

# Export Streamable HTTP / SSE ASGI application for Uvicorn
asgi_app = server.streamable_http_app()
