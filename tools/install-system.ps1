param(
  [string]$TargetRoot = "$HOME/.shineos/system"
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$sourceKernel = Join-Path $repoRoot 'build/kernel/shine-kernel.wasm'

if (-not (Test-Path $sourceKernel)) {
  Write-Error 'Kernel artifact missing. Run tools/build-kernel.ps1 first.'
}

$targetKernelDir = Join-Path $TargetRoot 'kernel'
New-Item -ItemType Directory -Force -Path $targetKernelDir | Out-Null
Copy-Item -Force $sourceKernel (Join-Path $targetKernelDir 'shine-kernel.wasm')

Write-Host "Installed kernel to: $(Join-Path $targetKernelDir 'shine-kernel.wasm')"
