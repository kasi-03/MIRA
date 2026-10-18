# Technical Risks & Open Architectural Decisions

- **Document ID**: `MIRA-DOC-RSK-017`
- **Revision**: 1.1.0
- **Status**: Active Risk Log
- **Last Review Date**: 2026-10-18

---

## 1. Technical & Operational Risk Register

| Risk ID | Category | Description | Severity | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Connectivity | Workstation laptop goes to sleep or changes local IP address while user is remote on Phone 1. | High | Medium | Implement mDNS / Tailscale VPN networking; FastMCP health probes alert Phone 1 within 10s of connection drop. |
| **RSK-02** | Security | Script execution tool (`run_sandboxed_script`) targeted by prompt injection to execute arbitrary shell code. | Critical | Low | Restrict script names to pre-approved regex; execute scripts in dropped-privilege subprocesses; enforce 180s approval gate on Phone 1. |
| **RSK-03** | Battery & Data | Mobile browser kills SSE stream in background when Phone 1 screen is locked. | Medium | High | Support `Last-Event-ID` replay buffer; Phone 1 automatically polls `/api/tasks?active=true` upon wake-up. |
| **RSK-04** | Performance | Heavy SVG vector files (>10MB) lag mobile WebKit / Chromium rendering on Phone 1. | Medium | Medium | SVG generator enforces 10MB upper limit; UI uses CSS GPU acceleration (`transform: translateZ(0)`) for zoom/pan. |
| **RSK-05** | Reliability | Model or tool crashes halfway through rendering, leaving orphaned partial files. | Low | Low | Tool writes to temporary `.tmp` file; atomic rename occurs only after complete byte write; cleanup on task failure. |

---

## 2. Open Architectural Decisions & Trade-Offs

### Decision 1: Transport Protocol between Flask Backend and FastMCP Server
- **Option A (Chosen for MVP)**: **Streamable HTTP (JSON-RPC over POST + SSE)**.
  - *Target Standard*: MCP `2025-11-25` or later.
  - *Pros*: Native support in modern FastMCP and Python MCP SDK; works seamlessly over standard HTTP proxies; firewall-friendly.
  - *Cons*: Slight overhead compared to raw Unix domain sockets.
  - *Status*: **Accepted & Documented**.

- **Option B (Alternative)**: Standard I/O (stdio) via SSH.
  - *Pros*: Extreme security isolation.
  - *Cons*: Difficult to manage persistent streaming telemetry from Windows to a containerized client; SSH key configuration friction on Windows.
  - *Status*: Rejected for MVP.

---

### Decision 2: Artifact Storage Backend
- **Option A (Chosen for MVP)**: **Local Volume Storage (`storage/artifacts/`)**.
  - *Pros*: Zero external dependencies; zero cloud egress costs; works 100% offline in local network development.
  - *Cons*: Does not scale horizontally across multiple container replicas.
  - *Status*: **Accepted for Hackathon MVP**.

- **Option B (Future Evolution)**: S3-Compatible Cloud Storage (MinIO / AWS S3).
  - *Pros*: Production-grade scalability, signed pre-authenticated S3 URLs.
  - *Cons*: Requires AWS credentials and Internet access.
  - *Status*: Deferred to post-hackathon cloud deployment.

---

### Decision 3: Biometric Re-Authentication on Phone 1 for High-Risk Approvals
- **Current State**: Visual approval modal on Phone 1 with prominent hazard colors, parameter disclosure, and a 180-second countdown timer.
- **Proposed Enhancement**: Trigger WebAuthn / TouchID / FaceID prior to signing approval tokens.
- **Open Question**: Will WebAuthn availability in mobile browser contexts during hackathon judging introduce unexpected device compatibility hurdles?
- **Current Resolution**: Use the countdown approval dialog for standard demo; provide optional WebAuthn toggle in Settings.

---

## 3. Unresolved Questions & Action Plan

1. **Local Network Discovery**:
   - *Question*: How can Phone 1 effortlessly discover the laptop IP address without manual entry?
   - *Plan*: Expose a lightweight mDNS (`mira.local`) advertiser or display a QR code in the Windows console containing the complete local URL.
2. **Audio Capture Compatibility**:
   - *Question*: Does Web Speech API require active HTTPS on mobile Chrome/Safari?
   - *Answer*: Yes. Mobile browsers restrict `getUserMedia` and Web Speech to `https://` or `localhost`.
   - *Action*: Development environment must provide a self-signed TLS cert or use `mkcert` for `https://mira.local`.
