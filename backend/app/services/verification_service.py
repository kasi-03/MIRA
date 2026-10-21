import hashlib
import xml.etree.ElementTree as ET
from pathlib import Path

class VerificationError(Exception):
    """Raised when an artifact fails cryptographic or structural integrity verification."""
    pass

class VerificationService:
    @staticmethod
    def verify_artifact(file_path: str | Path, expected_sha256: str, content_type: str) -> dict:
        """Verifies file existence, SHA-256 checksum match, and structural validity."""
        path = Path(file_path)
        if not path.exists():
            raise VerificationError(f"Artifact file not found: {file_path}")

        raw_bytes = path.read_bytes()
        if len(raw_bytes) == 0:
            raise VerificationError("Artifact file is empty (0 bytes)")

        # Verify SHA-256
        actual_sha256 = hashlib.sha256(raw_bytes).hexdigest()
        if actual_sha256.lower() != expected_sha256.lower():
            raise VerificationError(f"SHA-256 mismatch: expected {expected_sha256}, got {actual_sha256}")

        # Verify SVG XML Structure
        if content_type == "image/svg+xml":
            try:
                root = ET.fromstring(raw_bytes.decode("utf-8"))
                if not root.tag.endswith("svg"):
                    raise VerificationError(f"Root XML element must be <svg>, got <{root.tag}>")
            except ET.ParseError as e:
                raise VerificationError(f"Corrupted or invalid SVG XML syntax: {e}")

        return {
            "verified": True,
            "byte_size": len(raw_bytes),
            "sha256": actual_sha256,
        }
