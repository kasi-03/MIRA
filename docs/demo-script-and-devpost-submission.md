# Demo Video Script & Devpost Submission Guide

- **Document ID**: `MIRA-DOC-DMO-016`
- **Revision**: 1.1.0
- **Status**: Presentation & Submission Standard
- **Target Video Duration**: 2 minutes 50 seconds (under 3-minute hard limit)
- **Last Updated**: 2026-10-18

---

## 1. 3-Minute Demonstration Video Script

### Act 1: The Hook & The Problem (0:00 - 0:35)
- **Visual**: Split-screen showing a user on a smartphone getting a text from an ordinary AI saying *"I created your conference poster!"*, but the user checks their desktop and finds nothing there, or finds a broken 0-byte file.
- **Narrator**: *"Every day, mobile professionals ask AI assistants to execute tasks, only to be met with 'hallucinated success'—the assistant claims it's done, but no real file exists. Worse, current assistants can't securely bridge our phones to our primary workstation tools. Meet MIRA: the Mobile-to-Intelligent-Remote-Agent powered by the Model Context Protocol."*

### Act 2: Voice-to-Workstation SVG Generation (0:35 - 1:25)
- **Visual**: Focus on **Phone 1**. The user taps the microphone icon on the MIRA web app.
- **User Voice**: *"Generate a cyber-neon event poster for the 2026 AI Innovators Summit with high-resolution vector geometry."*
- **Visual**: Phone 1 immediately displays MIRA's interpretation card: **"Generate 2026 AI Summit Vector Poster"**.
- **User Action**: User taps **"Confirm Plan"**.
- **Visual**: The UI transitions to the active task view. A progress bar streams live updates (*"Calling FastMCP on Windows Laptop..."*, *"Rendering SVG layout..."*).
- **Visual**: Screen cuts to the Windows 11 laptop desktop terminal—Uvicorn logs the tool call, executes `generate_svg_poster`, and outputs `poster_c1a93b44.svg`.
- **Visual**: The backend container downloads the file, displays the green *"Verification Passed: Valid XML & SHA-256 Checksum"* badge, and pushes it to Phone 1.
- **Visual**: The crisp vector poster appears on Phone 1. The user pinches to zoom in on clean vector gradients without pixelation.

### Act 3: Consequential Action & The Approval Shield (1:25 - 2:15)
- **Visual**: User types on Phone 1: *"Execute the local data aggregation script 'compile_sales.py' and save report."*
- **Visual**: MIRA parses the request and detects a High-Risk tool (`run_sandboxed_script`).
- **Visual**: The **ApprovalDialog** pops up on Phone 1 with an amber hazard shield, displaying the exact script parameters and an active **180-second countdown timer**.
- **Narrator**: *"MIRA protects your workstation with an inviolable Approval Shield. State-mutating commands pause for cryptographic user approval."*
- **User Action**: User taps **"Authorize Action"**.
- **Visual**: The countdown stops; the task status shifts to `approved`, then `executing`. The script runs in the Windows sandbox, creates the verified report, and delivers it to Phone 1.

### Act 4: The Negative Test: Proof of Integrity (2:15 - 2:35)
- **Visual**: User triggers a simulated corrupt output.
- **Visual**: The tool returns a file with invalid XML. MIRA's Verification Engine intercepts the file, detects malformed tags, and flags the task as **"FAILED: Verification Error"**.
- **Narrator**: *"Unlike other assistants, MIRA never marks a task completed just because a model said so. Real verification, real trust."*

### Act 5: Summary & Vision (2:35 - 2:50)
- **Visual**: Summary graphic showing the verified pipeline: Phone 1 -> MIRA Flask Backend -> Windows FastMCP Server -> Verified Results to Phone 1.
- **Narrator**: *"MIRA transforms your phone into a verified command center for your workstation. Built for the Alexa+ Hackathon."*

---

## 2. Devpost Submission Details

### Project Title
**MIRA: Mobile-to-Intelligent-Remote-Agent via Model Context Protocol**

### Short Tagline
*Turn your phone into a verified command center for your Windows workstation with real-time MCP execution, cryptographic approvals, and zero blind trust.*

### Project Story (Submission Fields)

#### Inspiration
We love the mobility of our smartphones, but we do our real work on our desktop workstations—compiling code, rendering graphics, running specialized scripts. Existing assistants either hallucinate completed work or fail to provide a safe, verifiable bridge to execute real tools on our laptops. We built MIRA to bridge this divide using the Model Context Protocol (MCP).

#### What It Does
MIRA connects a primary mobile device (**Phone 1**) directly to a **Windows Laptop MCP Server** via a containerized **Flask orchestrator**:
1. Users speak or type requests on Phone 1.
2. MIRA provides transparent plan confirmation before execution.
3. Consequential or risky actions trigger a time-limited Approval Modal with an active countdown.
4. The Windows laptop executes the authorized FastMCP tools in a sandboxed workspace.
5. The backend verifies the output file's cryptographic hash and structural validity (XML/PDF) before marking the task complete.
6. The real verified artifact (e.g. an interactive vector SVG poster) is delivered back to Phone 1.

#### How We Built It
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Web Speech API, Server-Sent Events.
- **Backend & Orchestrator**: Python 3.12, Flask 3.0, SQLite with WAL mode, JSON Schema Draft 2020-12 validation (enforcing user and device identity separation).
- **Workstation MCP Server**: Native Windows FastMCP server hosted via Uvicorn over Streamable HTTP (targeting MCP `2025-11-25` or later).
- **Deployment**: Multi-container Docker Compose setup for backend and frontend; native venv for the Windows MCP server.
- **Testing**: pytest unit and security test suites, Playwright mobile E2E tests.

#### Challenges We Overcame
1. **Direct Phone-to-Workstation Pipeline**: We designed Phone 1 as the single, direct primary mobile interface, avoiding unnecessary companion phone forwarding relays.
2. **Preventing Path Traversal**: We engineered a strict `WorkspaceGuard` confining all workstation operations to `C:\mira\workspace\`.
3. **The "Never Trust Model Output" Rule**: We implemented a mandatory file verification engine that intercepts, parses, and checksums every file before completion.

#### What We Learned
Model Context Protocol (MCP) provides a clean, standardized foundation for bridging conversational interfaces to physical machines. Combining MCP with formal JSON Schema validation and proactive approval gates creates an agentic experience users can actually trust.
