# Local Development & Deployment Guide

- **Document ID**: `MIRA-DOC-DEP-015`
- **Revision**: 1.1.0
- **Status**: Operations & Deployment Standard
- **Last Updated**: 2026-10-18

---

## 1. Deployment Topology & Container Architecture

MIRA utilizes a hybrid deployment model:
1. **Containerized Orchestration**: The Flask Backend, SQLite DB, and React Frontend run inside lightweight Docker containers managed by **Docker Compose**.
2. **Native Workstation Execution**: The FastMCP Server runs **natively on the Windows 11 host** to execute local scripts and leverage Windows system tools without container boundary limitations.

```mermaid
graph LR
    subgraph Docker_Compose [Docker Compose Perimeter]
        FE[frontend: Vite / Nginx Container (Port 3000)]
        BE[backend: Flask Container (Port 5000)]
        VOL[(storage_volume: storage/artifacts/)]
        
        FE -->|Reverse Proxy /api| BE
        BE --> VOL
    end

    subgraph Windows_Host [Native Windows 11 Host]
        MCP[FastMCP Server: Uvicorn (Port 8000)]
        DISK[(C:\mira\workspace\)]
        
        MCP --> DISK
    end

    BE == "Streamable HTTP (host.docker.internal:8000)" ==> MCP
```

---

## 2. Prerequisites & System Requirements

- **Operating System**: Windows 11 (for native MCP Server).
- **Runtimes**:
  - Python 3.12+ (64-bit).
  - Node.js 20 LTS (for frontend local development, or via Docker).
  - Docker Desktop 4.28+ with WSL2 backend.
- **Hardware**: Minimum 8 GB RAM, 10 GB free disk space.

---

## 3. Configuration & Environment Variables

> [!NOTE]
> The `.env.example` file in the repository root and `windows-mcp-server/.env.example` are currently empty placeholders. The configuration block below represents the target specification to be populated in Phase 3.

```bash
# General
MIRA_ENV=development
SECRET_KEY=generate-a-64-char-random-hex-string
JWT_SECRET=generate-a-32-char-random-hex-string

# Network & Endpoints
FRONTEND_PORT=3000
BACKEND_PORT=5000
BACKEND_URL=http://localhost:5000

# Windows MCP Server Settings
WINDOWS_MCP_HOST=host.docker.internal
WINDOWS_MCP_PORT=8000
WINDOWS_MCP_SECRET_KEY=high-entropy-workstation-shared-secret
WINDOWS_WORKSPACE_ROOT=C:\mira\workspace

# Storage & Verification
ARTIFACT_STORAGE_PATH=/app/storage/artifacts
MAX_ARTIFACT_SIZE_BYTES=52428800
DEFAULT_APPROVAL_TTL_SECONDS=180
```

---

## 4. Target Local Setup Workflow (Phase 3 & 4 Execution)

> [!IMPORTANT]
> The setup commands below are planned execution procedures for Phase 3 (Implementation). The application files, Dockerfiles, and `requirements.txt` are currently empty placeholders, so running these commands before Phase 3 implementation will not succeed.

### Step 1: Start the Windows Laptop MCP Server
On your Windows laptop, open a PowerShell terminal:

```powershell
# Navigate to MCP directory
cd windows-mcp-server

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install requirements (during Phase 3 implementation)
pip install -r requirements.txt

# Launch FastMCP via Uvicorn
python run_server.py
```
*The FastMCP server listens on `http://127.0.0.1:8000/mcp` and logs `[INFO] FastMCP Server initialized. Tools registered: generate_svg_poster, build_document, export_telemetry, run_sandboxed_script`.*

### Step 2: Launch Backend & Frontend via Docker Compose
In a separate terminal, run:

```bash
# Build and launch containers in detached mode (in Phase 3)
docker compose up -d --build

# Verify container health
docker compose ps
```
- **Frontend URL**: `http://localhost:3000` (or accessible on your local Wi-Fi from Phone 1 at `http://<laptop-ip>:3000`).
- **Backend API**: `http://localhost:5000/api/health`.

### Step 3: Connect Phone 1
1. Ensure Phone 1 is on the same local Wi-Fi network or connected via a secure tunnel.
2. Open Chrome/Safari on Phone 1 and navigate to: `http://<laptop-ip>:3000`.
3. Complete the pairing screen using the default dev token or PIN displayed on the backend console.

---

## 5. Automation PowerShell Scripts (`scripts/`)

For developer convenience, five PowerShell scripts will automate operations once populated:

| Script Path | Purpose |
| :--- | :--- |
| `scripts/start-dev.ps1` | Launches Docker Compose services and verifies container liveness. |
| `scripts/stop-dev.ps1` | Stops all Docker containers and cleans up ephemeral storage. |
| `scripts/start-windows-mcp.ps1` | Activates Python venv and starts the Uvicorn FastMCP server on Windows. |
| `scripts/validate-schemas.ps1` | Runs JSON schema syntax and draft validation checks. |
| `scripts/run-tests.ps1` | Executes pytest unit, security, and Playwright integration suites. |
