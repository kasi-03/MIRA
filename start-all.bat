@echo off
echo ========================================================
echo Starting MIRA System (Backend + MCP Server + Frontend)...
echo ========================================================

start "MIRA 1. Backend Orchestrator (Port 5000)" powershell -NoExit -Command "cd '%~dp0'; python backend/wsgi.py"
start "MIRA 2. Windows MCP Server (Port 8000)" powershell -NoExit -Command "cd '%~dp0'; python windows-mcp-server/run_server.py"
start "MIRA 3. React Frontend UI (Port 3000)" powershell -NoExit -Command "cd '%~dp0frontend'; npm run dev"

echo.
echo All 3 services launched in separate windows!
echo Open your browser to: http://localhost:3000
echo ========================================================
