Write-Host "Running MIRA Automated Test Suite..." -ForegroundColor Cyan
python -m pytest -p no:anyio tests -v
if ($LASTEXITCODE -eq 0) {
    Write-Host "All tests passed successfully!" -ForegroundColor Green
} else {
    Write-Host "Tests failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
