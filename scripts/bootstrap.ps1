$ErrorActionPreference = "Stop"

Write-Host "Installing frontend dependencies..."
npm --prefix frontend install

Write-Host "Preparing backend virtual environment..."
if (!(Test-Path backend/.venv)) {
  python -m venv backend/.venv
}

& backend/.venv/Scripts/python.exe -m pip install --upgrade pip
& backend/.venv/Scripts/python.exe -m pip install -r backend/requirements-dev.txt

Write-Host "Running baseline checks..."
npm --prefix frontend run lint
npm --prefix frontend run build
& backend/.venv/Scripts/python.exe -m pytest backend

Write-Host "DeckHub bootstrap complete."
Write-Host "Use scripts/setup-github-oidc-role.ps1 and scripts/create-cloudfront-signing-key.ps1 before enabling main-branch deploys."
