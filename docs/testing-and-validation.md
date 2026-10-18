# Testing Strategy & Acceptance Criteria

- **Document ID**: `MIRA-DOC-TST-014`
- **Revision**: 1.1.0
- **Status**: Quality Assurance Standard
- **Last Updated**: 2026-10-18

---

## 1. Overview & Testing Pyramid

MIRA enforces a multi-tier testing framework ensuring every contract, security gate, and user workflow is validated prior to deployment.

```
                  / \
                 /   \
                / E2E \       Playwright Mobile Web Tests (Viewport: Phone 1)
               /-------\
              / Security\     Path Traversal, Expiry, Unauthorized Access
             /-----------\
            / Integration \   Flask API + Mock FastMCP + Artifact Transfer
           /---------------\
          /      Unit       \ pytest (Services, Policies, Schemas, Parsers)
         +-------------------+
```

---

## 2. Test Suites Breakdown

### A. Unit Tests (`tests/unit/`)
- `test_task_service.py`: FSM state transitions, timeout sweepers, cancellation.
- `test_approval_service.py`: Approval token generation, TTL expiration, single-use enforcement, user identity checks.
- `test_authorization.py`: JWT claims inspection, user vs device pairing validation, capability enforcement.
- `test_schema_validation.py`: Verification that all REST payloads adhere to JSON Schema Draft 2020-12 with `user_id`.
- `test_artifact_service.py`: Checksum calculation, MIME type classification, storage unlinking.
- `test_result_verification.py`: SVG XML validation, detection of malformed XML, rejection of `<script>` tags.

### B. Integration Tests (`tests/integration/`)
- `test_flask_api.py`: Full REST route coverage (`/api/tasks`, `/api/approvals`, `/api/artifacts`, `/api/events`).
- `test_mcp_client.py`: MCP client session management, Streamable HTTP communication, JSON-RPC serialization targeting MCP `2025-11-25` or later.
- `test_mcp_tools.py`: Tool discovery (`tools/list`), tool call execution (`tools/call`), parameter error propagation.
- `test_artifact_transfer.py`: Internal laptop-to-backend file transfer, streaming hash verification.

### C. Security & Penetration Tests (`tests/security/`)
- `test_unauthorized_access.py`: Verifies endpoints reject unauthenticated or expired JWT requests with HTTP 401.
- `test_approval_expiry.py`: Asserts that an approved decision submitted after `expires_at` is rejected with `APPROVAL_EXPIRED`.
- `test_path_traversal.py`: Attempts relative path exploits (`../../Windows/System32`) and validates that `WorkspaceGuard` rejects them with `-32001 WORKSPACE_VIOLATION`.
- `test_invalid_tool_arguments.py`: Injects malformed parameters to verify JSON Schema enforcement.

### D. End-to-End (E2E) Browser Tests (`tests/e2e/`)
Using **Playwright** with mobile viewport configuration (Pixel 7 / iPhone 15 emulation representing Phone 1):
- `test_task_workflow.py`: User types prompt on Phone 1 -> clicks "Confirm" -> observes SSE progress bar -> inspects completed card.
- `test_image_delivery.py`: Emulates SVG rendering, zoom/pan controls, and download trigger on Phone 1.
- `test_failure_scenarios.py`: Emulates laptop disconnect, showing appropriate error banners on Phone 1.

---

## 3. Mandatory Verification Negative Tests

The core rule of MIRA is: **Never mark a task successful merely because the tool returns success.**

The following negative verification test cases are explicitly enforced in `tests/unit/test_result_verification.py`:

| Test Case ID | Injected Fault | Expected Behavior | Final Task State |
| :--- | :--- | :--- | :--- |
| `TC-VERIF-01` | Tool returns success manifest, but generated SVG file is 0 bytes. | Verifier detects empty file; rejects artifact. | `failed` (`EMPTY_ARTIFACT`) |
| `TC-VERIF-02` | Tool returns SHA-256 `AAA...`, but file content hashes to `BBB...`. | Checksum mismatch detected; file discarded. | `failed` (`CHECKSUM_MISMATCH`) |
| `TC-VERIF-03` | SVG file contains `<script>alert(1)</script>`. | Structural XML probe detects forbidden tag. | `failed` (`UNSAFE_SCRIPT_TAG`) |
| `TC-VERIF-04` | Tool returns success, but output file is corrupted XML. | XML parser throws parse error. | `failed` (`CORRUPT_XML_STRUCTURE`) |

---

## 4. Execution Commands (For Phase 4)

```bash
# Run all unit tests
pytest tests/unit -v

# Run security test suite
pytest tests/security -v

# Run Playwright E2E tests (mobile emulation)
npx playwright test tests/e2e
```
*(Note: As per Phase 2 rules, tests will be executed only after implementation in subsequent phases).*
