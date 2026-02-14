function parse(input) {
  return input.trim().split(/\s+/);
}

export class ShineShell {
  constructor({ kernel }) {
    this.kernel = kernel;
    this.cwd = '/';
  }

  async execute(rawInput) {
    const tty = this.kernel.drivers.get('tty');
    const fs = this.kernel.drivers.get('fs');

    const [command, ...args] = parse(rawInput);
    if (!command) return;

    const commands = {
      help: async () => [
        'Commands:',
        '  help, clear, echo, uname, ps',
        '  ls, cat <file>, write <file> <text>',
        '  drv-ls, drv-use <kind> <name>',
        '  runtime, busybox, apt'
      ].join('\n'),
      clear: async () => {
        tty.clear();
        return '';
      },
      echo: async () => args.join(' '),
      uname: async () => 'ShineOS unix-like (driver-kernel prototype)',
      runtime: async () => {
        const rt = this.kernel.runtimeCapabilities;
        if (!rt) return 'runtime probe unavailable';
        return [
          `environment: ${rt.environment}`,
          `wasmer detected: ${rt.wasmerDetected ? 'yes' : 'no'}`,
          `wasi detected: ${rt.wasiDetected ? 'yes' : 'no'}`,
          `wasix ready: ${rt.wasixReady ? 'yes' : 'no'}`
        ].join('\n');
      },
      ps: async () => {
        const rows = this.kernel.ps().map((p) => `${p.pid}\t${p.state}\t${p.name}`);
        return ['PID\tSTATE\tNAME', ...rows].join('\n');
      },
      ls: async () => {
        const files = await fs.readdir('/');
        return files.length ? files.join('\n') : '(empty)';
      },
      write: async () => {
        if (args.length < 2) {
          return 'usage: write <file> <text>';
        }

        const [path, ...content] = args;
        await fs.writeFile(path, content.join(' '));
        return `written: ${path}`;
      },
      cat: async () => {
        if (!args[0]) {
          return 'usage: cat <file>';
        }
        return fs.readFile(args[0]);
      },
      'drv-ls': async () => {
        const ttyDrivers = this.kernel.drivers.available('tty').join(', ') || 'none';
        const fsDrivers = this.kernel.drivers.available('fs').join(', ') || 'none';
        return [
          `tty drivers: ${ttyDrivers}`,
          `fs drivers: ${fsDrivers}`,
          `active tty: ${this.kernel.drivers.activeName('tty')}`,
          `active fs: ${this.kernel.drivers.activeName('fs')}`
        ].join('\n');
      },
      'drv-use': async () => {
        const [kind, name] = args;
        if (!kind || !name) return 'usage: drv-use <kind> <name>';

        if (kind === 'tty') {
          return 'TTY hot-swap is locked from shell to preserve current session';
        }

        this.kernel.drivers.load(kind, name);
        return `active ${kind} driver: ${name}`;
      },
      busybox: async () => 'BusyBox-like userland planned: sh, coreutils, init applets.',
      apt: async () => 'apt-like package manager planned: local index + signed WASM packages.'
    };

    if (!commands[command]) {
      return `Command not found: ${command}`;
    }

    return commands[command]();
  }
}
