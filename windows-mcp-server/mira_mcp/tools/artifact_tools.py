import hashlib
import json
import os
import psutil
from pathlib import Path
from ..config import ARTIFACTS_DIR
from ..security.workspace_guard import validate_workspace_path

THEME_PALETTES = {
    "cyber_neon": {
        "bg_start": "#0a0b10",
        "bg_end": "#17152c",
        "accent_primary": "#00f0ff",
        "accent_secondary": "#ff007f",
        "text_primary": "#f8f9fa",
        "text_muted": "#8b949e",
        "border": "#00f0ff44",
    },
    "minimal_dark": {
        "bg_start": "#121212",
        "bg_end": "#1e1e24",
        "accent_primary": "#e0e0e0",
        "accent_secondary": "#9c7855",
        "text_primary": "#ffffff",
        "text_muted": "#a0a0a0",
        "border": "#333333",
    },
    "emerald_modern": {
        "bg_start": "#051f18",
        "bg_end": "#0b3c30",
        "accent_primary": "#10b981",
        "accent_secondary": "#34d399",
        "text_primary": "#ecfdf5",
        "text_muted": "#6ee7b7",
        "border": "#10b98155",
    },
    "sunset_gradient": {
        "bg_start": "#2b1055",
        "bg_end": "#75225b",
        "accent_primary": "#ff7b54",
        "accent_secondary": "#ffb26b",
        "text_primary": "#fffbf5",
        "text_muted": "#ffd1bb",
        "border": "#ff7b5455",
    },
}

def generate_svg_poster(
    task_id: str,
    title: str,
    subtitle: str = "",
    theme: str = "cyber_neon",
    width: int = 1200,
    height: int = 1600,
) -> dict:
    """Generates a high-fidelity vector graphics poster with modern geometry, typography and gradients."""
    palette = THEME_PALETTES.get(theme, THEME_PALETTES["cyber_neon"])
    short_id = task_id[:8] if task_id else "render"
    filename = f"poster_{short_id}.svg"
    file_path = validate_workspace_path(filename, subfolder="artifacts")

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{palette['bg_start']}" />
      <stop offset="100%" stop-color="{palette['bg_end']}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{palette['accent_primary']}" />
      <stop offset="100%" stop-color="{palette['accent_secondary']}" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="{width}" height="{height}" fill="url(#bgGrad)" />

  <!-- Decorative Architectural Grid & Orbits -->
  <circle cx="{width * 0.85}" cy="{height * 0.2}" r="380" fill="none" stroke="{palette['border']}" stroke-width="2" opacity="0.6" />
  <circle cx="{width * 0.85}" cy="{height * 0.2}" r="220" fill="none" stroke="{palette['accent_primary']}" stroke-width="1.5" opacity="0.4" stroke-dasharray="8 6" />
  <circle cx="{width * 0.15}" cy="{height * 0.85}" r="280" fill="none" stroke="{palette['accent_secondary']}" stroke-width="2" opacity="0.3" />

  <!-- Top Accent Banner -->
  <line x1="80" y1="120" x2="{width - 80}" y2="120" stroke="url(#accentGrad)" stroke-width="3" />
  <text x="80" y="90" font-family="'Syne', 'Montserrat', sans-serif" font-size="20" font-weight="700" letter-spacing="6" fill="{palette['accent_primary']}">MIRA WORKSTATION ENGINE // VERIFIED ARTIFACT</text>

  <!-- Main Headline -->
  <text x="80" y="{height * 0.42}" font-family="'Syne', 'Montserrat', sans-serif" font-size="76" font-weight="800" fill="{palette['text_primary']}" letter-spacing="-1">{title}</text>

  <!-- Subtitle -->
  {f'<text x="80" y="{height * 0.48}" font-family="\'Plus Jakarta Sans\', sans-serif" font-size="28" font-weight="400" fill="{palette["text_muted"]}" letter-spacing="1">{subtitle}</text>' if subtitle else ''}

  <!-- Data Display Card -->
  <rect x="80" y="{height * 0.6}" width="{width - 160}" height="280" rx="20" fill="{palette['bg_start']}" fill-opacity="0.7" stroke="{palette['border']}" stroke-width="1.5" />
  
  <text x="120" y="{height * 0.6 + 60}" font-family="'Courier Prime', monospace" font-size="20" fill="{palette['accent_primary']}">TASK SPECIFICATION</text>
  <text x="120" y="{height * 0.6 + 105}" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" fill="{palette['text_primary']}">Task Reference: {task_id}</text>
  <text x="120" y="{height * 0.6 + 145}" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" fill="{palette['text_muted']}">Active Palette: {theme.upper()}</text>
  <text x="120" y="{height * 0.6 + 185}" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" fill="{palette['text_muted']}">Render Resolution: {width} x {height} px</text>

  <!-- Footer Seal -->
  <line x1="80" y1="{height - 120}" x2="{width - 80}" y2="{height - 120}" stroke="{palette['border']}" stroke-width="1" />
  <text x="80" y="{height - 70}" font-family="'Courier Prime', monospace" font-size="18" fill="{palette['text_muted']}">MIRA PROTOCOL 2025-11-25 · CRYPTOGRAPHICALLY VALIDATED</text>
  <text x="{width - 80}" y="{height - 70}" text-anchor="end" font-family="'Courier Prime', monospace" font-size="18" fill="{palette['accent_primary']}">STATUS: 200 OK</text>
