// ============================================================================
// MIRA Frontend UI Protocol Mock Data & Design System Registry
// Demonstrates all workflow stages, devices, MCP tools, and visual states.
// ============================================================================

export const INITIAL_DEVICES = [
  {
    device_id: "dev-phone2-primary-alexa",
    name: "Phone 2 — Alexa Companion",
    role: "phone_primary",
    is_primary: true,
    status: "online",
    badge: "Primary Interface",
    user_id: "usr-alex-sterling-01",
    ip_address: "192.168.1.108",
    os_info: "Android 14 • Alexa Voice Runtime v2.4",
    last_seen: "Active now",
    capabilities: [
      "Voice & Speech Input",
      "Text Command Composer",
      "Intent Confirmation",
      "Approval Shield Authorization",
      "Real-time Telemetry Push",
      "Result & Vector Graphic Delivery"
    ],
    note: "Primary user interface for speech/text entry, intent confirmations, 180s countdown approvals, and artifact delivery."
  },
  {
    device_id: "dev-backend-orchestrator",
    name: "MIRA Backend / Agent",
    role: "backend_orchestrator",
    is_primary: true,
    status: "online",
    badge: "Coordination Layer",
    user_id: "system-core",
    ip_address: "127.0.0.1:5000",
    uptime: "48 hours 12 mins",
    os_info: "Docker Container • Python 3.12 (Flask 3.0 + SQLite WAL)",
    last_seen: "Active now",
    capabilities: [
      "Intent Parsing & NLP",
      "Policy & Risk Gating Engine",
      "FastMCP Client Driver",
      "Cryptographic Verification Engine",
      "SSE Real-Time Event Hub"
    ],
    note: "Coordinates intent processing, tool selection, policy checks, execution dispatch, and verification."
  },
  {
    device_id: "dev-laptop-win11-workstation",
    name: "Windows Laptop",
    role: "windows_workstation",
    is_primary: true,
    status: "online",
    badge: "Execution Device",
    user_id: "usr-alex-sterling-01",
    ip_address: "127.0.0.1:8000",
    cpu_usage: 18,
    memory_usage: "4.8 GB / 16.0 GB",
    os_info: "Windows 11 Pro 23H2 (FastMCP Server + Uvicorn)",
    workspace_root: "C:\\mira\\workspace\\",
    workspace_guard_active: true,
    last_seen: "Active now",
    capabilities: [
      "generate_svg_poster (Vector Graphic Engine)",
      "build_document (Markdown/PDF Compiler)",
      "export_telemetry (Hardware Performance Counters)",
      "run_sandboxed_script (Controlled Python Subprocess)"
    ],
    note: "Host execution device for native workstation tools strictly confined within C:\\mira\\workspace\\."
  },
  {
    device_id: "dev-phone1-secondary-optional",
    name: "Phone 1 — Secondary Dashboard",
    role: "phone_secondary_optional",
    is_primary: false,
    status: "online",
    badge: "Optional Secondary",
    user_id: "usr-alex-sterling-01",
    ip_address: "192.168.1.115",
    os_info: "iOS 18 • Safari Web Client",
    last_seen: "Synced 2m ago",
    capabilities: [
      "Remote Status Monitoring",
      "Task History Inspection",
      "Artifact Vector Viewer",
      "Diagnostic Telemetry Readout"
    ],
    note: "Optional secondary dashboard. Never required for the core voice or task workflow."
  }
];

export const INITIAL_INTEGRATIONS = [
  {
    id: "tool-browser",
    name: "Browser Automation",
    category: "Browser",
    provider: "FastMCP Chromium Driver",
    status: "active",
    risk_level: "medium",
    description: "Automated web research, documentation lookups, and visual artifact validation within sandboxed browser session."
  },
  {
    id: "tool-desktop",
    name: "Desktop Window Manager",
    category: "Desktop",
    provider: "Windows UI Automation API",
    status: "active",
    risk_level: "medium",
    description: "Manages desktop window states, focus orchestration, and multi-monitor layout controls."
  },
  {
    id: "tool-filesystem",
    name: "Workspace Filesystem",
    category: "Filesystem",
    provider: "Workspace Guard (C:\\mira\\workspace\\)",
    status: "active",
    risk_level: "low",
    description: "Strict path confinement. File generation and reading confined strictly to designated workspace root."
  },
  {
    id: "tool-terminal",
    name: "Sandboxed Terminal",
    category: "Terminal",
    provider: "PowerShell 7 Execution Sandbox",
    status: "active",
    risk_level: "high",
    description: "Executes authorized maintenance scripts with 120s execution timeout and mandatory mobile approval."
  },
  {
    id: "tool-git",
    name: "Git Version Control",
    category: "Git",
    provider: "Workstation Git Engine",
    status: "active",
    risk_level: "low",
    description: "Tracks local workstation project commits, repository diffs, and safe branch staging."
  },
  {
    id: "tool-shopping",
    name: "Shopping Research",
    category: "Shopping",
    provider: "Alexa Commerce Research API",
    status: "active",
    risk_level: "low",
    description: "Price comparisons, product specification extraction, and inventory inquiries without financial actions."
  }
];

