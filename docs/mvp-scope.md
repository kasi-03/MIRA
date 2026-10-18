# MVP Scope & Feature Boundaries

- **Document ID**: `MIRA-DOC-SCP-004`
- **Revision**: 1.1.0
- **Status**: Scope Definition
- **Target Release**: Hackathon Prototype v1.0
- **Last Updated**: 2026-10-18

---

## 1. Executive MVP Objective

The Minimum Viable Product (MVP) demonstrates a functional, end-to-end agentic workflow where a user on **Phone 1** commands their **Windows Laptop** to perform a real workstation task (generating a rich vector graphics poster and executing a data script), inspects the approval gate, observes live telemetry, and receives a verified physical artifact directly on their mobile screen.

---

## 2. In-Scope Features (Target MVP Specifications)

*(Note: The items below represent the target scope for Phase 3 implementation. They are currently empty placeholders awaiting implementation).*

### 1. Mobile Interface (Phone 1)
- [ ] Responsive PWA built with React, Vite, and Tailwind CSS.
- [ ] Conversational chat layout with speech-to-text input (`useSpeechInput`).
- [ ] Task interpretation card requiring explicit "Confirm" click before execution.
- [ ] Approval modal displaying action summary, parameters, risk badge, and a real-time countdown timer (TTL).
- [ ] Artifact Gallery with full-screen SVG viewer (pan & zoom) and download trigger.
- [ ] Real-time task progress bar and timeline updates driven by Server-Sent Events (SSE).

### 2. Backend Orchestration (Flask)
- [ ] Python 3.12 Flask REST API with blueprint modularity (`api/tasks.py`, `api/approvals.py`, `api/artifacts.py`, `api/events.py`).
- [ ] FastMCP Client handling tool discovery, connection lifecycle, and tool invocation over Streamable HTTP.
- [ ] SQLite database with relational schemas for users, tasks, devices, approvals, and artifacts.
- [ ] Policy & Risk Engine classifying tools as Low Risk vs. Consequential (Medium/High).
- [ ] Mandatory Verification Engine validating SVG XML syntax, checksum matching, and security rules before marking tasks `completed`.
- [ ] Token-based bearer authentication and scoped artifact download links with user identity separation.

### 3. Workstation Execution (Windows Laptop FastMCP Server)
- [ ] Native Python service using FastMCP and Uvicorn running on Windows 11.
- [ ] Tool 1: `generate_svg_poster` (creates rich, scalable vector posters with custom typography, gradients, and layout geometry).
- [ ] Tool 2: `export_system_telemetry` (collects sandboxed CPU/RAM/battery metrics and outputs formatted Markdown/JSON).
- [ ] Tool 3: `run_sandboxed_script` (executes pre-registered, safe python scripts inside `C:\mira\workspace\`).
- [ ] Workspace Guard preventing directory traversal outside `C:\mira\workspace\`.

---

## 3. Explicitly Out-of-Scope (Deferred Post-Hackathon)

The following capabilities are deliberately excluded to ensure rock-solid stability, zero security vulnerabilities, and on-time delivery:

1. **Companion Phone Relay Gateways**:
   - *Reason*: Direct Phone 1 interaction is cleaner, faster, and safer. No phone-to-phone forwarding relays or secondary companion hops.
2. **Arbitrary Workstation Shell Execution**:
   - *Reason*: Allowing unrestricted CMD or PowerShell input introduces severe remote code execution (RCE) hazards. MVP strictly permits pre-registered FastMCP tools.
3. **Live Screen Video / Audio Streaming**:
   - *Reason*: Video streaming consumes excessive bandwidth and raises privacy issues. MIRA operates on discrete, verifiable file artifacts.
4. **Cloud Blob Storage (AWS S3 / Azure Blob)**:
   - *Reason*: The MVP uses container-mounted local volume storage (`storage/artifacts/`). S3 storage drivers are modularized for post-hackathon cloud deployment.
5. **Multi-Tenant Enterprise User Management**:
   - *Reason*: MVP is configured for a single primary user paired to one workstation.

---

## 4. Acceptance Criteria for MVP Completion

- [x] **AC-1 (Zero-Code Documentation Integrity)**: All specifications, JSON schemas, protocols, and documentation completed before application code is written.
- [ ] **AC-2 (Voice-to-Artifact)**: A spoken request on Phone 1 produces a valid SVG poster rendered on the laptop within 15 seconds.
- [ ] **AC-3 (Approval Shield)**: Consequential tool invocations halt in `awaiting_approval` and abort if Phone 1 user rejects or if 180s expires.
- [ ] **AC-4 (Verification Proof)**: If a corrupted file is returned by a tool, MIRA fails the task and never marks it `completed`.
- [ ] **AC-5 (Containerized Portability)**: Backend and frontend spin up cleanly via `docker compose up --build`.
