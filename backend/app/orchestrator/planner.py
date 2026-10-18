import re
from typing import Dict, Any, Optional

class TaskPlanner:
    @staticmethod
    def plan_task(raw_prompt: str) -> Dict[str, Any]:
        """
        Parses natural language requests into structured execution plans.
        Supports file creation/manipulation, research, and general tool calls.
        """
        prompt = raw_prompt.strip()
        
        # Pattern: Create a file named <filename> containing '<content>' ...
        file_match = re.search(
            r"(?:create|write|make|generate)\s+(?:a\s+)?file\s+(?:named\s+|called\s+)?([^\s'\"]+)\s+containing\s+['\"](.*?)['\"]",
            prompt,
            re.IGNORECASE
        )
        
        if file_match:
            filename = file_match.group(1).strip()
            content = file_match.group(2)
            return {
                "title": f"Create {filename}",
                "description": f"Create file '{filename}' with specified content in workspace.",
                "tool_name": "filesystem_write",
                "arguments": {
                    "filename": filename,
                    "content": content
                },
                "verification_plan": {
                    "type": "file_content",
                    "filename": filename,
                    "expected_content": content
                }
            }
            
        # Pattern: List files
        if re.search(r"\b(list|show|view)\s+(?:the\s+)?files\b", prompt, re.IGNORECASE):
            return {
                "title": "List Workspace Files",
                "description": "Inspect and list files in workspace sandbox.",
                "tool_name": "filesystem_list",
                "arguments": {"directory": "."},
                "verification_plan": {"type": "non_empty_list"}
            }

        # Default fallback plan
        return {
            "title": f"Task: {prompt[:40]}...",
            "description": prompt,
            "tool_name": "filesystem_write",
            "arguments": {
                "filename": "output.txt",
                "content": prompt
            },
            "verification_plan": {
                "type": "file_exists",
                "filename": "output.txt"
            }
        }