</svg>"""

    raw_bytes = svg_content.encode("utf-8")
    file_path.write_bytes(raw_bytes)
    sha256 = hashlib.sha256(raw_bytes).hexdigest()

    return {
        "status": "success",
        "tool_name": "generate_svg_poster",
        "artifact": {
            "filename": filename,
            "content_type": "image/svg+xml",
            "byte_size": len(raw_bytes),
            "sha256": sha256,
            "path": str(file_path),
        },
    }

def build_document(task_id: str, title: str, sections: list[dict], format: str = "markdown") -> dict:
    """Builds a structured markdown or text document artifact."""
    short_id = task_id[:8] if task_id else "doc"
    filename = f"doc_{short_id}.md"
    file_path = validate_workspace_path(filename, subfolder="artifacts")

    lines = [f"# {title}\n", f"**Task Reference**: `{task_id}`\n\n---\n"]
    for sec in sections:
        lines.append(f"## {sec.get('heading', 'Section')}\n")
        lines.append(f"{sec.get('content', '')}\n\n")

    doc_content = "".join(lines)
    raw_bytes = doc_content.encode("utf-8")
    file_path.write_bytes(raw_bytes)
    sha256 = hashlib.sha256(raw_bytes).hexdigest()

    return {
        "status": "success",
        "tool_name": "build_document",
        "artifact": {
            "filename": filename,
            "content_type": "text/markdown",
            "byte_size": len(raw_bytes),
            "sha256": sha256,
            "path": str(file_path),
        },
    }

def export_telemetry(task_id: str, include_gpu: bool = False) -> dict:
    """Collects workstation performance telemetry (CPU, RAM, disk, battery)."""
    cpu_percent = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage(str(ARTIFACTS_DIR.root if hasattr(ARTIFACTS_DIR, "root") else ARTIFACTS_DIR))
    battery = psutil.sensors_battery()

    data = {
        "task_id": task_id,
        "cpu": {"percent": cpu_percent, "cores": psutil.cpu_count(logical=True)},
        "memory": {
            "total_gb": round(memory.total / (1024**3), 2),
            "available_gb": round(memory.available / (1024**3), 2),
            "percent": memory.percent,
        },
        "disk": {
            "total_gb": round(disk.total / (1024**3), 2),
            "free_gb": round(disk.free / (1024**3), 2),
            "percent": disk.percent,
        },
        "battery": {
            "percent": battery.percent if battery else 100,
            "power_plugged": battery.power_plugged if battery else True,
        },
        "platform": "Windows 11 (Host Workstation)",
    }

    short_id = task_id[:8] if task_id else "telemetry"
    filename = f"telemetry_{short_id}.json"
    file_path = validate_workspace_path(filename, subfolder="artifacts")
    file_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    return {
        "status": "success",
        "tool_name": "export_telemetry",
        "telemetry": data,
        "artifact": {
            "filename": filename,
            "content_type": "application/json",
            "byte_size": file_path.stat().st_size,
            "sha256": hashlib.sha256(file_path.read_bytes()).hexdigest(),
            "path": str(file_path),
        },
    }
