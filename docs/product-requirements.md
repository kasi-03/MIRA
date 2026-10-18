# Product Requirements Document (PRD)

- **Document ID**: `MIRA-PRD-003`
- **Revision**: 1.1.0
- **Status**: Approved Specification
- **Product Name**: MIRA (Mobile-to-Intelligent-Remote-Agent)

---

## 1. Product Vision & Value Proposition

MIRA empowers mobile professionals, creatives, and technical users to harness the full computing power, software toolchains, and file systems of their **Windows laptop directly from their smartphone (Phone 1)** using voice or conversational chat.

Unlike traditional remote desktops (which are clunky and painful on mobile screens) or purely cloud-based chatbots (which cannot interact with local files or specialized workstation engines), MIRA functions as an **autonomous, verifiable agentic bridge**. It turns complex desktop workflows into seamless, conversational transactions backed by formal safety approvals and rigorous output verification.

---

## 2. User Personas & Core Scenarios

### Persona 1: Sarah, Event Coordinator & Creative Lead
- **Context**: Walking the venue floor with only her smartphone (**Phone 1**).
- **Need**: Needs to immediately produce an updated, high-resolution vector poster for an impromptu sponsor session and send it to the print station.
- **MIRA Workflow**: Speaks into Phone 1: *"Generate an SVG banner poster for 'Quantum AI Keynote' at 4 PM in Ballroom B with neon cyber gradients."* MIRA interprets the request, confirms the layout parameters, dispatches the rendering script to her Windows laptop running in the office, verifies the resulting SVG file integrity, and displays the crisp, pan-and-zoomable vector graphic directly on Phone 1.

### Persona 2: Alex, Software Engineer on the Go
- **Context**: Commuting on the train; alerted that a local build benchmark needs to be executed on his Windows workstation.
- **Need**: Trigger a local test script, review changes, and receive the verified test artifact on his mobile device.
- **MIRA Workflow**: Submits request via text on Phone 1. MIRA detects this is a consequential command (executes sandboxed Python/PowerShell scripts). MIRA prompts an Approval Modal with a 180s countdown on Phone 1. Alex taps "Authorize Action". The laptop runs the isolated script, generates `benchmark_report.pdf`, MIRA verifies the PDF header and checksum, and pushes the document to Alex's Phone 1.

---

## 3. The 9-Step Canonical Product Workflow

Every end-to-end user interaction strictly obeys the following 9 sequential stages:

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

## 4. Key Functional Features

### F-1: Voice & Conversational Input (Phone 1)
- Built-in Web Speech API integration in `useSpeechInput.js` with instant text fallback.
- Audio visualizer feedback during speech capture.

### F-2: Transparent Interpretation & Confirmation Gate
- MIRA never executes silently upon hearing voice.
- Always generates an interpretation title, parameter summary, and asks for confirmation via `ChatPanel.jsx` on Phone 1.

### F-3: Consequential Action Approval Shield
- Automated risk classification (Low, Medium, High).
- Consequential tasks halt in `awaiting_approval`.
- Real-time countdown dialog on Phone 1 displaying exact command parameters and tool names.
- Instant rejection and automatic timeout enforcement.

### F-4: Workstation FastMCP Tool Integration
- Remote procedure calls dispatched over Streamable HTTP to the native Windows laptop.
- Live progress feedback streamed chunk-by-chunk to the Phone 1 UI.

### F-5: Multi-Modal Artifact Inspection
- In-browser interactive SVG vector preview with pinch-to-zoom on Phone 1.
- PDF and Markdown document rendering.
- One-tap download and sharing from mobile.

### F-6: Real-Time Event Synchronization
- Battery-efficient Server-Sent Events (SSE) pipeline.
- Automatic reconnection with zero data loss using `Last-Event-ID`.

---

## 5. Non-Functional Requirements (NFRs)

| NFR Category | Target Metric | Engineering Mechanism |
| :--- | :--- | :--- |
| **Response Latency** | < 800ms for intent interpretation | Lightweight Flask NLP/intent service with cached prompt templates. |
| **Mobile Performance**| 60 FPS UI rendering on Phone 1 | Optimized React 18 component tree; Tailwind CSS; zero heavy UI libraries. |
| **Security** | Zero raw disk traversal | FastMCP workspace isolation (`C:\mira\workspace\`); strict regex filename validation. |
| **Data Integrity** | 100% verified files | Dual SHA-256 hashing and format-specific structural parsers. |
| **Fault Tolerance** | Zero orphan executions | 120s MCP timeout; automatic crash recovery on backend restart. |
