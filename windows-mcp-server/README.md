# MIRA Windows Laptop MCP Server

> **Native Windows Workstation FastMCP Execution Engine for the MIRA Ecosystem**

---

## 1. Overview & Architectural Role

The **MIRA Windows Laptop MCP Server** is a native host service designed to run directly on Windows 11. It exposes sandboxed desktop tools, computation scripts, and rendering pipelines to the **MIRA Flask Backend (MCP Client)** via the **Model Context Protocol (MCP)**.

```
[Phone 1 Mobile UI]
        |  (HTTPS / SSE)
        v
[MIRA Flask Backend (MCP Client)]
        |  (Streamable HTTP: JSON-RPC over POST + SSE)
        v
[Windows Laptop MCP Server (FastMCP Engine)]
        |
        +---> [Sandboxed Workspace: C:\mira\workspace\]
```

### Key Responsibilities
- **Tool Provider**: Exposes allowlisted tools (`generate_svg_poster`, `build_document`, `export_telemetry`, `run_sandboxed_script`).
- **Workspace Confinement**: Enforces the **Workspace Guard**, restricting all filesystem read/write operations strictly to `C:\mira\workspace\`.
- **Integrity Manifests**: Generates output artifacts and computes SHA-256 cryptographic digests before returning execution manifests to the backend.
- **Client Relationship**: The Windows MCP server acts strictly as an **MCP Server**. It never initiates outbound calls to Phone 1 or the backend; it only answers authenticated JSON-RPC requests from the containerized Flask backend (MCP Client).

---

## 2. Technology Stack & Protocol Specifications

- **Protocol Specification**: Targets **MCP specification `2025-11-25` or later** (with automatic backward-compatibility negotiation to baseline SDK versions such as `2024-11-05`).
- **Transport**: **Streamable HTTP** (HTTP POST for JSON-RPC 2.0 requests; Server-Sent Events for streaming execution progress and telemetry).
- **Core Framework**: `FastMCP` (via official `mcp` Python SDK).
- **ASGI Host**: `Uvicorn` asynchronous server listening on `127.0.0.1:8000` or a secure local/VPN network interface.
- **Python Runtime**: Python 3.12+ (64-bit native Windows).

---

## 3. Directory Layout

```text
windows-mcp-server/
├── README.md               # This specification & operational guide
├── requirements.txt        # Runtime dependencies (mcp, uvicorn, pydantic)
├── requirements-dev.txt    # Development & test tools (pytest, flake8)
├── run_server.py           # Server entry point script
├── .env.example            # Environment configuration template
│
└── mira_mcp/
    ├── __init__.py
    ├── server.py           # FastMCP server instance and route definitions
    ├── asgi.py             # ASGI application wrapper for Uvicorn
    ├── config.py           # Server settings & workspace root definitions
    │
    ├── tools/              # Tool definitions and registries
    │   ├── __init__.py
    │   ├── capabilities.py # Tool capability negotiation
    │   ├── task_execution.py # Sandboxed script execution tools
    │   └── artifact_tools.py # SVG poster and document generators
    │
    ├── execution/          # Process dispatch and result collection
    │   ├── __init__.py
    │   ├── dispatcher.py   # Tool invocation router
    │   ├── safe_executor.py# Process executor with timeouts and CPU limits
    │   └── result_collector.py # SHA-256 hash calculator & manifest builder
    │
    ├── security/           # Safety, authentication, and path validation
    │   ├── __init__.py
    │   ├── authentication.py # HMAC signature / PSK validator
    │   ├── authorization.py  # Permission and role verifier
    │   ├── workspace_guard.py# Path confinement (C:\mira\workspace\)
    │   └── input_validation.py # JSON parameter sanitizer
    │
    ├── artifacts/          # Internal artifact staging and transfer
    │   ├── __init__.py
    │   ├── artifact_registry.py
    │   ├── artifact_validator.py
    │   └── artifact_uploader.py # Internal authenticated download endpoint
    │
    └── utils/              # Error handling and logging
        ├── __init__.py
        ├── errors.py
        └── logging_config.py
```

---

## 4. Workstation Security & Safety Expectations

1. **Path Confinement**: All tool file interactions resolve through canonical paths (`os.path.realpath`) and must start with `C:\mira\workspace\`. Directory traversal sequences (`..`, `C:\Windows`, `AppData`) trigger immediate rejection (`-32001 WORKSPACE_VIOLATION`).
2. **Mutual Authentication**: Communication from the Flask backend requires an HMAC-SHA256 signature (`X-MIRA-Signature`) and timestamp header (`X-MIRA-Timestamp`) to prevent unauthorized network requests or replay attacks.
3. **Execution Deadlines**: Script execution tools enforce a hard 60-to-120-second timeout. Runaway processes are killed automatically.
4. **No Raw Filesystem Access**: The server does not expose arbitrary shell or disk APIs. Only pre-registered tools can execute.

---

## 5. Planned Setup Workflow (Phase 3 Execution)

> [!IMPORTANT]
> The commands below represent the planned setup workflow for Phase 3 (Implementation). The Python source files and `requirements.txt` are currently empty placeholders. The server cannot be executed until implementation files are populated in Phase 3.

```powershell
# 1. Open PowerShell on Windows 11
cd windows-mcp-server

# 2. Create and activate a dedicated virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 3. Install dependencies (in Phase 3)
pip install -r requirements.txt

# 4. Configure environment
Copy-Item .env.example .env
# Set WINDOWS_MCP_SECRET_KEY and WORKSPACE_ROOT in .env

# 5. Start the FastMCP server
python run_server.py
```

*When implemented in Phase 3, the Uvicorn ASGI server will bind to `127.0.0.1:8000` with the FastMCP endpoint at `/mcp`.*
