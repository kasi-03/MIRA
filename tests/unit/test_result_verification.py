import hashlib
import pytest
from app.services.verification_service import VerificationService, VerificationError

def test_verify_valid_svg_artifact(tmp_path):
    svg_file = tmp_path / "valid.svg"
    svg_content = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>'
    svg_file.write_text(svg_content, encoding="utf-8")
    sha256 = hashlib.sha256(svg_content.encode("utf-8")).hexdigest()

    result = VerificationService.verify_artifact(svg_file, sha256, "image/svg+xml")
    assert result["verified"] is True
    assert result["sha256"] == sha256

def test_verify_corrupted_svg_syntax(tmp_path):
    corrupt_file = tmp_path / "corrupt.svg"
    corrupt_content = '<svg><unclosed_tag>'
    corrupt_file.write_text(corrupt_content, encoding="utf-8")
    sha256 = hashlib.sha256(corrupt_content.encode("utf-8")).hexdigest()

    with pytest.raises(VerificationError, match="Corrupted or invalid SVG XML"):
        VerificationService.verify_artifact(corrupt_file, sha256, "image/svg+xml")

def test_verify_checksum_mismatch(tmp_path):
    svg_file = tmp_path / "mismatch.svg"
    svg_content = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
    svg_file.write_text(svg_content, encoding="utf-8")

    with pytest.raises(VerificationError, match="SHA-256 mismatch"):
        VerificationService.verify_artifact(svg_file, "wrong_hash_value", "image/svg+xml")
