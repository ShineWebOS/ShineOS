import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { WASI } from 'node:wasi';

const repoRoot = resolve(new URL('../..', import.meta.url).pathname);
const kernelPath = process.env.SHINE_KERNEL_PATH || resolve(repoRoot, 'build/kernel/shine-kernel.wasm');
const rootfs = process.env.SHINE_ROOTFS || resolve(repoRoot, 'var/rootfs');

mkdirSync(resolve(rootfs, 'var/log'), { recursive: true });

const wasi = new WASI({
  version: 'preview1',
  args: ['shine-kernel'],
  env: {
    SHINE_PROFILE: process.env.SHINE_PROFILE || 'node-dev',
    SHINE_ABI: process.env.SHINE_ABI || 'wasi'
  },
  preopens: {
    '/': rootfs
  }
});

const wasm = await WebAssembly.compile(readFileSync(kernelPath));
const instance = await WebAssembly.instantiate(wasm, {
  wasi_snapshot_preview1: wasi.wasiImport
});

wasi.start(instance);
