#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_KERNEL="$REPO_ROOT/build/kernel/shine-kernel.wasm"
TARGET_ROOT="${1:-$HOME/.shineos/system}"

if [[ ! -f "$SOURCE_KERNEL" ]]; then
  echo "Kernel artifact missing. Run tools/build-kernel.sh first." >&2
  exit 1
fi

mkdir -p "$TARGET_ROOT/kernel"
cp "$SOURCE_KERNEL" "$TARGET_ROOT/kernel/shine-kernel.wasm"

echo "Installed kernel to: $TARGET_ROOT/kernel/shine-kernel.wasm"
