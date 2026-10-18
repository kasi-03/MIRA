import json
import subprocess
import os
from typing import Dict, Any, Tuple
from pathlib import Path

try:
    from .config import config
except ImportError:
    from config import config

class MCPRuntimeClient:
    def __init__(self, node_executable: str = None, server_script: str = None, workspace_root: str = None):
        self.node_executable = node_executable or config.NODE_PATH
        self.server_script = server_script or config.MCP_SERVER_SCRIPT
        self.workspace_root = workspace_root or config.WORKSPACE_ROOT

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any], timeout_seconds: int = 30) -> Tuple[bool, Dict[str, Any]]:
        """
        Executes a tool on the Node.js MCP runtime via subprocess.
        Pipes tool payload safely via stdin to prevent shell quoting issues.
        """
        runner_js = """
import fs from 'node:fs';
import { filesystemTools } from './src/tools/filesystem.js';

async function main() {
  const rawInput = fs.readFileSync(0, 'utf-8');
  const payload = JSON.parse(rawInput);
  const toolName = payload.toolName;
  const args = payload.arguments || {};
  
  if (toolName === 'filesystem_write') {
    const res = await filesystemTools.writeFile(args);
    console.log(JSON.stringify(res));
  } else if (toolName === 'filesystem_read') {
    const res = await filesystemTools.readFile(args);
    console.log(JSON.stringify(res));
  } else if (toolName === 'filesystem_list') {
    const res = await filesystemTools.listFiles(args);
    console.log(JSON.stringify(res));
  } else {
    throw new Error(`Unsupported tool: ${toolName}`);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
"""
        env = os.environ.copy()
        env["WINDOWS_WORKSPACE_ROOT"] = self.workspace_root
        
        mcp_runtime_dir = Path(self.server_script).parent.parent
        payload = json.dumps({"toolName": tool_name, "arguments": arguments})

        try:
            proc = subprocess.run(
                [
                    self.node_executable,
                    "--input-type=module",
                    "-e",
                    runner_js
                ],
                input=payload,
                cwd=str(mcp_runtime_dir),
                env=env,
                capture_output=True,
                text=True,
                timeout=timeout_seconds
            )

            if proc.returncode != 0:
                err_msg = proc.stderr.strip() or f"Process failed with exit code {proc.returncode}"
                return False, {"error": err_msg}

            out = proc.stdout.strip()
            data = json.loads(out)
            return True, data
        except subprocess.TimeoutExpired:
            return False, {"error": f"Tool execution timed out after {timeout_seconds} seconds"}
        except Exception as e:
            return False, {"error": str(e)}
