# Hackathon Requirements & Compliance Matrix

- **Document ID**: `MIRA-DOC-REQ-002`
- **Revision**: 1.1.0
- **Verification Date**: 2026-10-18
- **Competition Target**: Alexa+ Hackathon / Advanced Agentic Assistant Showcase

---

## 1. Hackathon Challenge Overview

The Hackathon invites developers to pioneer next-generation assistant experiences that bridge the gap between **mobile conversational interfaces** and **real-world workstation execution**.

### The Core Problem Statement
Current voice and chat assistants suffer from three major shortcomings:
1. **The "Hallucinated Success" Fallacy**: Assistants frequently report *"I have created your file"* without verifying whether the target process actually produced a valid, usable asset.
2. **Disconnected Desktop Silos**: Mobile devices cannot safely control or execute rich local software, scripts, or rendering pipelines on a user's primary Windows PC.
3. **Unchecked Consequential Risk**: Autonomous agent tool-use either executes dangerous commands without human confirmation or floods users with uninformative, noisy prompts.

### MIRA's Winning Thesis
**MIRA (Mobile-to-Intelligent-Remote-Agent)** solves these hurdles by providing a secure, verifiable, Model Context Protocol (MCP)-based bridge between a primary mobile device (**Phone 1**) and a native **Windows Laptop MCP Server**.

---

## 2. Competition Judging Criteria Alignment

| Judging Criterion | Weight | How MIRA Directly Fulfills Criterion | Reference Document |
| :--- | :--- | :--- | :--- |
| **Technical Execution & Architecture** | 30% | Containerized Flask backend (Python 3.12) acting as MCP Client; native Windows FastMCP server; robust Server-Sent Events (SSE) telemetry; complete JSON Schema Draft 2020-12 data validation with distinct user identity. | [Architecture](architecture.md) |
| **User Experience & Design** | 25% | Polished React + Vite + Tailwind CSS interface on Phone 1; speech input; live confirmation step; real-time execution progress; in-app SVG/document rendering. | [Product Requirements](product-requirements.md) |
| **Safety, Trust & Alignment** | 25% | Zero unrestricted disk access; cryptographic approval gates for consequential actions with strict TTL timeouts (180s-300s); mandatory physical artifact verification. | [Approval & Security](approval-and-security.md) |
| **Real-World Value & Completeness** | 20% | Produces actual tangible outputs (e.g. vector graphic event posters, verified data summaries) directly delivered to Phone 1, proving end-to-end execution. | [Demo Script](demo-script-and-devpost-submission.md) |

---

## 3. Scope Boundaries & Single-Phone Architecture

### Strict Device Pipeline
The architectural flow is strictly defined as:
$$\text{Phone 1} \longrightarrow \text{MIRA Backend / Orchestrator} \longrightarrow \text{Windows Laptop MCP Server} \longrightarrow \text{Verified Results to Phone 1}$$

### Elimination of Multi-Phone Relay Overhead
Earlier assistant concepts often suffered from multi-device forwarding gates (e.g. one phone receiving voice and forwarding to a secondary device). 
**MIRA eliminates all secondary phone relays**:
- **Phone 1 is the exclusive mobile interface**: It directly handles speech input, confirmation, approvals, and artifact viewing in a unified, modern interface.
- Eliminates latency, network hops, and potential privacy leaks between devices.
- Focuses entirely on the direct bridge between Phone 1 and the user's Windows workstation.

---

## 4. Required Deliverables Checklist

- [x] **Complete Repository Architecture**: Clean, modular separation of backend, frontend, MCP server, schemas, protocols, and tests.
- [x] **Formal Data Schemas**: JSON Schema Draft 2020-12 for tasks, devices, approvals, and artifacts with separated `user_id` (`schemas/*.schema.json`).
- [x] **Protocol Specifications**: In-depth network, lifecycle, approval, artifact, and event specifications (`protocols/*.md`).
- [x] **Engineering Documentation**: 17 substantive technical docs covering all facets of design, security, and deployment.
- [ ] **Working Implementation**: Flask backend, React frontend, and Windows FastMCP server (Deferred to Phase 3 upon user approval).
- [ ] **Demonstration Video**: 3-minute screen recording showcasing voice prompt on Phone 1, approval gate, laptop rendering, and verified SVG display.
- [ ] **Devpost Writeup**: Submission story, architecture diagrams, and testing evidence.
