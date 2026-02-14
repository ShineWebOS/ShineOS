param(
  [int]$Port = 4173
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $repoRoot

Write-Host "Serving ShineOS browser UI at http://127.0.0.1:$Port/cmd.html"
python -m http.server $Port
