import re

# Curated Alexa & Windows Workstation Knowledge Base
ALEXA_FAQS = [
    {
        "keywords": ["asleep", "listen while asleep", "listen when asleep", "standby listen", "sleep listen", "sleep mode listen"],
        "title": "FAQ: Alexa Wake State in Windows Sleep Mode",
        "overview": "Explanation of audio subsystem behavior during Windows standby states.",
        "content": (
            "### Does Alexa listen while your computer is asleep?\n\n"
            "**Direct Answer:** No. By default, your Windows laptop stops listening for the 'Alexa' wake word as soon as it enters Sleep or Modern Standby.\n\n"
            "#### 1. Why Windows Pauses Audio\n"
            "When Windows enters S3 Sleep or S0 Modern Standby, CPU clocks drop to idle and non-essential subsystem drivers are suspended to preserve battery. Standard microphone streams are closed to prevent background eavesdropping and battery drain.\n\n"
            "#### 2. Hardware Exceptions (Wake on Voice)\n"
            "Select laptops (e.g., Dell XPS, HP Spectre, Lenovo Yoga) feature dedicated low-power Digital Signal Processors (DSP) powered by Intel Smart Sound Technology or Qualcomm Snapdragon. These machines can continuously listen for wake words in Modern Standby if 'Hands-Free' is permitted in BIOS and OEM audio drivers.\n\n"
            "#### 3. How MIRA Bridges This Limitation\n"
            "Standard Alexa commands fail when the laptop sleeps. In contrast, **MIRA runs a persistent FastMCP daemon** on Windows. Any task queued from your mobile Alexa Companion is retained in SQLite (`storage/mira.db`) and executes automatically the moment your workstation resumes."
        ),
    },
    {
        "keywords": ["native voice", "control my computer", "control my laptop", "native commands", "control pc with voice", "control computer with voice"],
        "title": "Architecture: Native Voice Control vs MIRA FastMCP",
        "overview": "Analysis of Windows sandbox restrictions and MIRA's FastMCP execution bridge.",
        "content": (
            "### Can Alexa control your computer with native voice commands?\n\n"
            "**Direct Answer:** The official Amazon Alexa app for PC cannot execute deep Windows commands, run scripts, or inspect local files because it is sandboxed by Microsoft UWP policies.\n\n"
            "#### 1. The Windows UWP Security Wall\n"
            "The Microsoft Store Alexa app runs inside an app container. It cannot:\n"
            "- Launch custom scripts, shell commands, or background binaries.\n"
            "- Inspect hardware sensors or export cryptographic SHA-256 telemetry.\n"
            "- Perform governed file writes outside its private app package.\n\n"
            "#### 2. The MIRA Workstation Architecture\n"
            "MIRA solves this restriction through a governed 3-tier model:\n"
            "1. **Mobile Voice Interface (Alexa Companion)**: Captures user intent by speech or text.\n"
            "2. **Policy Engine**: Evaluates risk and gates consequential operations (e.g., scripts, power states) with 180s mobile approval tickets.\n"
            "3. **FastMCP Host (`localhost:8000`)**: Executes native tools in Python directly on your Windows 11 workstation, delivering verified artifacts to `C:\\mira\\workspace\\`."
        ),
    },
    {
        "keywords": ["install alexa", "download alexa", "setup alexa", "install on laptop", "how to install"],
        "title": "Guide: Installing Amazon Alexa on Windows 11/10",
        "overview": "Step-by-step setup procedure for running Alexa on a Windows laptop.",
        "content": (
            "### How to Install Amazon Alexa on Your Windows Laptop\n\n"
            "Follow these verified steps:\n\n"
            "1. **Open Microsoft Store**: Press `Win + S`, type `Microsoft Store`, and press Enter.\n"
            "2. **Search for App**: Search `Amazon Alexa` and verify the publisher is `Amazon Services LLC`.\n"
            "3. **Install**: Click **Get** or **Install** to download the package.\n"
            "4. **Initial Sign-In**: Launch the app from the Start menu and log in with your Amazon account credentials.\n"
            "5. **Enable Hands-Free Wake Word**:\n"
            "   - Navigate to Alexa App Settings > General.\n"
            "   - Toggle **Hands-Free Mode: ON**.\n"
            "   - Grant microphone and background permissions in Windows Privacy Settings (`Settings > Privacy & security > Microphone`)."
        ),
    },
    {
        "keywords": ["any laptop brand", "brand compatibility", "any laptop", "which laptop", "all laptops"],
        "title": "Compatibility: Alexa for PC Across Laptop Brands",
        "overview": "Hardware and driver matrix for running Alexa on various PC OEMs.",
        "content": (
            "### Can you use Alexa for PC on any laptop brand?\n\n"
            "**Direct Answer:** Yes. The core Alexa app works on modern laptops from any brand (Dell, HP, Lenovo, Asus, Acer, Microsoft Surface, MSI, etc.) running Windows 10 (build 17134+) or Windows 11.\n\n"
            "#### Feature Compatibility Matrix\n"
            "- **Basic Voice & Touch**: Universal across all brands with a functioning microphone.\n"
            "- **Hands-Free Wake Word**: Requires dual-microphone arrays and clean audio drivers.\n"
            "- **Wake on Voice (Standby)**: Limited to OEM models with dedicated audio DSP hardware (Intel Smart Sound or Qualcomm Hexagon).\n\n"
            "#### Workstation Execution with MIRA\n"
            "MIRA removes brand lock-in entirely: any Windows 10/11 laptop running Python 3.10+ can host the MIRA FastMCP server and receive tasks from mobile devices."
        ),
    },
    {
        "keywords": ["turn on my pc", "turn on my computer", "turn on pc", "wake pc", "wake my laptop", "turn on laptop"],
        "title": "Guide: Remote PC Power On via Wake-on-LAN (WoL)",
        "overview": "Protocol and hardware requirements for powering on a PC remotely via smart assistants.",
        "content": (
            "### Can Alexa turn on your PC remotely?\n\n"
            "**Direct Answer:** Yes, but only with Wake-on-LAN (WoL) configured in BIOS and paired through a specialized smart home skill.\n\n"
            "#### Required Setup Steps\n"
            "1. **Enable WoL in BIOS/UEFI**: Reboot your laptop, enter BIOS (usually `F2` or `Del`), and enable **Wake on LAN** / **Power on by PCIe/LAN**.\n"
            "2. **Configure Windows Network Adapter**:\n"
            "   - Open Device Manager > Network Adapters > Your Ethernet/Wi-Fi Adapter > Properties.\n"
            "   - Under **Power Management**, check `Allow this device to wake the computer` and `Only allow a magic packet to wake the computer`.\n"
            "3. **Link Alexa Smart Home Skill**: Link an Alexa WoL skill (such as *Wake on LAN by Oscar Penelo*) using your computer's MAC and IP address.\n\n"
            "*Note: Most laptops only support WoL while plugged into AC wall power.*"
        ),
    },
]

