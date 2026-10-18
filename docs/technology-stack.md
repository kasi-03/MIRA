# Technology Stack Specification

- **Document ID**: `MIRA-DOC-STK-005`
- **Revision**: 1.1.0
- **Status**: Engineering Standard
- **Last Updated**: 2026-10-18

---

## 1. Architectural Technology Matrix

MIRA integrates modern, lightweight, and resilient open-source technologies across the client, orchestration, and workstation layers.

```
+--------------------------------------------------------------------------------+
| Phone 1 Frontend: React 18 + Vite + Tailwind CSS + Lucide Icons                |
+--------------------------------------------------------------------------------+
                                       |
                   REST / SSE (Bearer Token Auth)
                                       v
+--------------------------------------------------------------------------------+
| Backend Orchestrator: Python 3.12 + Flask + SQLite + Docker Compose            |
+--------------------------------------------------------------------------------+
                                       |
                   Streamable HTTP (JSON-RPC 2.0 / MCP Protocol)
                                       v
+--------------------------------------------------------------------------------+
| Workstation Engine: Windows 11 + FastMCP + Python MCP SDK + Uvicorn            |
+--------------------------------------------------------------------------------+
```

---

## 2. Layer-by-Layer Technology Breakdown

### A. Mobile Client Layer (Phone 1)
- **Role**: Exclusive primary mobile interface.
- **Framework**: **React 18** (Functional components, hooks, Context API).
  - *Rationale*: Declarative state management, rapid reactive rendering for chat timelines, wide mobile browser compatibility.
- **Bundler & Tooling**: **Vite 5**.
  - *Rationale*: Sub-second hot module replacement (HMR), ultra-fast production builds, lightweight footprint.
- **Styling**: **Tailwind CSS 3.4**.
  - *Rationale*: Responsive utility classes tailored for mobile viewports, dark-mode support, sleek design tokens.
- **Iconography**: **Lucide React**.
  - *Rationale*: Clean, consistent, lightweight SVG icons.
- **Web APIs Used**:
  - `EventSource` (Server-Sent Events for battery-efficient real-time updates).
  - `SpeechRecognition` / Web Speech API (Voice input on mobile browsers).
  - `localStorage` (Device authentication token caching).

### B. Orchestration & Gateway Layer (Backend)
- **Runtime**: **Python 3.12**.
  - *Rationale*: Modern typing (`type | None`), sub-interpreter speedups, native asynchronous primitives.
- **Web Framework**: **Flask 3.0** with WSGI deployment (Gunicorn in container).
  - *Rationale*: Minimalist, decoupled, rock-solid stability, simple blueprint architecture without framework bloat.
- **Data Persistence**: **SQLite 3** with WAL (Write-Ahead Logging) mode.
  - *Rationale*: Zero-config, single-file ACID transactional database ideal for edge, single-user, and containerized deployments. Fast concurrent reads.
- **Validation**: Schema validation matching JSON Schema Draft 2020-12, enforcing user identity separation from device identity.
- **Containerization**: **Docker** & **Docker Compose**.
  - *Rationale*: Cross-platform reproducibility. One-command startup for frontend and backend containers.

### C. Workstation Execution Layer (Windows Laptop MCP Server)
- **Server Framework**: **FastMCP** (via official Python MCP SDK).
  - *Target Protocol Version*: MCP `2025-11-25` or later over Streamable HTTP (with runtime SDK baseline fallback negotiation to `2024-11-05`).
  - *Rationale*: First-class implementation of Model Context Protocol; automatic parameter schema generation; built-in error handling.
- **ASGI Host**: **Uvicorn**.
  - *Rationale*: Lightning-fast asynchronous server hosting the FastMCP Streamable HTTP / SSE endpoints natively on Windows.
- **Execution Engine**: Native Python 3.12 running in a dedicated virtual environment (`.venv`) on Windows 11.
  - *Rationale*: Directly executes native Windows processes, file generation scripts, and local developer toolchains that cannot run inside isolated Linux containers.

### D. Quality Assurance & Testing Suite
- **Backend & Unit Tests**: **pytest** & **pytest-flask**.
  - *Rationale*: Parameterized testing, fixtures, mock MCP server responses.
- **End-to-End (E2E) Browser Tests**: **Playwright**.
  - *Rationale*: Headless browser automation testing mobile viewport interactions, confirmation clicks, approval popups, and SVG preview rendering on Phone 1.

---

## 3. Technology Version Matrix

| Component | Technology | Target Version | Environment |
| :--- | :--- | :--- | :--- |
| Mobile Frontend | Node.js / React | Node 20 LTS / React 18.2 | Mobile Browser (PWA) / Container |
| Frontend Bundler | Vite | 5.x | Build System |
| Frontend CSS | Tailwind CSS | 3.4.x | Frontend Bundle |
| Backend Runtime | Python | 3.12.x | Linux Container (Alpine/Slim) |
| Backend Framework | Flask | 3.0.x | Dockerized Service |
| Database | SQLite | 3.45+ | Container Volume |
| MCP Protocol Spec | MCP Standard | 2025-11-25 or later (negotiated) | Workstation Transport |
| MCP Framework | FastMCP / MCP SDK | 1.1.x+ | Native Windows 11 |
| ASGI Web Server | Uvicorn | 0.29+ | Native Windows 11 |
| Unit Test Suite | pytest | 8.x | CI / Local Dev |
| E2E Test Suite | Playwright | 1.42+ | Local Dev / CI |
