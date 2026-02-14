$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$kernelPath = if ($env:SHINE_KERNEL_PATH) { $env:SHINE_KERNEL_PATH } else { Join-Path $repoRoot 'build/kernel/shine-kernel.wasm' }
$rootfsAbs = if ($env:SHINE_ROOTFS) { $env:SHINE_ROOTFS } else { Join-Path $repoRoot 'var/rootfs' }

if (-not (Test-Path $kernelPath)) {
  Write-Error "Kernel artifact missing at $kernelPath. Run tools/build-kernel.ps1 first."
}

if (-not (Get-Command wasmer -ErrorAction SilentlyContinue)) {
  Write-Error 'wasmer CLI is required for WASIX runtime, but wasmer is not installed.'
}

New-Item -ItemType Directory -Force -Path (Join-Path $rootfsAbs 'var/log') | Out-Null

# IMPORTANT: On Windows, absolute path volume mapping can break because of drive letter colon (C:).
# We run from repo root and pass a relative path to avoid parser ambiguity.
Push-Location $repoRoot
try {
  $rootfsRel = 'var/rootfs'
  $env:SHINE_PROFILE = if ($env:SHINE_PROFILE) { $env:SHINE_PROFILE } else { 'wasix-dev' }
  $env:SHINE_ABI = 'wasix'

  wasmer run --volume "$rootfsRel`:/" "$kernelPath"
}
finally {
  Pop-Location
}
