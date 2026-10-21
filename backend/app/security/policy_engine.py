TOOL_POLICIES = {
    "generate_svg_poster": {"risk_level": "low", "consequential": False},
    "build_document": {"risk_level": "low", "consequential": False},
    "export_telemetry": {"risk_level": "low", "consequential": False},
    "run_sandboxed_script": {"risk_level": "high", "consequential": True},
}

class PolicyEngine:
    @staticmethod
    def evaluate(tool_name: str) -> dict:
        """Returns risk level and consequential flag for a given tool."""
        return TOOL_POLICIES.get(
            tool_name,
            {"risk_level": "high", "consequential": True}
        )
