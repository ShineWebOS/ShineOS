#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KERNEL_SRC="$REPO_ROOT/src/kernel"
BUILD_DIR="$REPO_ROOT/build/kernel"

mkdir -p "$BUILD_DIR"

(
  cd "$KERNEL_SRC"
  GOOS=wasip1 GOARCH=wasm go build -trimpath -o "$BUILD_DIR/shine-kernel.wasm" .
)

printf 'Built: %s\n' "$BUILD_DIR/shine-kernel.wasm"
