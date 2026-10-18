import os
import hashlib
from pathlib import Path
from typing import Dict, Any, Tuple
from ..config import settings
from .policy_engine import PolicyEngine

class ResultVerifier:
    @staticmethod
    def verify_file_artifact(
        filename: str, 
        expected_content: str = None, 
        expected_hash: str = None,
        workspace_root: str = None
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Independently checks that the file was created on disk, validates size,
        calculates SHA-256 hash, and compares against expectations.
        """
        try:
            target_path = PolicyEngine.validate_workspace_path(filename, workspace_root)
        except Exception as e:
            return False, {"error": f"Path validation failed: {str(e)}"}
            
        if not target_path.exists():
            return False, {
                "error": "File does not exist on disk",
                "path": str(target_path)
            }
            
        if not target_path.is_file():
            return False, {
                "error": "Target path is not a regular file",
                "path": str(target_path)
            }
            
        actual_bytes = target_path.read_bytes()
        actual_size = len(actual_bytes)
        actual_hash = hashlib.sha256(actual_bytes).hexdigest()
        
        # Hash match check if provided
        if expected_hash and actual_hash.lower() != expected_hash.lower():
            return False, {
                "error": "SHA-256 mismatch",
                "expected_hash": expected_hash,
                "actual_hash": actual_hash
            }
            
        # Content match check if provided
        if expected_content is not None:
            actual_text = actual_bytes.decode('utf-8', errors='replace')
            if actual_text != expected_content:
                return False, {
                    "error": "Content mismatch",
                    "expected_length": len(expected_content),
                    "actual_length": len(actual_text)
                }
                
        return True, {
            "status": "verified",
            "path": str(target_path),
            "byte_size": actual_size,
            "sha256": actual_hash,
            "filename": target_path.name
        }