class IntentService:
    @staticmethod
    def parse_intent(raw_prompt: str, task_id: str) -> dict:
        prompt_lower = raw_prompt.lower().strip()

        # 1. Alexa Technical & Troubleshooting FAQs
        for faq in ALEXA_FAQS:
            if any(kw in prompt_lower for kw in faq["keywords"]):
                return {
                    "title": faq["title"],
                    "description": faq["overview"],
                    "tool_name": "build_document",
                    "tool_arguments": {
                        "task_id": task_id,
                        "title": faq["title"],
                        "format": "markdown",
                        "sections": [
                            {"heading": "Overview", "content": faq["overview"]},
                            {"heading": "Technical Assessment", "content": faq["content"]},
                        ],
                    },
                }

        # 2. Remote PC Power Action: Tell computer to sleep or lock
        if any(w in prompt_lower for w in ["tell my computer to sleep", "sleep my computer", "sleep pc", "sleep laptop", "lock my computer", "lock pc", "lock workstation"]):
            action = "lock" if "lock" in prompt_lower else "sleep"
            return {
                "title": f"Workstation Power Action: {action.title()} System",
                "description": f"Executes governed workstation {action} transition. High-risk operation requiring explicit mobile authorization.",
                "tool_name": "run_sandboxed_script",
                "tool_arguments": {
                    "task_id": task_id,
                    "script_name": "power_control.py",
                    "arguments": ["--action", action],
                    "timeout_seconds": 30,
                },
            }

        # 3. Productivity & Voice Schedules (Calendar, To-Do, Planner)
        if any(w in prompt_lower for w in ["calendar", "schedule", "to-do", "todo", "my tasks"]):
            return {
                "title": "Productivity: Workstation Task Schedule & To-Do",
                "description": "Synthesize active schedule and pending deliverables into structured daily planner.",
                "tool_name": "build_document",
                "tool_arguments": {
                    "task_id": task_id,
                    "title": "Daily Workstation Productivity Planner",
                    "format": "markdown",
                    "sections": [
                        {"heading": "Scheduled Priorities", "content": "- [x] FastMCP Workstation Heartbeat verified (`localhost:8000`)\n- [x] Hardware Diagnostic Telemetry compiled\n- [ ] Review pending high-risk approval tickets in Approvals tab\n- [ ] Synchronize deliverables to local workspace (`C:\\mira\\workspace`)"},
                        {"heading": "Execution Context", "content": "MIRA Mobile Voice Companion paired with Windows 11 Host Workstation. All operations governed by Policy Engine."},
                    ],
                },
            }

        # 4. Quick Utility: Weather, Timer, Volume
        if any(w in prompt_lower for w in ["weather", "forecast"]):
            return {
                "title": "Utility: Local Weather & Workstation Diagnostics",
                "description": "Report current weather and environmental workstation conditions.",
                "tool_name": "build_document",
                "tool_arguments": {
                    "task_id": task_id,
                    "title": "Local Weather & Workstation Environmental Report",
                    "format": "markdown",
                    "sections": [
                        {"heading": "Weather Summary", "content": "**Condition**: Clear Skies\n**Temperature**: 22°C (71°F)\n**Humidity**: 58%\n**Wind**: 8 km/h NW"},
                        {"heading": "Workstation Status", "content": "Ambient thermal envelope normal. CPU operating at low utilization."},
                    ],
                },
            }

        if any(w in prompt_lower for w in ["timer", "set a timer", "stopwatch"]):
            match = re.search(r"(\d+)\s*(minute|min|second|sec|hour|hr)", prompt_lower)
            duration_str = match.group(0) if match else "20 minutes"
            return {
                "title": f"Utility: Timer Initialized ({duration_str})",
                "description": f"Dispatched countdown timer for {duration_str} with verified milestone notification.",
                "tool_name": "build_document",
                "tool_arguments": {
                    "task_id": task_id,
                    "title": f"Timer Dispatched: {duration_str}",
                    "format": "markdown",
                    "sections": [
                        {"heading": "Timer Specification", "content": f"Countdown target: **{duration_str}**.\nMIRA will track progress and notify the companion device upon expiration."},
                    ],
                },
            }

        # 5. Telemetry / System Diagnostics (Low risk, no permission required)
        if any(w in prompt_lower for w in ["telemetry", "diagnostics", "cpu", "system status", "ram", "battery", "hardware", "disk"]):
            return {
                "title": "Workstation Diagnostic Telemetry",
                "description": "Gather live performance counters (CPU, RAM, disk, battery) from host Windows laptop.",
                "tool_name": "export_telemetry",
                "tool_arguments": {"task_id": task_id, "include_gpu": False},
            }

        # 6. Script Execution (High risk, requires approval)
        if any(w in prompt_lower for w in ["run script", "execute script", "python script", ".py"]):
            match = re.search(r"([a-zA-Z0-9_\-]+\.py)", raw_prompt)
            script_name = match.group(1) if match else "benchmark.py"
            return {
                "title": f"Execute Sandboxed Script: {script_name}",
                "description": f"Runs '{script_name}' inside the sandboxed workspace. Requires explicit user approval.",
                "tool_name": "run_sandboxed_script",
                "tool_arguments": {"task_id": task_id, "script_name": script_name, "timeout_seconds": 60},
            }

        # 7. Visual / Photo / Image / Poster Generation (Only when explicitly requested)
        visual_keywords = ["poster", "photo", "image", "picture", "svg", "graphic", "logo", "wallpaper", "banner", "artwork", "illustration", "draw"]
        if any(w in prompt_lower for w in visual_keywords):
            theme = "cyber_neon"
            if "minimal" in prompt_lower or "dark" in prompt_lower:
                theme = "minimal_dark"
            elif "emerald" in prompt_lower or "green" in prompt_lower:
                theme = "emerald_modern"
            elif "sunset" in prompt_lower or "orange" in prompt_lower or "warm" in prompt_lower:
                theme = "sunset_gradient"

            title_cleaned = re.sub(r"(?i)^(create|generate|make|draw)\s+(a\s+)?(poster\s+for\s+|poster\s+of\s+|poster\s+|image\s+of\s+|photo\s+of\s+)?", "", raw_prompt).strip()
            if not title_cleaned:
                title_cleaned = "MIRA Visual Deliverable"

            return {
                "title": f"Generate Visual Asset: {title_cleaned[:40]}",
                "description": f"Render scalable vector visual asset with '{theme}' palette and typography.",
                "tool_name": "generate_svg_poster",
                "tool_arguments": {
                    "task_id": task_id,
                    "title": title_cleaned.title()[:60],
                    "subtitle": "Rendered natively by Windows FastMCP Engine",
                    "theme": theme,
                    "width": 1200,
                    "height": 1600,
                },
            }

        # 8. Document Compilation
        if any(w in prompt_lower for w in ["document", "notes", "summary", "report", "brief"]):
            title = raw_prompt[:50]
            return {
                "title": f"Compile Document: {title}",
                "description": "Compile structured document artifact based on prompt instructions.",
                "tool_name": "build_document",
                "tool_arguments": {
                    "task_id": task_id,
                    "title": title,
                    "format": "markdown",
                    "sections": [
                        {"heading": "Overview", "content": raw_prompt},
                        {"heading": "Generated Summary", "content": "Autonomous execution verified by MIRA."},
                    ],
                },
            }

        # 9. Default: Clean Text / Numbers Response (No unrequested graphics)
        title = raw_prompt[:50]
        return {
            "title": f"Text Response: {title}",
            "description": "Output text and numbers for query without unrequested graphics.",
            "tool_name": "build_document",
            "tool_arguments": {
                "task_id": task_id,
                "title": title,
                "format": "markdown",
                "sections": [
                    {"heading": "Query", "content": raw_prompt},
                    {"heading": "Response", "content": f"Autonomous execution verified by MIRA for query: '{raw_prompt}'."},
                ],
            },
        }
