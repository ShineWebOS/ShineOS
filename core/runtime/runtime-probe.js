export function detectRuntimeCapabilities() {
  const hasWindow = typeof window !== 'undefined';
  const hasNode = typeof process !== 'undefined' && !!process.versions?.node;

  // ShineOS target stack (planned): Wasmer + WASIX
  // At this stage we only detect presence hints to avoid false claims.
  const hasWasmer = typeof globalThis.Wasmer !== 'undefined';
  const hasWasi = typeof globalThis.WASI !== 'undefined' || typeof globalThis.Wasi !== 'undefined';

  return {
    environment: hasWindow ? 'browser' : hasNode ? 'node' : 'unknown',
    wasmerDetected: hasWasmer,
    wasiDetected: hasWasi,
    wasixReady: hasWasmer && hasWasi
  };
}

export function runtimeSummary(capabilities) {
  const tags = [
    `env=${capabilities.environment}`,
    `wasmer=${capabilities.wasmerDetected ? 'yes' : 'no'}`,
    `wasi=${capabilities.wasiDetected ? 'yes' : 'no'}`,
    `wasix-ready=${capabilities.wasixReady ? 'yes' : 'no'}`
  ];

  return tags.join(' | ');
}
