/**
 * MIRA Development Demo Fixtures
 * 
 * ISOLATION NOTICE:
 * These fixtures are strictly for local interface demonstration and UX evaluation
 * when Development Demo Mode is explicitly enabled by the user.
 * They do not communicate with the real backend, execute MCP tools, or touch
 * any workstation filesystem.
 */

export const DEMO_SVG_POSTER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F1EEE8" />
      <stop offset="50%" stop-color="#E5DFD4" />
      <stop offset="100%" stop-color="#D8C19A" />
    </linearGradient>
    <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9C7855" />
      <stop offset="100%" stop-color="#7A5C3E" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#262521" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="1000" fill="url(#bgGrad)" />

  <!-- Frame Outline -->
  <rect x="36" y="36" width="728" height="928" rx="24" fill="none" stroke="#9C7855" stroke-width="2" stroke-opacity="0.4" />
  
  <!-- Architectural Accent Shapes -->
  <circle cx="650" cy="180" r="140" fill="#D8C19A" fill-opacity="0.25" />
  <circle cx="150" cy="780" r="180" fill="#9C7855" fill-opacity="0.15" />
  <path d="M 100 480 Q 400 350 700 480" stroke="#9C7855" stroke-width="3" fill="none" stroke-opacity="0.35" />

  <!-- Inner Surface Card -->
  <rect x="72" y="80" width="656" height="840" rx="20" fill="#FBF9F4" filter="url(#shadow)" />

  <!-- Category Pill -->
  <rect x="110" y="130" width="160" height="34" rx="17" fill="#E5DFD4" />
  <text x="190" y="152" font-family="'Inter', sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="#7A5C3E" text-anchor="middle">KEYNOTE 2026</text>

  <!-- Main Title -->
  <text x="110" y="240" font-family="'Outfit', sans-serif" font-size="52" font-weight="700" fill="#262521" letter-spacing="-1">MIRA AGENTIC</text>
  <text x="110" y="300" font-family="'Outfit', sans-serif" font-size="52" font-weight="700" fill="#9C7855" letter-spacing="-1">SUMMIT</text>

  <!-- Subtitle -->
  <text x="110" y="360" font-family="'Inter', sans-serif" font-size="20" font-weight="400" fill="#77736B">
    Bridging Mobile Intent with Governed Windows Workstation Execution
  </text>

  <!-- Divider Line -->
  <line x1="110" y1="410" x2="690" y2="410" stroke="#E5DFD4" stroke-width="2" />

  <!-- Visual Centerpiece: Geometric Dial -->
  <g transform="translate(400, 560)">
    <circle cx="0" cy="0" r="110" stroke="#E5DFD4" stroke-width="4" fill="none" />
    <circle cx="0" cy="0" r="85" stroke="#D8C19A" stroke-width="3" stroke-dasharray="24 12" fill="none" />
    <circle cx="0" cy="0" r="55" fill="url(#bronzeGrad)" />
    <circle cx="0" cy="0" r="20" fill="#FBF9F4" />
    <polygon points="0,-45 8,0 0,45 -8,0" fill="#D8C19A" />
  </g>

  <!-- Metadata Grid -->
  <g transform="translate(110, 740)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="600" letter-spacing="1" fill="#77736B">DATE &amp; TIME</text>
    <text x="0" y="26" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" fill="#262521">OCTOBER 24, 2026 • 16:00 EST</text>
  </g>

  <g transform="translate(420, 740)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="600" letter-spacing="1" fill="#77736B">LOCATION</text>
    <text x="0" y="26" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" fill="#262521">GRAND BALLROOM B / VIRTUAL</text>
  </g>

  <!-- Verification Watermark -->
  <rect x="110" y="820" width="580" height="48" rx="10" fill="#F1EEE8" />
  <circle cx="134" cy="844" r="8" fill="#53785C" />
  <path d="M 130 844 L 133 847 L 139 841" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" />
  <text x="152" y="849" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#262521">SHA-256 VERIFIED ARTIFACT • 4b22...bf8a • GENERATED VIA WINDOWS MCP</text>
