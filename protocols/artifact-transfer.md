# Protocol Specification: Artifact Transfer, Verification & Retention

- **Protocol Identifier**: `MIRA-PROTO-ARTF-004`
- **Revision**: 1.1.0
- **Status**: Stable / Specification
- **Last Verified**: 2026-10-18
- **Applies To**: Windows Laptop MCP Server, MIRA Backend Gateway, Phone 1 Client

---

## 1. Overview & Security Sandbox Model

MIRA treats artifacts (generated vector graphics, diagrams, reports, logs) as strictly quarantined digital assets. 

Phone 1 is **strictly prohibited from accessing the raw Windows filesystem**. Instead, artifacts follow a 3-tier custody model:

```
[Windows Laptop Sandbox] 
       |  (1. FastMCP generates file inside confined C:\mira\workspace\)
       v
[Backend Verification & Staging]
       |  (2. Hash verification, structural parsing, safety scanning, SQLite registry)
       v
[Phone 1 Secure Delivery]
          (3. Scoped, time-limited, authenticated download link)
```

---

## 2. Permitted MIME Types & Constraints

To protect mobile clients against malicious payload execution, only whitelisted file formats are permitted:

| Content Type | File Extension | Max Byte Size | Verifier Engine | Security Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `image/svg+xml` | `.svg` | 10 MB | XML / SVG DOM Parser | Must contain valid `<svg>` root; strict ban on `<script>`, `<foreignObject>`, and external URI references. |
| `image/png` | `.png` | 25 MB | Binary Header & Chunk Reader | Magic bytes `89 50 4E 47 0D 0A 1A 0A`. Strips extraneous metadata chunks. |
| `image/jpeg` | `.jpg`, `.jpeg` | 25 MB | Image Structure Validator | Magic bytes `FF D8 FF`. |
| `application/pdf` | `.pdf` | 30 MB | PDF Header & Structure Probe | Magic bytes `%PDF-`. Prohibits embedded JavaScript and launch actions. |
| `text/markdown` | `.md` | 5 MB | UTF-8 Text / AST Parser | Safe UTF-8 encoding; sanitized rendering. |
| `application/json` | `.json` | 10 MB | JSON RFC 8259 Validator | Valid JSON; prevents prototype pollution. |

---

## 3. Step-by-Step Custody & Transfer Workflow

### Step 1: Workstation Generation & Hashing
1. The FastMCP tool on Windows writes output strictly to a sandboxed directory (e.g., `C:\mira\workspace\tasks\{task_id}\`).
2. The laptop server computes a SHA-256 digest of the output file.
3. The tool returns an execution manifest:
   ```json
   {
     "status": "success",
     "filename": "mira_poster_techfest.svg",
     "content_type": "image/svg+xml",
     "byte_size": 18452,
     "sha256": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
   }
   ```

### Step 2: Backend Pull & Integrity Check
1. The Flask backend issues an internal request to the laptop's artifact transfer endpoint:
   `GET /internal/artifacts/{task_id}/download` with mTLS/HMAC authorization.
2. The backend streams the payload into its isolated container storage (`storage/artifacts/{task_id}/`).
3. As bytes stream, the backend calculates the SHA-256 hash.
4. **Validation Check**: If calculated hash does not match `sha256` from the manifest, the file is immediately discarded and the task transitions to `failed` (`CHECKSUM_MISMATCH`).

### Step 3: Deep Content Verification
1. The backend triggers the corresponding verifier engine based on `content_type`.
2. For an SVG file:
   - Validates well-formed XML syntax.
   - Enforces valid root `<svg xmlns="http://www.w3.org/2000/svg">` and valid dimensions/viewBox.
   - Rejects any file containing `<script>` or event handlers (`onload`, `onclick`).
3. If deep verification fails, the file is quarantined and the task fails (`CORRUPT_OR_UNSAFE_ARTIFACT`).

### Step 4: Registration & Phone 1 Delivery
1. The backend creates an artifact record conforming to `schemas/artifact.schema.json`, populated with `user_id` and `device_id`.
2. Generates an authenticated, time-limited route: `/api/artifacts/{artifact_id}/download?token=<scoped_jwt>`.
3. Pushes event `artifact:ready` over SSE to Phone 1.
4. Phone 1 retrieves and renders the artifact in `ArtifactGallery.jsx` or `ImagePreview.jsx`.

---

## 4. Retention & Deletion Lifecycle

Artifacts are categorized into 3 retention tiers:

| Retention Tier | Default Lifetime | Typical Assets | Auto-Purge Mechanism |
| :--- | :--- | :--- | :--- |
| `ephemeral_1_hour` | 60 minutes | Temporary diagnostic logs, intermediate render chunks. | Background cron cleans up `NOW > expires_at`. |
| `standard_7_days` | 7 days (168 hrs) | User-requested posters, exported reports, diagrams. | Purged after 7 days; user notified on Phone 1. |
| `permanent_archive` | Indefinite | Explicitly pinned/bookmarked items by user. | Retained until explicit user deletion request. |

### Secure Deletion Protocol
When an artifact expires or a user requests deletion from Phone 1 (`DELETE /api/artifacts/{id}`):
1. **Container Storage**: File bytes are unlinked and overwritten with random zeros.
2. **Laptop Workspace**: The backend issues an authenticated command to FastMCP server: `DELETE /internal/artifacts/{task_id}` to purge the laptop's local scratch copy.
3. **Database**: Status in SQLite updated to `purged` and binary reference invalidated.
