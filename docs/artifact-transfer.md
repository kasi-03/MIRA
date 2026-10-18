# Artifact Transfer, Verification & Storage Pipeline

- **Document ID**: `MIRA-DOC-ART-012`
- **Revision**: 1.1.0
- **Status**: Engineering Specification
- **Last Updated**: 2026-10-18

---

## 1. Overview & Architectural Custody

In MIRA, an **Artifact** represents a verified, physical digital asset generated on the user's **Windows Laptop** and securely delivered to **Phone 1**.

To safeguard the user's mobile device and desktop:
- Phone 1 **never** receives direct filesystem access to the workstation.
- All files pass through an isolated staging and verification pipeline within the MIRA backend container.

```
[Windows Laptop: FastMCP]
       |
       | (1. Internal Transfer: HTTP stream with SHA-256 header)
       v
[Backend Container: Staging & Verification Engine]
       |
       | (2. Hash verification + Deep Structural & Safety Probe)
       v
[Phone 1: Authenticated Retrieval & Rendering]
```

---

## 2. Permitted MIME Types & Verification Standards

To guarantee security and consistent mobile rendering, MIRA restricts artifacts to a strict whitelist:

| Content Type | Max Size | Verifier Engine | Security Rules Enforced |
| :--- | :--- | :--- | :--- |
| `image/svg+xml` | 10 MB | `SVGVerifier` | Well-formed XML; valid `<svg>` root tag; strict rejection of `<script>`, `<foreignObject>`, and event handlers. |
| `image/png` | 25 MB | `ImageVerifier` | Magic bytes check (`89 50 4E 47`); strip EXIF / suspicious metadata chunks. |
| `image/jpeg` | 25 MB | `ImageVerifier` | Magic bytes check (`FF D8 FF`); strip executable headers. |
| `application/pdf` | 30 MB | `PDFVerifier` | Magic bytes check (`%PDF-`); ban on embedded JavaScript and launch actions. |
| `text/markdown` | 5 MB | `TextVerifier` | UTF-8 encoded plain text; AST sanitization for safe rendering. |
| `application/json` | 10 MB | `JSONVerifier` | RFC 8259 syntax validation; maximum depth recursion limits. |

---

## 3. End-to-End Custody Protocol

### Phase 1: Generation on Workstation
1. FastMCP executes tool `generate_svg_poster`.
2. Output file written to `C:\mira\workspace\tasks\{task_id}\poster.svg`.
3. Workstation computes SHA-256 hash:
   $$\text{SHA-256} = \texttt{e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855}$$
4. Returns manifest containing `filename`, `content_type`, `byte_size`, and `sha256`.

### Phase 2: Ingestion & Verification by Backend
1. Flask issues `GET /internal/artifacts/{task_id}/poster.svg` to laptop MCP server.
2. The file is streamed into `storage/artifacts/{task_id}/poster.svg`.
3. As the stream is read, the backend calculates the SHA-256 hash.
4. **Integrity Gate**:
   $$\text{Computed SHA-256} \stackrel{?}{=} \text{Manifest SHA-256}$$
   If hashes do not match, the file is unlinked, and the task fails immediately.
5. **Structural Gate**:
   The `SVGVerifier` parses the XML document:
   - Verifies root node is `<svg xmlns="http://www.w3.org/2000/svg">`.
   - Checks presence of valid `viewBox` or `width`/`height`.
   - Probes entire DOM tree for forbidden tags (`<script>`, `<iframe>`, `<object>`).
   - If any violation is found, verification fails.
6. **Persistence**:
   Upon verification pass, the backend registers the artifact in SQLite in conformance with `schemas/artifact.schema.json`, tracking `user_id` and `device_id`.

### Phase 3: Secure Mobile Delivery
1. The backend pushes `artifact:ready` event over SSE to Phone 1.
2. The event includes a signed, time-limited download URL:
   `https://mira.local/api/artifacts/{artifact_id}/download?token=<signed_jwt>`
3. Phone 1 fetches the asset and renders it using `ImagePreview.jsx` (with SVG pan/zoom controls).

---

## 4. Retention Policy & Auto-Purging

Artifacts are categorized into three lifecycle tiers:

1. **`ephemeral_1_hour`**:
   - Used for temporary diagnostic telemetry, raw execution logs, and intermediate render chunks.
   - Automatically unlinked and purged from disk 60 minutes after generation.
2. **`standard_7_days`**:
   - Default tier for generated posters, documents, and project summaries.
   - Retained for 7 days to allow offline review on Phone 1.
3. **`permanent_archive`**:
   - Pinned by the user via the Phone 1 UI.
   - Persisted until explicit user deletion.

### Cryptographic Deletion Process
When an artifact expires or is manually deleted:
1. The file bytes in container storage (`storage/artifacts/`) are overwritten with zeros and unlinked.
2. An authenticated request is dispatched to the Windows laptop to purge the scratch copy from `C:\mira\workspace\`.
3. Database record status is marked `purged`.
