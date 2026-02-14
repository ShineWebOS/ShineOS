#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KERNEL_PATH="${SHINE_KERNEL_PATH:-$REPO_ROOT/build/kernel/shine-kernel.wasm}"
ROOTFS="${SHINE_ROOTFS:-$REPO_ROOT/var/rootfs}"

if [[ ! -f "$KERNEL_PATH" ]]; then
  echo "Kernel artifact missing at $KERNEL_PATH. Run tools/build-kernel.sh first." >&2
  exit 1
fi

if ! command -v wasmer >/dev/null 2>&1; then
  echo "wasmer CLI is required for WASIX runtime, but wasmer is not installed." >&2
  echo "Install Wasmer and rerun this command." >&2
  exit 2
fi

mkdir -p "$ROOTFS/var/log"

# Wasmer provides WASIX ABI support. This is the canonical ShineOS runtime path.
# Use --volume instead of deprecated --dir.
SHINE_PROFILE="${SHINE_PROFILE:-wasix-dev}" \
SHINE_ABI="wasix" \
wasmer run \
  --volume "$ROOTFS":/ \
  "$KERNEL_PATH"
