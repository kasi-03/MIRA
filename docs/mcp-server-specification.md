# Windows Laptop FastMCP Server Specification

- **Document ID**: `MIRA-DOC-MCP-007`
- **Revision**: 1.1.0
- **Status**: Engineering Standard
- **Last Updated**: 2026-10-18

---

## 1. Overview & Workstation Role

The **Windows Laptop MCP Server** is a native service executing on the user's Windows 11 workstation. It exposes system tools, asset rendering pipelines, and script runners to the containerized Flask backend via the **Model Context Protocol (MCP)**.

### Architectural Alignment
- **Server Framework**: `FastMCP` (via official `mcp` Python SDK).
- **ASGI Host**: `Uvicorn` listening on `127.0.0.1:8000` or a secure local/VPN interface (`192.168.x.x`).
- **Transport**: **Streamable HTTP** (incorporating HTTP POST for JSON-RPC requests and Server-Sent Events for bidirectional streaming telemetry).
- **Target Protocol Version**: MCP specification **`2025-11-25` or later** (with runtime protocol negotiation supporting SDK baseline versions such as `2024-11-05`).
- **Client**: The MIRA Flask backend container is the sole authenticated MCP Client.

---

## 2. Server Architecture & Directory Structure

The server is implemented inside `windows-mcp-server/mira_mcp/`:

```text
windows-mcp-server/
├── README.md
├── requirements.txt
├── run_server.py
├── .env.example
└── mira_mcp/
    ├── __init__.py
    ├── server.py              # FastMCP instance initialization & routing
    ├── asgi.py                # Starlette/Uvicorn ASGI app wrapper
    ├── config.py              # Workstation environment & workspace path config
    ├── tools/
    │   ├── __init__.py
    │   ├── capabilities.py    # Tool registry and metadata provider
    │   ├── task_execution.py  # Script execution and computation tools
    │   └── artifact_tools.py  # SVG poster & document generation engines
    ├── execution/
    │   ├── __init__.py
    │   ├── dispatcher.py      # Request router
    │   ├── safe_executor.py   # Subprocess runner with timeouts & resource limits
    │   └── result_collector.py# Manifest generator & file hash calculator
    ├── security/
    │   ├── __init__.py
    │   ├── authentication.py  # PSK / HMAC request validator
    │   ├── workspace_guard.py # Path confinement validator (C:\mira\workspace\)
    │   └── input_validation.py# Parameter sanitizer
    └── artifacts/
        ├── __init__.py
        ├── artifact_registry.py
        └── artifact_uploader.py # Internal secure HTTP transfer endpoint
```

---

## 3. Protocol Operations & RPC Lifecycle

### A. Initialization Handshake (`initialize`)
When the Flask backend boots or connects, it issues the standard MCP `initialize` request targeting protocol version `2025-11-25` or later:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "MIRA-Flask-Backend",
      "version": "1.0.0"
    }
  }
}
```

The FastMCP server responds with its supported capabilities, negotiating the mutually supported protocol version:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "tools": { "listChanged": true },
      "logging": {}
    },
    "serverInfo": {
      "name": "MIRA-Windows-FastMCP",
      "version": "1.0.0"
    }
  }
}
```
*(Note: At runtime, if the underlying Python MCP SDK initializes with a baseline version such as `2024-11-05`, the client and server negotiate down to the latest mutually supported version. Formal compatibility testing will be conducted in Phase 4).*

### B. Tool Discovery (`tools/list`)
FastMCP automatically serializes Python type hints and Pydantic schemas into JSON Schema for tool discovery:
- `generate_svg_poster`: Creates rich SVG vector graphics.
- `build_document`: Compiles structured Markdown/PDF summaries.
- `export_telemetry`: Extracts sanitized workstation health metrics.
- `run_sandboxed_script`: Executes registered Python scripts in the sandbox.

### C. Tool Invocation (`tools/call`)
The backend invokes a tool with parameters and task tracking context:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "generate_svg_poster",
    "arguments": {
      "task_id": "c1a93b44-93e1-4c44-b0e9-b541306ef456",
      "title": "Alexa+ Innovation Hackathon",
      "subtitle": "Building Next-Gen Agentic Assistants",
      "theme": "cyber_neon",
      "width": 1200,
      "height": 1600
    }
  }
}
```

---

## 4. Workstation Security & The Workspace Guard

The Windows workstation must never expose arbitrary file system operations to remote callers.

### Workspace Guard (`security/workspace_guard.py`)
1. **Root Confinement**: All file reads, writes, and temporary operations are restricted strictly to:
   $$\text{WORKSPACE\_ROOT} = \texttt{C:\textbackslash mira\textbackslash workspace\textbackslash}$$
2. **Canonical Path Resolution**: Every requested path is resolved via `os.path.realpath` to defeat symlink and relative traversal (`..\..\Windows\`) escapes:
   ```python
   def assert_within_workspace(target_path: str) -> str:
       real_target = os.path.realpath(target_path)
       real_root = os.path.realpath(CONFIG.WORKSPACE_ROOT)
       if not real_target.startswith(real_root):
           raise SecurityException("Path traversal outside workspace root is blocked")
       return real_target
   ```
3. **Execution Sandboxing**: Script execution tools run with dropped privileges, strict CPU quotas, and a 60-second execution deadline.

---

## 5. Artifact Manifest & Delivery Subsystem

When a tool creates a file:
1. FastMCP writes the asset into `C:\mira\workspace\tasks\{task_id}\{filename}`.
2. The `result_collector` calculates the SHA-256 digest and records file byte length.
3. FastMCP exposes an authenticated internal route:
   `GET /internal/artifacts/{task_id}/{filename}`
4. Flask pulls the file directly over HTTP using the SHA-256 digest in the header for stream verification.
