Write-Host "Validating MIRA JSON Schemas (Draft 2020-12)..." -ForegroundColor Cyan

python -c @"
import json
import glob
from jsonschema import Draft202012Validator

schemas = glob.glob('schemas/*.schema.json')
all_valid = True

for path in schemas:
    with open(path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            Draft202012Validator.check_schema(data)
            print(f'  [PASS] {path}')
        except Exception as e:
            print(f'  [FAIL] {path}: {e}')
            all_valid = False

if not all_valid:
    exit(1)
print('All schemas valid.')
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "All JSON schemas validated successfully!" -ForegroundColor Green
} else {
    Write-Host "Schema validation failed." -ForegroundColor Red
    exit 1
}
