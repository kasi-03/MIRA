Write-Host "Starting MIRA Windows Workstation Agent & Node.js MCP Runtime..." -ForegroundColor Cyan

$env:PYTHONPATH = ".;windows-agent"
$env:MIRA_BACKEND_URL = "http://127.0.0.1:5000"

python windows-agent\agent.py
