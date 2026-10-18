Write-Host "Stopping MIRA processes..." -ForegroundColor Cyan

Get-Process -Name python, node -ErrorAction SilentlyContinue | Where-Object { 
    $_.MainWindowTitle -like "*MIRA*" -or $_.CommandLine -like "*backend.wsgi*" -or $_.CommandLine -like "*windows-agent*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "MIRA processes stopped." -ForegroundColor Green
