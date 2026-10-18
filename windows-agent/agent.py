import time
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List, Tuple

try:
    from .config import config
    from .mcp_client import MCPRuntimeClient
except ImportError:
    from config import config
    from mcp_client import MCPRuntimeClient

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("WindowsAgent")

class WindowsAgent:
    def __init__(self, backend_url: str = None, device_id: str = None, agent_secret: str = None):
        self.backend_url = (backend_url or config.BACKEND_URL).rstrip("/")
        self.device_id = device_id or config.DEVICE_ID
        self.agent_secret = agent_secret or config.AGENT_SECRET
        self.mcp_client = MCPRuntimeClient()
        self.capabilities = ["filesystem_write", "filesystem_read", "filesystem_list"]

    def _http_request(self, endpoint: str, method: str = "GET", payload: Optional[Dict[str, Any]] = None) -> Tuple[int, Dict[str, Any]]:
        url = f"{self.backend_url}{endpoint}"
        headers = {
            "Content-Type": "application/json",
            "X-Agent-Secret": self.agent_secret
        }
        data = json.dumps(payload).encode("utf-8") if payload else None
        req = urllib.request.Request(url, data=data, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                body = response.read().decode("utf-8")
                return response.status, json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")
            try:
                err_json = json.loads(body)
            except Exception:
                err_json = {"error": body}
            return e.code, err_json
        except Exception as e:
            return 500, {"error": str(e)}

    def enroll(self) -> bool:
        logger.info(f"Enrolling Windows Agent device '{self.device_id}' with backend...")
        payload = {
            "device_name": config.DEVICE_NAME,
            "device_type": "windows_workstation",
            "platform": "windows_11",
            "capabilities": self.capabilities,
            "auth_token": "workstation-token"
        }
        status_code, data = self._http_request("/api/v1/devices/enroll", method="POST", payload=payload)
        if status_code in (200, 201):
            logger.info("Enrollment successful")
            return True
        logger.warning(f"Enrollment returned status {status_code}: {data}")
        return False

    def send_heartbeat(self) -> bool:
        payload = {
            "status": "online",
            "capabilities": self.capabilities
        }
        status_code, data = self._http_request(f"/api/v1/devices/{self.device_id}/heartbeat", method="POST", payload=payload)
        return status_code == 200

    def poll_jobs(self) -> List[Dict[str, Any]]:
        status_code, jobs = self._http_request(f"/api/v1/agent/jobs/pending?device_id={self.device_id}", method="GET")
        if status_code == 200 and isinstance(jobs, list):
            return jobs
        return []

    def execute_job(self, job: Dict[str, Any]) -> Dict[str, Any]:
        job_id = job["job_id"]
        tool_name = job["tool_name"]
        arguments = job.get("arguments", {})

        logger.info(f"Executing job '{job_id}' using tool '{tool_name}'...")

        if tool_name not in self.capabilities:
            result_payload = {
                "status": "failed",
                "tool_output": {},
                "error_summary": f"Tool '{tool_name}' is not in authorized agent capabilities"
            }
        else:
            success, mcp_out = self.mcp_client.execute_tool(tool_name, arguments)
            if success:
                result_payload = {
                    "status": "completed",
                    "tool_output": mcp_out,
                    "error_summary": None
                }
            else:
                result_payload = {
                    "status": "failed",
                    "tool_output": {},
                    "error_summary": mcp_out.get("error", "Tool execution failed")
                }

        # Submit result back to backend
        status_code, report_response = self._http_request(
            f"/api/v1/agent/jobs/{job_id}/result",
            method="POST",
            payload=result_payload
        )
        logger.info(f"Job '{job_id}' report status {status_code}: {report_response}")
        return report_response

    def run_once(self) -> int:
        """Runs a single pass of heartbeat and pending job execution."""
        self.send_heartbeat()
        jobs = self.poll_jobs()
        executed_count = 0
        for job in jobs:
            self.execute_job(job)
            executed_count += 1
        return executed_count

    def run_loop(self):
        logger.info(f"Windows Agent active. Polling backend at {self.backend_url}...")
        self.enroll()
        last_heartbeat = 0
        while True:
            try:
                now = time.time()
                if now - last_heartbeat > config.HEARTBEAT_INTERVAL_SECONDS:
                    self.send_heartbeat()
                    last_heartbeat = now

                jobs = self.poll_jobs()
                for job in jobs:
                    self.execute_job(job)

                time.sleep(config.POLL_INTERVAL_SECONDS)
            except KeyboardInterrupt:
                logger.info("Shutting down Windows Agent cleanly.")
                break
            except Exception as e:
                logger.error(f"Error in agent loop: {e}")
                time.sleep(config.POLL_INTERVAL_SECONDS)

if __name__ == "__main__":
    agent = WindowsAgent()
    agent.run_loop()
