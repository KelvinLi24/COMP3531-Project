$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$url = 'http://localhost:5173'

if (-not (Test-Path (Join-Path $projectRoot 'node_modules'))) {
  Write-Host 'node_modules not found. Installing dependencies...'
  & npm.cmd install
}

Write-Host 'Starting Vite dev server in a new window...'
Start-Process powershell -ArgumentList '-NoExit', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'Set-Location ''{0}''; npm.cmd run dev' -f $projectRoot

Write-Host 'Waiting for server startup...'
Start-Sleep -Seconds 3

Write-Host "Opening browser: $url"
Start-Process $url

Write-Host 'All services started.'