</svg>`;

export const DEMO_TASKS = [
  {
    task_id: "c1a93b44-93e1-4c44-b0e9-b541306ef456",
    title: "Generate Keynote 2026 Vector Poster",
    description: "Produce a high-resolution, scalable vector graphic event poster for the MIRA Agentic Summit with Champagne & Bronze styling.",
    raw_prompt: "Create an event poster for MIRA Agentic Summit 2026 with clean Champagne & Bronze gradients and keynote details.",
    status: "completed",
    risk_level: "low",
    consequential: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    device_label: "Alienware Workstation",
    current_stage: "Verification Passed & Delivered",
    artifact_id: "art-9821-poster",
    tool_calls: [
      {
        tool_name: "generate_svg_poster",
        status: "success",
        arguments: {
          title: "MIRA Agentic Summit",
          theme: "champagne_bronze",
          width: 800,
          height: 1000
        }
      }
    ]
  },
  {
    task_id: "d832ea10-75fa-47cb-9231-1b919389acb2",
    title: "Run Workspace Benchmark Script",
    description: "Execute benchmark script `run_benchmarks.py` inside sandboxed workspace to assess workstation disk read/write throughput.",
    raw_prompt: "Run the local benchmark script on my laptop and compile the performance report.",
    status: "awaiting_approval",
    risk_level: "high",
    consequential: true,
    approval_id: "appr-5501-script",
    created_at: new Date(Date.now() - 600000).toISOString(),
    updated_at: new Date(Date.now() - 120000).toISOString(),
    device_label: "Alienware Workstation",
    current_stage: "Awaiting Mobile User Authorization",
    tool_calls: [
      {
        tool_name: "run_sandboxed_script",
        status: "pending_approval",
        arguments: {
          script_name: "run_benchmarks.py",
          timeout_seconds: 60,
          arguments: ["--tier", "full", "--export-json"]
        }
      }
    ]
  },
  {
    task_id: "f4021bb3-0b19-48fe-a720-316491763a89",
    title: "Compile Sprint Engineering Summary",
    description: "Synthesize sprint tasks and git commit logs into structured Markdown and compile to executive PDF document.",
    raw_prompt: "Compile our sprint engineering summary into a document.",
    status: "executing",
    risk_level: "low",
    consequential: false,
    created_at: new Date(Date.now() - 300000).toISOString(),
    updated_at: new Date(Date.now() - 30000).toISOString(),
    device_label: "Alienware Workstation",
    current_stage: "Building document layout nodes on Windows host",
    tool_calls: [
      {
        tool_name: "build_document",
        status: "in_progress",
        arguments: {
          title: "Sprint 42 Engineering Brief",
          format: "markdown"
        }
      }
    ]
  }
];

export const DEMO_APPROVALS = [
  {
    approval_id: "appr-5501-script",
    task_id: "d832ea10-75fa-47cb-9231-1b919389acb2",
    task_title: "Run Workspace Benchmark Script",
    target_tool: "run_sandboxed_script",
    action_summary: "Execute `run_benchmarks.py` in Windows workstation sandbox with arguments `['--tier', 'full', '--export-json']`.",
    risk_level: "high",
    status: "pending",
    // 180 seconds TTL simulated countdown
    expires_at: new Date(Date.now() + 165000).toISOString(),
    created_at: new Date(Date.now() - 15000).toISOString(),
    parameters: {
      script_name: "run_benchmarks.py",
      workspace: "C:\\mira\\workspace\\scripts\\",
      timeout_seconds: 60,
      cpu_allocation: "standard"
    },
    affected_resources: [
      "C:\\mira\\workspace\\benchmarks.log",
      "C:\\mira\\workspace\\reports\\benchmark_summary.json"
    ],
    rationale: "Executing workstation code alters workspace files and utilizes host CPU. Explicit mobile authorization required."
  }
];

export const DEMO_ARTIFACTS = [
  {
    artifact_id: "art-9821-poster",
    task_id: "c1a93b44-93e1-4c44-b0e9-b541306ef456",
    filename: "mira_summit_keynote.svg",
    content_type: "image/svg+xml",
    byte_size: 42180,
    sha256_hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    verification_status: "verified",
    verification_details: {
      hash_matched: true,
      xml_well_formed: true,
      script_tags_found: 0,
      viewbox_valid: true
    },
    created_at: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    raw_content: DEMO_SVG_POSTER
  },
  {
    artifact_id: "art-7104-telemetry",
    task_id: "a091c532-1b11-460d-8302-390881bc33d1",
    filename: "workstation_telemetry.json",
    content_type: "application/json",
    byte_size: 1420,
    sha256_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verification_status: "verified",
    verification_details: {
      hash_matched: true,
      schema_valid: true
    },
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    raw_content: JSON.stringify({
      hostname: "WINDOWS-WORKSTATION-11",
      mcp_server_version: "1.3.0",
      python_runtime: "3.12.13",
      workspace_path: "C:\\mira\\workspace",
      workspace_disk_free_gb: 342.5,
      active_tools_count: 4,
      last_probe_ms: 12
    }, null, 2)
  }
];

export const DEMO_NOTIFICATIONS = [
  {
    id: "notif-01",
    type: "approval_required",
    title: "Consequential Action Awaiting Approval",
    message: "Task 'Run Workspace Benchmark Script' requires authorization to execute code on your laptop.",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    target_tab: "approvals",
    read: false
  },
  {
    id: "notif-02",
    type: "artifact_ready",
    title: "Poster Generated & Verified",
    message: "'mira_summit_keynote.svg' was verified and is ready for download.",
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    target_tab: "artifacts",
    read: true
  }
];

export const EXAMPLE_PROMPTS = [
  {
    title: "Generate SVG Poster",
    prompt: "Generate an event poster for MIRA Agentic Summit 2026 with Champagne and Bronze accents.",
    category: "Creative"
  },
  {
    title: "Run Script with Approval",
    prompt: "Run the local benchmark script on my laptop and compile the performance report.",
    category: "System"
  },
  {
    title: "Summarize Sprint Logs",
    prompt: "Compile our sprint engineering summary into a document.",
    category: "Documentation"
  },
  {
    title: "Query Laptop Telemetry",
    prompt: "Check workstation disk space and CPU performance counters.",
    category: "Diagnostics"
  }
];