export const SUGGESTED_TASKS = [
  {
    id: "sug-1",
    title: "AI Summit Event Poster",
    prompt: "Generate an event poster for AI Summit 2026 with emerald and champagne gold accents.",
    tool: "generate_svg_poster",
    risk: "low",
    category: "Creative Vector"
  },
  {
    id: "sug-2",
    title: "Run Database Migration",
    prompt: "Run the database migration script migrate_users.py on the Windows workstation.",
    tool: "run_sandboxed_script",
    risk: "high",
    category: "Workstation Script"
  },
  {
    id: "sug-3",
    title: "Technical Specification Brief",
    prompt: "Compile the MIRA architecture specifications into a structured markdown executive brief.",
    tool: "build_document",
    risk: "low",
    category: "Documentation"
  },
  {
    id: "sug-4",
    title: "Workstation Telemetry & Memory",
    prompt: "Query laptop hardware utilization, CPU counters, and FastMCP workspace health.",
    tool: "export_telemetry",
    risk: "low",
    category: "Diagnostics"
  },
  {
    id: "sug-5",
    title: "Mechanical Keyboard Price Research",
    prompt: "Research wireless mechanical keyboards on Amazon and compare latency and battery life.",
    tool: "shopping_research",
    risk: "low",
    category: "Shopping Research"
  }
];

export const SAMPLE_POSTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF7F1" />
      <stop offset="50%" stop-color="#F1E9DD" />
      <stop offset="100%" stop-color="#E8DECE" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="50%" stop-color="#B08A50" />
      <stop offset="100%" stop-color="#7A5A29" />
    </linearGradient>
    <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#587A63" />
      <stop offset="100%" stop-color="#344D3D" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#342B26" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="1600" fill="url(#bg)" />

  <!-- Architectural Background Grid -->
  <g stroke="#E8E0D5" stroke-width="1.5" opacity="0.6">
    <line x1="120" y1="0" x2="120" y2="1600" />
    <line x1="1080" y1="0" x2="1080" y2="1600" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="1400" x2="1200" y2="1400" />
  </g>

  <!-- Decorative Geometry -->
  <circle cx="600" cy="720" r="380" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.4" />
  <circle cx="600" cy="720" r="300" fill="none" stroke="#587A63" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.5" />
  <circle cx="600" cy="720" r="220" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.7" />

  <!-- Center Porcelain Surface -->
  <rect x="250" y="470" width="700" height="500" rx="28" fill="#FFFFFF" filter="url(#shadow)" stroke="#E8E0D5" stroke-width="2" />
  
  <path d="M 400 720 Q 600 560 800 720 T 1000 720" fill="none" stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round" />
  <circle cx="600" cy="670" r="54" fill="url(#sageGrad)" filter="url(#shadow)" />
  <circle cx="600" cy="670" r="22" fill="#FAF7F1" />

  <!-- Header Section -->
  <text x="120" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="700" fill="#B08A50" letter-spacing="6">MIRA WORKSTATION PRODUCTION</text>
  <text x="1080" y="160" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="500" fill="#8E7F74">SHA-256: 4b22...bf8a</text>

  <!-- Hero Typography -->
  <text x="600" y="320" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="76" font-weight="700" fill="#342B26" letter-spacing="-1">AI SUMMIT 2026</text>
  <text x="600" y="390" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="26" font-weight="500" fill="#5C5047" letter-spacing="2">AUTONOMOUS ORCHESTRATION &amp; WORKFLOWS</text>

  <!-- Card Typography Inside White Box -->
  <text x="600" y="810" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="600" fill="#342B26">Model Context Protocol</text>
  <text x="600" y="855" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="500" fill="#8E7F74">Verified Workstation Generation — Windows 11 Engine</text>

  <!-- Details / Footer Grid -->
  <rect x="120" y="1040" width="960" height="280" rx="20" fill="#F1E9DD" stroke="#E8E0D5" stroke-width="1.5" />

  <text x="180" y="1120" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" fill="#B08A50" letter-spacing="3">DATE &amp; VENUE</text>
  <text x="180" y="1165" font-family="'Playfair Display', Georgia, serif" font-size="30" font-weight="600" fill="#342B26">November 12-14, 2026</text>
  <text x="180" y="1205" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#5C5047">Grand Civic Center • Seattle, WA</text>

  <text x="660" y="1120" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" fill="#B08A50" letter-spacing="3">VERIFIED DISPATCH</text>
  <text x="660" y="1165" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="600" fill="#587A63">✓ XML PARSER: VALID</text>
  <text x="660" y="1205" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#5C5047">Produced via FastMCP generate_svg_poster</text>

  <!-- Footer Tagline -->
  <text x="600" y="1470" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-style="italic" fill="#8E7F74">“Say it once. Let MIRA carry it through.”</text>
