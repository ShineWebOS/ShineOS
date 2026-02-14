![ShineOS](https://github.com/user-attachments/assets/469927d2-4245-4eb1-a9be-c74be9f9326c)

# ShineOS

UNIX-like OS direction with strict rule:
**environment specifics are handled by drivers/runtimes, not by programs/kernel logic.**

## WASI vs WASIX (important)

- **WASI**: base system interface for WebAssembly modules.
- **WASIX**: extension of WASI (extra syscalls/features, used by Wasmer runtime ecosystem).

Your requirement is WASIX. In this repository:
- kernel artifact is compiled to WebAssembly (`GOOS=wasip1 GOARCH=wasm`),
- canonical runtime path is **Wasmer/WASIX** via `tools/run-kernel-wasix.sh`,
- Node WASI runner is kept only as fallback/dev bootstrap.

## What is implemented right now

This repo contains a **real compiled kernel module**:
- source: `src/kernel` (Go)
- target: `GOOS=wasip1 GOARCH=wasm`
- artifact: `build/kernel/shine-kernel.wasm`
- runtime entrypoints:
  - WASIX (primary): `tools/run-kernel-wasix.sh`
  - WASI fallback: `node runtime/node/run-kernel.mjs`

This follows your constraint: **working kernel first**, then additional subsystems.

## Project structure

- `src/` — source code
- `tools/` — build/install/run scripts
- `runtime/node/` — Node fallback runtime adapter
- `build/` — compiled artifacts (gitignored)
- installed system path outside repo (default): `~/.shineos/system`

See architecture notes in `docs/ARCHITECTURE.md`.

## Build kernel (real compilation)

```bash
tools/build-kernel.sh
```

## Run kernel on WASIX (Wasmer, primary)

```bash
tools/run-kernel-wasix.sh
```

## Run kernel on WASI (fallback/dev)

```bash
node runtime/node/run-kernel.mjs
```

Both runtimes mount `var/rootfs` and kernel writes `/var/log/shine-kernel.log`.


## Native Windows 11 (no WSL)

Requirements:
- Go (in PATH)
- Wasmer CLI (in PATH) for WASIX
- Node.js (optional fallback path)
- PowerShell 7+ or Windows PowerShell

Build kernel:
```powershell
./tools/build-kernel.ps1
```

Run kernel on WASIX (primary):
```powershell
./tools/run-kernel-wasix.ps1
```

> On native Windows, prefer `.ps1` launcher. `tools/run-kernel-wasix.sh` is for POSIX shells and may silently fail depending on your shell setup.

Install system outside repository:
```powershell
./tools/install-system.ps1
# custom path example
./tools/install-system.ps1 -TargetRoot "D:/shineos/system"
```

Optional fallback runtime (WASI via Node):
```powershell
node runtime/node/run-kernel.mjs
```

## Raspberry Pi 5 (Debian)

Requirements:
- `golang` package or official Go
- Wasmer CLI for WASIX runtime
- Node.js optional fallback runtime

Build:
```bash
tools/build-kernel.sh
```

Run primary WASIX runtime:
```bash
tools/run-kernel-wasix.sh
```

Install outside repository:
```bash
tools/install-system.sh
```



### Windows Wasmer volume-path fix
If you saw an error like:
- `--dir is deprecated`
- `could not canonicalize path ... os error 123`

Use the updated PowerShell launcher:
```powershell
./tools/run-kernel-wasix.ps1
```
It uses `--volume` and maps `var/rootfs` as a relative path to avoid `C:` drive-letter parsing issues in Wasmer CLI.

## How to verify everything works

### Linux / Raspberry Pi / macOS
```bash
tools/build-kernel.sh
node runtime/node/run-kernel.mjs
node tools/verify-kernel.mjs
```

### Windows (no WSL)
```powershell
./tools/build-kernel.ps1
node runtime/node/run-kernel.mjs
node tools/verify-kernel.mjs
```

Expected verification output:
- `PASS: kernel artifact exists`
- `PASS: boot log exists`
- `PASS: boot log contains completion marker`

## How to run in Chromium browser

> Browser UI currently runs the ShineOS terminal/driver prototype (`cmd.html`).
> Kernel WASIX runtime is launched separately through Wasmer scripts.

### Linux / Raspberry Pi / macOS
```bash
tools/run-browser-dev.sh
```

### Windows (no WSL)
```powershell
./tools/run-browser-dev.ps1
```

Then open Chromium:
- `http://127.0.0.1:4173/cmd.html`

Quick browser smoke test:
1. Type `help`
2. Type `drv-ls`
3. Type `write /hello.txt ShineOS`
4. Type `cat /hello.txt`

If you see command output and `cat` prints `ShineOS`, browser shell layer works.

## Install system image outside repository

```bash
tools/install-system.sh
# or custom location:
tools/install-system.sh /opt/shineos/system
```
