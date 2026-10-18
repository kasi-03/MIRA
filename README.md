# MIRA (Mobile-to-Intelligent-Remote-Agent)

> **Turning your smartphone into a verified, safety-governed command center for your Windows workstation via the Model Context Protocol (MCP).**

---

## 1. Executive Summary

**MIRA** is an advanced agentic assistant engineered for the Alexa+ Hackathon. It bridges the gap between **mobile conversational input (Phone 1)** and **real-world workstation execution on a Windows 11 laptop**.

Unlike traditional AI assistants that suffer from "hallucinated success" (falsely claiming a task is complete when no file was generated) or remote desktops that are painful to navigate on mobile screens, MIRA introduces a **verifiable, approval-shielded agentic pipeline**:

```
+-----------------------------------------------------------------------------------+
| 1. Submit: User speaks or types task on Phone 1                                   |
| 2. Confirm: MIRA parses intent and displays interpretation for user confirmation  |
| 3. Validate: Backend checks user identity, device capabilities, and risk tier     |
| 4. Dispatch: Backend MCP Client calls authorized tool on Windows Laptop Server    |
| 5. Execute: Windows FastMCP executes tool within confined workspace sandbox       |
| 6. Produce: Laptop produces physical output file (SVG poster, PDF, JSON report)   |
| 7. Verify: Backend pulls file, validates SHA-256 and structure (Never blindly trust)|
| 8. Deliver: Phone 1 securely downloads, caches, and renders real artifact         |
| 9. Complete: Task marked 'completed' ONLY after verification passes               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Pipeline

$$\mathbf{Phone\ 1} \xrightarrow{\text{HTTPS / SSE}} \mathbf{MIRA\ Backend\ (MCP\ Client)} \xrightarrow{\text{Streamable HTTP}} \mathbf{Windows\ Laptop\ (FastMCP\ Server)} \xrightarrow{\text{Verified Artifacts}} \mathbf{Phone\ 1}$$

- **Phone 1 (Primary UI)**: Sole mobile client interface. Captures speech/text, presents confirmation cards, authorizes consequential actions, and renders interactive vector graphics. *(Note: There is no secondary companion phone or forwarding relay; Phone 1 interacts directly with the backend)*.
- **MIRA Backend**: Containerized Python 3.12 Flask orchestrator and MCP Client managing finite state machines, SQLite persistence, user identity separation, risk policy gating, and output verification.
- **Windows Laptop MCP Server**: Native FastMCP service hosted via Uvicorn on Windows 11 (targeting MCP `2025-11-25` or later). Executes sandboxed workstation tools strictly within `C:\mira\workspace\`.

---

## 3. Technology Stack

| Layer | Technologies & Runtimes |
| :--- | :--- |
| **Mobile Client (Phone 1)** | React 18, Vite 5, JavaScript, Tailwind CSS 3.4, Lucide React, Web Speech API, Server-Sent Events |
| **Orchestrator & Gateway** | Python 3.12, Flask 3.0, SQLite 3 (WAL mode), JSON Schema Draft 2020-12 (with distinct `user_id`) |
| **Workstation Engine** | Windows 11, FastMCP, Python MCP SDK, Uvicorn, Streamable HTTP (Target: MCP `2025-11-25` or later) |
| **Containerization** | Docker, Docker Compose |
| **Quality Assurance** | pytest, pytest-flask, Playwright (Mobile Viewport Emulation) |

---

## 4. Documentation & Specification Index

### Architectural & Product Documentation (`docs/`)
- [Architecture Specification](docs/architecture.md) — High-level topology, trust boundaries, component data flows.
- [Hackathon Requirements Matrix](docs/hackathon-requirements.md) — Competition requirements, judging criteria, compliance matrix.
- [Product Requirements Document (PRD)](docs/product-requirements.md) — User personas, 9-step workflow, functional features, NFRs.
- [MVP Scope & Boundaries](docs/mvp-scope.md) — Target in-scope specifications, out-of-scope items, acceptance criteria.
- [Technology Stack Specification](docs/technology-stack.md) — Runtimes, frameworks, versions, and architectural justifications.
- [Windows FastMCP Server Specification](docs/mcp-server-specification.md) — Native FastMCP architecture, Uvicorn host, Workspace Guard.
- [FastMCP Tool Contracts](docs/tool-contracts.md) — Input schemas, output manifests, risk levels, and error codes.
- [Task Lifecycle & FSM](docs/task-lifecycle.md) — State machine transitions, recovery, timeouts, and invariants.
- [Device Connection & Networking](docs/device-connection.md) — Network topology, pairing ceremony, JWT and HMAC auth.
- [Approval Governance & Security](docs/approval-and-security.md) — Six inviolable safety rules, risk tiers, 180s TTL countdown.
- [Artifact Transfer & Verification](docs/artifact-transfer.md) — Custody pipeline, checksums, XML parsing, and retention tiers.
- [Data Models & Schema Contracts](docs/data-models.md) — SQLite DDL (including `users`), ER diagrams, and JSON Schema mappings.
- [Testing Strategy & Acceptance Criteria](docs/testing-and-validation.md) — Unit, integration, security, and Playwright E2E suites.
- [Local Development & Deployment](docs/local-development-and-deployment.md) — Docker Compose guide, Windows FastMCP setup, PowerShell scripts.
- [Demo Video Script & Devpost Submission](docs/demo-script-and-devpost-submission.md) — 3-minute video presentation script and Devpost copy.
- [Risks & Open Decisions](docs/risks-and-open-decisions.md) — Risk register, trade-off analysis, and mitigation plans.
- [Source References & Verification Record](docs/source-references.md) — Official sources, citations, and verification timestamps.

### Protocol Specifications (`protocols/`)
- [Task Lifecycle Protocol](protocols/task-lifecycle.md) (`MIRA-PROTO-TASK-001`)
- [Device Connection Protocol](protocols/device-connection.md) (`MIRA-PROTO-CONN-002`)
- [Approval Flow Protocol](protocols/approval-flow.md) (`MIRA-PROTO-APPR-003`)
- [Artifact Transfer Protocol](protocols/artifact-transfer.md) (`MIRA-PROTO-ARTF-004`)
- [Realtime Events Protocol](protocols/realtime-events.md) (`MIRA-PROTO-EVNT-005`)

### JSON Schemas (`schemas/`)
- [Task Schema](schemas/task.schema.json) — Complete task lifecycle, user identity, and verification contract.
- [Device Schema](schemas/device.schema.json) — Device identity, user association, capabilities, and pairing schema.
- [Approval Schema](schemas/approval.schema.json) — Consequential action authorization ticket schema with user decision.
- [Artifact Schema](schemas/artifact.schema.json) — Physical output metadata, user ownership, and verification record schema.

### Subsystem Documentation (`windows-mcp-server/`)
- [Windows MCP Server README](windows-mcp-server/README.md) — Workstation service layout, tool registry, and setup procedures.

---

## 5. Security & Safety Pillars

1. **Zero Raw Workstation Access**: Phone 1 never browses the Windows filesystem. All tools are sandboxed to `C:\mira\workspace\`.
2. **Approval Shield**: High-risk actions halt and demand explicit approval on Phone 1 with an active 180s countdown timer.
3. **Never Blindly Trust Outputs**: A task is never completed on mere model text. Physical file checksums and XML/document structural parsers must pass.
4. **No Video/Audio Streaming**: Zero streaming or persistence of live screens or cameras. Only user-requested digital assets are produced.
5. **Separation of User and Device Identity**: Every task, approval, and artifact explicitly records `user_id` in addition to hardware `device_id`.

---

## 6. Project Roadmap

- **Phase 1: Project Scaffolding** *(Completed)*: Folder structure and empty placeholders established.
- **Phase 2: Specifications & Documentation** *(Completed & Corrected)*: Complete PRDs, protocols, schemas, and architecture guides created and verified.
- **Phase 3: Implementation** *(Awaiting User Approval)*: Flask backend, React frontend, and Windows FastMCP server code.
- **Phase 4: Testing & Verification** *(Planned)*: Automated pytest, security penetration, and Playwright E2E suites.
- **Phase 5: Demonstration & Submission** *(Planned)*: 3-minute video recording and Devpost submission.
