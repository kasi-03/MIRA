import os
from pathlib import Path
from typing import Dict, Any, Tuple
from ..config import settings

ALLOWED_TOOLS = {
    "filesystem_write": {
        "risk_level": "medium",
        "consequential": True,
        "requires_approval": False, # low/medium safe filesystem ops auto-proceed if confirmed
        "timeout_seconds": 30
    },
    "filesystem_read": {
        "risk_level": "low",
        "consequential": False,
        "requires_approval": False,
        "timeout_seconds": 15
    },
    "filesystem_list": {
        "risk_level": "low",
        "consequential": False,
        "requires_approval": False,
        "timeout_seconds": 10
    },
    "terminal_run": {
        "risk_level": "critical",
        "consequential": True,
        "requires_approval": True,
        "timeout_seconds": 60
    }
}

class PolicyEngine:
    @staticmethod
    def evaluate_task(tool_name: str, arguments: Dict[str, Any]) -> Tuple[str, bool, bool]:
        """Returns (risk_level, consequential, requires_approval)"""
        tool_spec = ALLOWED_TOOLS.get(tool_name)
        if not tool_spec:
            return "critical", True, True
        
        risk = tool_spec["risk_level"]
        consequential = tool_spec["consequential"]
        requires_approval = tool_spec["requires_approval"]
        
        # Additional argument-level checks
        if "force" in arguments and arguments["force"]:
            risk = "high"
            requires_approval = True
            
        return risk, consequential, requires_approval

    @staticmethod
    def validate_workspace_path(file_path: str, workspace_root: str = None) -> Path:
        """Validates that a path is strictly inside the workspace and prevents traversal."""
        root = Path(workspace_root or settings.WORKSPACE_ROOT).resolve()
        
        # Strip leading slashes to prevent root-relative escaping
        clean_rel = file_path.lstrip("/\\")
        target = (root / clean_rel).resolve()
        
        try:
            target.relative_to(root)
        except ValueError:
            raise PermissionError(f"Security violation: path '{file_path}' attempts to escape workspace root '{root}'")
            
        return target
