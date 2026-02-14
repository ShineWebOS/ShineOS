import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(new URL('..', import.meta.url).pathname);
const kernelPath = resolve(repoRoot, 'build/kernel/shine-kernel.wasm');
const logPath = resolve(repoRoot, 'var/rootfs/var/log/shine-kernel.log');

const checks = [
  {
    name: 'kernel artifact exists',
    run: () => existsSync(kernelPath)
  },
  {
    name: 'boot log exists',
    run: () => existsSync(logPath)
  },
  {
    name: 'boot log contains completion marker',
    run: () => {
      if (!existsSync(logPath)) return false;
      return readFileSync(logPath, 'utf8').includes('shine-kernel: boot complete');
    }
  }
];

let ok = true;
for (const check of checks) {
  const result = check.run();
  ok = ok && result;
  console.log(`${result ? 'PASS' : 'FAIL'}: ${check.name}`);
}

if (!ok) {
  process.exit(1);
}

console.log('All kernel verification checks passed.');
