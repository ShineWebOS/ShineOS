# ShineOS architecture (phase-first)

## Rule
Programs and system logic must not depend on host environment directly.
Only drivers/runtimes adapt host specifics.

## ABI policy
- Target runtime policy: **WASIX first**.
- WASI runner is allowed only as bootstrap fallback when Wasmer is unavailable.
- Kernel/userland contract remains runtime-agnostic; host-specific behavior belongs to drivers/adapters.

## Layout

## Platform runners
- Linux/macOS style scripts: `tools/*.sh`
- Native Windows PowerShell scripts (no WSL):
  - `tools/build-kernel.ps1`
  - `tools/run-kernel-wasix.ps1`
  - `tools/install-system.ps1`
- Raspberry Pi Debian uses the same `.sh` path as standard Linux.

- `src/` — source code only
- `build/` — compiled artifacts (ignored)
- `install target` (`~/.shineos/system` by default) — installed system image outside repo

## Boot stages
1. **Stage 1 (done): working kernel module**
   - Go kernel compiled to `wasip1/wasm`
   - executable with runtime adapters
2. **Stage 2 (in progress): runtime adapters**
   - Wasmer/WASIX primary runner (`tools/run-kernel-wasix.sh`)
   - Node/WASI fallback runner (`runtime/node/run-kernel.mjs`)
3. **Stage 3:** userspace
   - shell, core utils, package manager

## Driver boundary
Kernel/user programs target stable ABI and virtual devices.
Host specifics (`xterm.js`, Node TTY, File System Access API, OS file system) are runtime-driver concerns.


## Browser dev launchers
- Linux/RPi/macOS: `tools/run-browser-dev.sh`
- Windows: `tools/run-browser-dev.ps1`
- UI URL: `http://127.0.0.1:4173/cmd.html`
