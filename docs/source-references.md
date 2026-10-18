# Source References & Hackathon Verification Record

- **Document ID**: `MIRA-DOC-REF-001`
- **Revision**: 1.1.0
- **Verification Date**: 2026-10-18
- **Status**: Official Reference Guide

---

## 1. Overview & Verification Standard

This document catalogs all official hackathon rules, source documentation, Model Context Protocol (MCP) standards, and engineering specifications referenced throughout the MIRA project.

To maintain strict compliance with academic and professional competition integrity:
- **Confirmed Requirements**: Directly derived from published rules, official API documentation, or hackathon guidelines.
- **Proposed Designs**: Architectural choices, data schemas, and implementation models engineered by the MIRA team to solve the problem statement within the competition constraints.

---

## 2. Official Sources & Verified Documentation

### A. Hackathon & Competition Sources
1. **Devpost Hackathon Portal**:
   - *Source Category*: Competition Rules, Submission Eligibility & Judging Criteria.
   - *Verification Date*: 2026-10-18.
   - *Key Confirmed Rules*:
     - Working prototype demonstration required (public repository, demo video <= 3 minutes, Devpost submission form).
     - Focus on voice/mobile-assisted workflows driving physical or workstation intelligence.
     - Projects must not violate terms of service of third-party platforms.
     - Final project submission must include open-source code and clear deployment instructions.

2. **Amazon Developer / Alexa+ Integration Guidelines**:
   - *Source Category*: Conversational Assistant & Connected Device Ecosystem Standards.
   - *Verification Date*: 2026-10-18.
   - *Key Confirmed Guidelines*:
     - User intent confirmation before executing consequential or irreversible actions.
     - Asynchronous notification patterns when actions take longer than 8 seconds.
     - Strict data minimization: no retention of raw camera/screen streams unless explicitly requested and approved.
     - Realtime bidirectional updates for user peace of mind.

### B. Standard Specifications & Protocols
3. **Model Context Protocol (MCP) Specification**:
   - *Publisher*: Model Context Protocol Working Group / Anthropic.
   - *Target Specification*: **`2025-11-25` or later** (incorporating Streamable HTTP & SSE transport extensions; baseline runtime negotiation defaults to `2024-11-05` as supported by current Python MCP SDK).
   - *Verification Date*: 2026-10-18.
   - *Key Requirements*:
     - Standard JSON-RPC 2.0 framing for tools, resources, and prompts.
     - Client-initiated `tools/list` and `tools/call`.
     - Explicit parameter schemas conforming to JSON Schema.
     - Tool execution errors returned in standard RPC error envelopes without server process crash.

4. **JSON Schema Specification**:
   - *Standard*: JSON Schema Draft 2020-12 (`https://json-schema.org/draft/2020-12/schema`).
   - *Verification Date*: 2026-10-18.
   - *Key Requirements*: Fully validated structural data contracts for tasks, devices, approvals, and artifacts with explicit separation of user identity (`user_id`) from device identity (`device_id`).

5. **W3C Scalable Vector Graphics (SVG) 2.0**:
   - *Standard*: W3C Recommendation.
   - *Verification Date*: 2026-10-18.
   - *Key Requirements*: Validation rules for structural integrity, XML namespace validity, viewBox bounds, and sanitization of `<script>` tags to prevent Cross-Site Scripting (XSS).

---

## 3. Confirmed Requirements vs. Proposed Designs

| Area | Confirmed Hackathon / Spec Requirement | Proposed MIRA Design / Implementation |
| :--- | :--- | :--- |
| **User Endpoint** | Mobile user interface enabling voice or natural text task dispatch. | **Phone 1** serves as the exclusive primary user interface (React PWA), eliminating any intermediary companion forwarding hops. |
| **Agent / Orchestrator** | Cloud or edge backend orchestrating intents and managing state. | **MIRA Flask Backend** (Python 3.12) running in Docker Compose, acting as the state machine and MCP Client. |
| **Workstation Host** | Local machine capable of executing rich computational or desktop tools. | **Windows 11 Laptop** hosting a native Python FastMCP server over Streamable HTTP. |
| **Protocol** | Standard Model Context Protocol (MCP). | FastMCP with custom sandboxed tools (`generate_svg_poster`, `build_document`, etc.), targeting spec `2025-11-25` or later. |
| **Security & Consent** | Consequential actions must require explicit user authorization. | **MIRA Approval Flow**: Time-limited (180s-300s TTL) cryptographic approval tickets bound to `user_id` and Phone 1. |
| **Result Delivery** | Real results returned to the user, not just simulated text. | **Physical Artifact Verification**: End-to-end file pipeline where actual SVG/PDF files are generated on the laptop, hash-verified, and served to Phone 1. |
| **Completion Criteria** | Verified task execution. | **Mandatory Verification Gate**: Task cannot complete on mere model text; requires physical file probe pass. |

---

## 4. Citation Index

- [Task Lifecycle Protocol](../protocols/task-lifecycle.md)
- [Device Connection Protocol](../protocols/device-connection.md)
- [Approval Flow Protocol](../protocols/approval-flow.md)
- [Artifact Transfer Protocol](../protocols/artifact-transfer.md)
- [Realtime Events Protocol](../protocols/realtime-events.md)
- [Task Schema](../schemas/task.schema.json)
- [Device Schema](../schemas/device.schema.json)
- [Approval Schema](../schemas/approval.schema.json)
- [Artifact Schema](../schemas/artifact.schema.json)
