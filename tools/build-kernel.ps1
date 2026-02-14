$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$kernelSrc = Join-Path $repoRoot 'src/kernel'
$buildDir = Join-Path $repoRoot 'build/kernel'

New-Item -ItemType Directory -Force -Path $buildDir | Out-Null

Push-Location $kernelSrc
try {
  $env:GOOS = 'wasip1'
  $env:GOARCH = 'wasm'
  go build -trimpath -o (Join-Path $buildDir 'shine-kernel.wasm') .
}
finally {
  Remove-Item Env:GOOS -ErrorAction SilentlyContinue
  Remove-Item Env:GOARCH -ErrorAction SilentlyContinue
  Pop-Location
}

Write-Host "Built: $(Join-Path $buildDir 'shine-kernel.wasm')"
