#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-4173}"

cd "$REPO_ROOT"
echo "Serving ShineOS browser UI at http://127.0.0.1:${PORT}/cmd.html"
python3 -m http.server "$PORT"