</svg>`;

// The 10 required visual states
export const VISUAL_STATES = [
  { id: "waiting", label: "Waiting", badgeClass: "badge-pending", desc: "Awaiting incoming prompt or device wake" },
  { id: "processing", label: "Processing", badgeClass: "badge-executing", desc: "Backend analyzing natural language intent" },
  { id: "pending_confirmation", label: "Awaiting Confirmation", badgeClass: "badge-pending", desc: "User review of parsed parameters" },
  { id: "awaiting_approval", label: "Awaiting Approval", badgeClass: "badge-approval", desc: "180s countdown Approval Shield active" },
  { id: "executing", label: "Executing", badgeClass: "badge-executing", desc: "Windows FastMCP running tool in workspace" },
  { id: "verifying", label: "Verifying", badgeClass: "badge-verifying", desc: "Cryptographic SHA-256 and structure audit" },
  { id: "completed", label: "Completed", badgeClass: "badge-completed", desc: "Verified output delivered successfully" },
  { id: "failed", label: "Failed", badgeClass: "badge-failed", desc: "Execution error with recovery suggestion" },
  { id: "offline", label: "Offline", badgeClass: "badge-failed", desc: "Target workstation host disconnected" },
  { id: "unable_to_verify", label: "Unable to Verify", badgeClass: "badge-failed", desc: "Integrity check failed: checksum mismatch" }
];

// Initial Tasks demonstrating all workflow states
export const INITIAL_TASKS = [
  {
    task_id: "c1a93b44-8df1-4211-9a73-6316fe0cb18a",
    title: "Generate event poster for AI Summit 2026",
    user_prompt: "Alexa, tell MIRA to generate an event poster for AI Summit 2026 with emerald and champagne gold accents.",
    interpreted_intent: "Invoke tool `generate_svg_poster` on Windows Workstation to produce an ultra-high-resolution vector SVG poster.",
    status: "completed",
    risk_level: "low",
    created_at: "2026-10-18T18:45:00Z",
    completed_at: "2026-10-18T18:45:32Z",
    source_device: "Phone 2 — Alexa Companion",
    target_device: "Windows Laptop",
    current_stage_index: 9, // 10 stages total
    tool_name: "generate_svg_poster",
    tool_params: {
      title: "AI SUMMIT 2026",
      subtitle: "AUTONOMOUS ORCHESTRATION & WORKFLOWS",
      theme: "emerald_modern",
      width: 1200,
      height: 1600
    },
    verification: {
      status: "verified",
      sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      file_size_bytes: 28410,
      xml_structure_valid: true,
      script_injection_detected: false,
      verification_timestamp: "2026-10-18T18:45:28Z"
    },
    artifact: {
      id: "art-c1a93b44",
      filename: "ai_summit_2026.svg",
      type: "image/svg+xml",
      size: "28.4 KB",
      content: SAMPLE_POSTER_SVG,
      sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      local_path: "C:\\mira\\workspace\\tasks\\c1a93b44\\ai_summit_2026.svg"
    },
    events: [
      { time: "18:45:00", stage: "1. Speak or Type", description: "Phone 2 captured Alexa voice query from Alex Sterling." },
      { time: "18:45:02", stage: "2. Confirm Intent", description: "Parsed action: `generate_svg_poster`, theme: `emerald_modern`." },
      { time: "18:45:05", stage: "3. Process Request", description: "Dispatched to policy engine; authenticated Bearer token." },
      { time: "18:45:08", stage: "4. Select Tools", description: "Selected MCP tool: `generate_svg_poster` (Low Risk)." },
      { time: "18:45:10", stage: "5. Approval Shield", description: "Low risk sandboxed generation: auto-cleared." },
      { time: "18:45:14", stage: "6. Execute on Laptop", description: "FastMCP server on port 8000 initiated vector node assembly." },
      { time: "18:45:20", stage: "7. MCP Tool Activity", description: "Workspace Guard validated target path C:\\mira\\workspace\\." },
      { time: "18:45:26", stage: "8. Verify Outcome", description: "Downloaded file; SHA-256 digest matched; XML tree clean." },
      { time: "18:45:30", stage: "9. Display Result", description: "Vector graphic cached and rendered in mobile and desktop viewers." },
      { time: "18:45:32", stage: "10. Complete Task", description: "Task finalized and marked completed. Telemetry logged." }
    ]
  },
  {
    task_id: "b7908c11-53a7-47b2-8419-123490aa5610",
    title: "Run database migration script migrate_users.py",
    user_prompt: "Run the database migration script migrate_users.py on the Windows workstation.",
    interpreted_intent: "Execute workstation script `C:\\mira\\workspace\\scripts\\migrate_users.py` with parameter `--apply-schema`.",
    status: "awaiting_approval",
    risk_level: "high",
    created_at: "2026-10-18T19:15:00Z",
    completed_at: null,
    source_device: "Phone 2 — Alexa Companion",
    target_device: "Windows Laptop",
    current_stage_index: 4, // Stage 5: Request Approval
    tool_name: "run_sandboxed_script",
    tool_params: {
      script_name: "migrate_users.py",
      arguments: ["--apply-schema", "--wal-mode"],
      timeout_seconds: 120
    },
    approval_ticket: {
      approval_id: "appr-b7908c11",
      expires_at: new Date(Date.now() + 148 * 1000).toISOString(),
      ttl_seconds: 180,
      risk_level: "high",
      action_summary: "Run arbitrary Python script `migrate_users.py` with system privileges",
      justification: "Script execution poses high potential impact to database schema integrity and local storage. Requires explicit human authorization.",
      target_script: "C:\\mira\\workspace\\scripts\\migrate_users.py",
      requested_by: "Alex Sterling (usr-alex-sterling-01)"
    },
    verification: null,
    artifact: null,
    events: [
      { time: "19:15:00", stage: "1. Speak or Type", description: "Command submitted via Phone 2 Companion." },
      { time: "19:15:02", stage: "2. Confirm Intent", description: "Identified high-impact script execution `migrate_users.py`." },
      { time: "19:15:05", stage: "3. Process Request", description: "Request validated by backend policy engine." },
      { time: "19:15:08", stage: "4. Select Tools", description: "Tool `run_sandboxed_script` evaluated as HIGH RISK." },
      { time: "19:15:10", stage: "5. Request Approval", description: "Approval Shield activated with 180s live countdown." }
    ]
  },
  {
    task_id: "e4d2719a-99b3-4f81-a832-7264883401fa",
    title: "Compile MIRA Technical Specification Brief",
    user_prompt: "Compile the MIRA architecture specifications into a structured markdown executive brief.",
    interpreted_intent: "Invoke tool `build_document` to assemble system topology, trust boundaries, and protocols into an executive summary.",
    status: "completed",
    risk_level: "low",
    created_at: "2026-10-18T18:10:00Z",
    completed_at: "2026-10-18T18:10:24Z",
    source_device: "Phone 2 — Alexa Companion",
    target_device: "Windows Laptop",
    current_stage_index: 9,
    tool_name: "build_document",
    tool_params: {
      title: "MIRA Architecture Executive Brief",
      format: "markdown",
      sections: 4
    },
    verification: {
      status: "verified",
      sha256: "91f82c40dd428aa370e599b51fa12ce1c27e808204b6b66ddb40e70ab2c41c7b",
      file_size_bytes: 14200,
      xml_structure_valid: true,
      script_injection_detected: false,
      verification_timestamp: "2026-10-18T18:10:22Z"
    },
    artifact: {
      id: "art-e4d2719a",
      filename: "mira_executive_brief.md",
      type: "text/markdown",
      size: "14.2 KB",
      content: `# MIRA System Architecture — Executive Brief\n\n## 1. Overview\nMIRA is an agentic assistant linking mobile voice (Phone 2 Alexa Companion) with real-world workstation execution on a Windows 11 laptop via Model Context Protocol (MCP).\n\n## 2. Core Pillars\n- **Zero Hallucinated Success**: Tasks are only marked complete upon rigorous SHA-256 and structural verification.\n- **Approval Shield**: High-risk actions halt and require explicit mobile authorization with a 180s countdown timer.\n- **Path Confinement**: All file modifications are restricted to \`C:\\mira\\workspace\\\`.\n\n## 3. Workflow\nPhone 2 (Alexa Companion) -> MIRA Backend (Policy & Verification) -> Windows FastMCP Server -> Verified Output Delivery.`,
      sha256: "91f82c40dd428aa370e599b51fa12ce1c27e808204b6b66ddb40e70ab2c41c7b",
      local_path: "C:\\mira\\workspace\\tasks\\e4d2719a\\mira_executive_brief.md"
    },
    events: [
      { time: "18:10:00", stage: "1. Speak or Type", description: "Text request submitted on Phone 2." },
      { time: "18:10:04", stage: "4. Select Tools", description: "Dispatched to `build_document`." },
      { time: "18:10:14", stage: "6. Execute on Laptop", description: "Compiled markdown document nodes in workspace." },
      { time: "18:10:21", stage: "8. Verify Outcome", description: "Verified document structure and SHA-256 signature." },
      { time: "18:10:24", stage: "10. Complete Task", description: "Document cached and delivered." }
    ]
  },
  {
    task_id: "f83b1022-77c4-42b8-9321-789a65bcde33",
    title: "Collect workstation telemetry and memory metrics",
    user_prompt: "Check laptop CPU, memory usage, and FastMCP workspace health.",
    interpreted_intent: "Invoke tool `export_telemetry` on Windows laptop to read hardware utilization and workspace file counts.",
    status: "executing",
    risk_level: "low",
    created_at: "2026-10-18T19:35:00Z",
    completed_at: null,
    source_device: "Phone 2 — Alexa Companion",
    target_device: "Windows Laptop",
    current_stage_index: 5, // Stage 6: Execute on Laptop
    tool_name: "export_telemetry",
    tool_params: {
      include_gpu: false,
      sample_duration_ms: 1000
    },
    verification: null,
    artifact: null,
    events: [
      { time: "19:35:00", stage: "1. Speak or Type", description: "Voice query received from Alexa." },
      { time: "19:35:03", stage: "3. Process Request", description: "Request validated by backend." },
      { time: "19:35:06", stage: "4. Select Tools", description: "Selected tool: `export_telemetry`." },
      { time: "19:35:10", stage: "6. Execute on Laptop", description: "Querying Windows 11 hardware counters via FastMCP..." }
    ]
  },
  {
    task_id: "a21890cd-14f0-482a-bc90-998811223344",
    title: "Deploy release package to secondary workstation",
    user_prompt: "Deploy test container build 2.1 to secondary workstation host.",
    interpreted_intent: "Establish connection to secondary workstation and transfer deployment bundle.",
    status: "offline",
    risk_level: "medium",
    created_at: "2026-10-18T17:20:00Z",
    completed_at: "2026-10-18T17:20:18Z",
    source_device: "Phone 2 — Alexa Companion",
    target_device: "Windows Laptop",
    current_stage_index: 5,
    tool_name: "deploy_bundle",
    error: {
      code: "WORKSTATION_OFFLINE",
      message: "Windows MCP Server did not respond within 10,000ms. Host workstation is unreachable or FastMCP service is offline.",
      recovery_suggestion: "Verify that the Windows laptop is awake, connected to Wi-Fi, and the FastMCP server is running (`python run_server.py`).",
      can_retry: true
    },
    verification: null,
    artifact: null,
    events: [
      { time: "17:20:00", stage: "1. Speak or Type", description: "Submitted via Phone 2." },
      { time: "17:20:06", stage: "3. Process Request", description: "Initiating MCP connection to workstation..." },
      { time: "17:20:18", stage: "Execution Failure", description: "Connection timed out. Diagnostic: WORKSTATION_OFFLINE." }
    ]
  },
  {
    task_id: "d9911223-99aa-44bb-88cc-334455667788",
    title: "Compile corrupted document test",
    user_prompt: "Test verification pipeline against malformed output stream.",
    interpreted_intent: "Simulate zero-byte and checksum mismatch detection on incoming workstation artifact.",
    status: "unable_to_verify",
    risk_level: "low",
    created_at: "2026-10-18T16:50:00Z",
    completed_at: "2026-10-18T16:50:22Z",
    source_device: "Phone 1 — Secondary Dashboard",
    target_device: "Windows Laptop",
    current_stage_index: 7, // Stage 8: Verify Outcome
    tool_name: "build_document",
    error: {
      code: "UNABLE_TO_VERIFY",
      message: "Artifact verification failed: SHA-256 digest calculated by backend does not match manifest returned by workstation server (Checksum mismatch).",
      recovery_suggestion: "The output file was corrupted or tampered with in transit. Task has been marked failed to protect user integrity. Please re-run.",
      can_retry: true
    },
    verification: {
      status: "failed",
      sha256: "MISMATCH_0000000000000000000000000000000000000000000000000000000000000000",
      file_size_bytes: 0,
      xml_structure_valid: false,
      script_injection_detected: false,
      verification_timestamp: "2026-10-18T16:50:20Z"
    },
    artifact: null,
    events: [
      { time: "16:50:00", stage: "1. Speak or Type", description: "Test execution initiated." },
      { time: "16:50:08", stage: "6. Execute on Laptop", description: "Laptop generated corrupted payload stream." },
      { time: "16:50:20", stage: "8. Verify Outcome", description: "Backend calculated digest; SHA-256 mismatch detected. Task aborted." }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Action Approval Required",
    message: "Task 'Run database migration script migrate_users.py' requires mobile approval (180s countdown active).",
    type: "approval",
    task_id: "b7908c11-53a7-47b2-8419-123490aa5610",
    read: false,
    timestamp: "19:15:11",
    urgent: true
  },
  {
    id: "notif-2",
    title: "Artifact Verified & Delivered",
    message: "Event poster 'AI Summit 2026' was verified (SHA-256 matched) and is ready for download.",
    type: "success",
    task_id: "c1a93b44-8df1-4211-9a73-6316fe0cb18a",
    read: false,
    timestamp: "18:45:32",
    urgent: false
  },
  {
    id: "notif-3",
    title: "Workstation Offline Alert",
    message: "Task 'Deploy release package' failed: Windows FastMCP Server unreachable.",
    type: "error",
    task_id: "a21890cd-14f0-482a-bc90-998811223344",
    read: true,
    timestamp: "17:20:18",
    urgent: false
  },
  {
    id: "notif-4",
    title: "Alexa Companion Connected",
    message: "Phone 2 Alexa Companion established active session with MIRA orchestrator.",
    type: "info",
    task_id: null,
    read: true,
    timestamp: "17:00:00",
    urgent: false
  }
];

