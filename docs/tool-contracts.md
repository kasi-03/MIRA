# FastMCP Tool Contracts & Schema Registry

- **Document ID**: `MIRA-DOC-CON-008`
- **Revision**: 1.1.0
- **Status**: Engineering Specification
- **Last Updated**: 2026-10-18

---

## 1. Overview & Contract Standards

Every FastMCP tool exposed by the Windows Laptop server adheres to a strict contract specifying:
- Tool identifier & semantic description.
- Input parameters conforming to JSON Schema.
- Operational risk level (`low`, `medium`, `high`, `critical`).
- Output manifest contract.
- Standardized error codes.

---

## 2. Tool 1: `generate_svg_poster`

Generates high-fidelity, scalable vector graphics posters with clean gradients, modern geometric layouts, and accessible typography.

- **Risk Level**: `low` (Sandboxed file creation within temporary task workspace; no system mutation).
- **Approval Required**: No (safe default execution).

### Input Schema
```json
{
  "type": "object",
  "required": ["task_id", "title"],
  "properties": {
    "task_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 2, "maxLength": 100 },
    "subtitle": { "type": "string", "maxLength": 150 },
    "theme": { 
      "type": "string", 
      "enum": ["cyber_neon", "minimal_dark", "emerald_modern", "sunset_gradient"],
      "default": "cyber_neon" 
    },
    "width": { "type": "integer", "default": 1200, "minimum": 400, "maximum": 4000 },
    "height": { "type": "integer", "default": 1600, "minimum": 400, "maximum": 4000 }
  }
}
```

### Output Manifest
```json
{
  "status": "success",
  "tool_name": "generate_svg_poster",
  "artifact": {
    "filename": "poster_c1a93b44.svg",
    "content_type": "image/svg+xml",
    "byte_size": 28410,
    "sha256": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
  }
}
```

---

## 3. Tool 2: `build_document`

Compiles structured markdown documents, meeting summaries, or technical release notes into clean PDF or Markdown formats.

- **Risk Level**: `low` (Sandboxed document creation).
- **Approval Required**: No.

### Input Schema
```json
{
  "type": "object",
  "required": ["task_id", "title", "sections"],
  "properties": {
    "task_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "maxLength": 120 },
    "format": { "type": "string", "enum": ["markdown", "pdf"], "default": "markdown" },
    "sections": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["heading", "content"],
        "properties": {
          "heading": { "type": "string" },
          "content": { "type": "string" }
        }
      }
    }
  }
}
```

---

## 4. Tool 3: `export_telemetry`

Collects sanitized workstation telemetry (CPU load, memory utilization, disk space in workspace, battery percentage) for mobile diagnostic monitoring.

- **Risk Level**: `low` (Read-only query of sandboxed performance counters).
- **Approval Required**: No.

### Input Schema
```json
{
  "type": "object",
  "required": ["task_id"],
  "properties": {
    "task_id": { "type": "string", "format": "uuid" },
    "include_gpu": { "type": "boolean", "default": false }
  }
}
```

---

## 5. Tool 4: `run_sandboxed_script`

Executes an authorized Python script within the sandboxed project workspace.

- **Risk Level**: `high` (Executes code; potentially alters local data files or consumes heavy workstation compute).
- **Approval Required**: **YES (Mandatory Phone 1 Approval within 180s TTL)**.

### Input Schema
```json
{
  "type": "object",
  "required": ["task_id", "script_name"],
  "properties": {
    "task_id": { "type": "string", "format": "uuid" },
    "script_name": { 
      "type": "string", 
      "pattern": "^[a-zA-Z0-9_\\-]+\\.py$",
      "description": "Name of authorized python script residing in C:\\mira\\workspace\\scripts\\"
    },
    "arguments": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Sanitized CLI arguments."
    },
    "timeout_seconds": { "type": "integer", "default": 60, "maximum": 120 }
  }
}
```

---

## 6. Error Codes & Diagnostic Registry

When a tool fails, it returns a standard JSON-RPC 2.0 error object with structured diagnostic data:

| Error Code | Constant | Meaning & Corrective Action |
| :--- | :--- | :--- |
| `-32602` | `INVALID_ARGUMENTS` | Tool arguments failed JSON Schema validation. Client must fix payload. |
| `-32001` | `WORKSPACE_VIOLATION` | Script attempted path traversal outside `C:\mira\workspace\`. Blocked. |
| `-32002` | `EXECUTION_TIMEOUT` | Tool exceeded allotted time limit (e.g. 60s or 120s). Subprocess killed. |
| `-32003` | `RENDER_FAILURE` | SVG or document generator failed to compile valid XML/PDF nodes. |
| `-32004` | `APPROVAL_REQUIRED` | Tool invocation attempted without a valid, unexpired approval token. |
