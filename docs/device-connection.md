# Device Identity, Connection & Network Topology

- **Document ID**: `MIRA-DOC-DEV-010`
- **Revision**: 1.1.0
- **Status**: Engineering Standard
- **Last Updated**: 2026-10-18

---

## 1. Network Perimeter & Endpoints

MIRA's network architecture connects three well-defined tiers while enforcing strict security enclaves:

```
[Phone 1: Mobile UI] 
       | 
       |  (1. HTTPS / WSS / SSE with Bearer JWT)
       v
[MIRA Backend: Docker Container]
       |
       |  (2. Streamable HTTP with HMAC/mTLS)
       v
[Windows Laptop: FastMCP Workstation Engine]
```

### Key Topology Constraints
1. **Phone 1 is Sole User Endpoint**: Phone 1 directly handles voice input, plan confirmation, approval popups, and artifact viewing. No secondary companion phone or forwarding relay exists.
2. **Backend is Intermediary Gateway**: Phone 1 never makes direct network requests to the Windows laptop.
3. **Streamable HTTP Transport**: The Flask backend communicates with the laptop's FastMCP server via modern Streamable HTTP (incorporating JSON-RPC over POST and bidirectional streaming over SSE). Target protocol version: MCP `2025-11-25` or later.

---

## 2. Device Identity & Pairing

Every device participating in the system is registered in accordance with `schemas/device.schema.json` and tied to a valid `user_id`.

### A. Phone 1 Registration & Trust
- **Role**: `phone_primary`.
- **User Association**: Bound to `user_id` representing the authorized human user.
- **Capabilities**: `["task:submit", "task:read", "approval:grant", "artifact:read"]`.
- **Pairing Ceremony**:
  1. The administrator launches the MIRA backend container.
  2. The backend generates a secure 6-digit one-time pairing PIN or QR code.
  3. The user on Phone 1 scans or enters the PIN at `/api/auth/pair`.
  4. The backend issues a 24-hour Bearer JWT signed with a secret HMAC key containing both `sub` (`user_id`) and `dev_id` (`device_id`).
  5. The JWT is stored securely in Phone 1's browser storage.

### B. Windows Laptop Registration
- **Role**: `windows_workstation`.
- **User Association**: Associated with the owner's `user_id`.
- **Capabilities**: `["mcp:host_server", "mcp:execute_tool"]`.
- **Authentication**: Mutual Pre-Shared Key (PSK) or mTLS client certificates.
- **Request Signing**: All requests from the backend to the laptop include:
  - `X-MIRA-Timestamp`: Current UTC time (rejects if clock drift > 30s).
  - `X-MIRA-Signature`: `HMAC-SHA256(secret_key, timestamp + method + body)`.

---

## 3. Liveness Probing & Health Protocol

To ensure Phone 1 is never left waiting on an unreachable laptop:
- **Workstation Health Probe**: The backend pings `http://<laptop-ip>:8000/health` every 30 seconds.
- **Mobile Heartbeat**: The backend pushes a `ping` event over SSE to Phone 1 every 15 seconds.
- **Degraded Mode**: If the laptop does not respond to 2 consecutive probes, the backend marks the workstation `offline`. Any subsequent task requiring workstation tools immediately alerts Phone 1 with actionable instructions: *"Your Windows MCP Server is unreachable. Please ensure Uvicorn is active."*