// The 10 explicit workflow stages from the prompt:
export const WORKFLOW_STAGES = [
  { index: 0, id: "speak_or_type", name: "1. Speak or Type", desc: "User submits voice or text request through Phone 2 Alexa Companion." },
  { index: 1, id: "confirm_intent", name: "2. Confirm Intent", desc: "MIRA presents the interpreted request for confirmation when required." },
  { index: 2, id: "process_request", name: "3. Process Request", desc: "The request enters MIRA backend processing and coordination layer." },
  { index: 3, id: "select_tools", name: "4. Select Tools", desc: "Policy engine selects permitted workstation MCP tools." },
  { index: 4, id: "request_approval", name: "5. Request Approval", desc: "Approval Shield halts high-impact actions with 180s countdown." },
  { index: 5, id: "execute_on_laptop", name: "6. Execute on Laptop", desc: "Windows laptop agent executes permitted operation." },
  { index: 6, id: "mcp_tool_activity", name: "7. MCP Tool Activity", desc: "Operation confined within C:\\mira\\workspace\\ by Workspace Guard." },
  { index: 7, id: "verify_outcome", name: "8. Verify Outcome", desc: "Backend validates cryptographic SHA-256 and document structure." },
  { index: 8, id: "display_result", name: "9. Display Result", desc: "Result and task status are updated and pushed to Phone 2 and dashboard." },
  { index: 9, id: "complete_task", name: "10. Complete Task", desc: "Task marked complete and digital artifact ready for review." }
];
