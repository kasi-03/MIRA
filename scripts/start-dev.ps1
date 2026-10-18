Write-Host "Starting MIRA Backend Orchestrator..." -ForegroundColor Cyan

$env:PYTHONPATH = "."
$env:BACKEND_PORT = "5000"

python -m backend.wsgi
