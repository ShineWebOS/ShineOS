export class DriverRegistry {
  constructor() {
    this.catalog = new Map();
    this.active = new Map();
  }

  register(kind, name, factory) {
    if (!this.catalog.has(kind)) {
      this.catalog.set(kind, new Map());
    }
    this.catalog.get(kind).set(name, factory);
  }

  available(kind) {
    return [...(this.catalog.get(kind)?.keys() ?? [])];
  }

  load(kind, name, options = {}) {
    const group = this.catalog.get(kind);
    if (!group || !group.has(name)) {
      throw new Error(`Driver not found: ${kind}/${name}`);
    }

    const driver = group.get(name)(options);
    this.active.set(kind, { name, driver });
    return driver;
  }

  get(kind) {
    return this.active.get(kind)?.driver ?? null;
  }

  activeName(kind) {
    return this.active.get(kind)?.name ?? null;
  }
}

export class ShineKernel {
  constructor({ runtimeCapabilities = null } = {}) {
    this.drivers = new DriverRegistry();
    this.processes = new Map();
    this.nextPid = 1;
    this.runtimeCapabilities = runtimeCapabilities;
  }

  spawn(name, entry) {
    const pid = this.nextPid++;
    this.processes.set(pid, { pid, name, state: 'running' });

    return Promise.resolve()
      .then(() => entry({ pid, kernel: this }))
      .finally(() => {
        const proc = this.processes.get(pid);
        if (proc) {
          proc.state = 'stopped';
        }
      });
  }

  ps() {
    return [...this.processes.values()];
  }
}
