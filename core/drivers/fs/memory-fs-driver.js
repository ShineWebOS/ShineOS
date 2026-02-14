export class MemoryFSDriver {
  constructor() {
    this.files = new Map();
  }

  async writeFile(path, content) {
    this.files.set(path, String(content));
    return true;
  }

  async readFile(path) {
    if (!this.files.has(path)) {
      throw new Error(`No such file: ${path}`);
    }
    return this.files.get(path);
  }

  async readdir(prefix = '/') {
    return [...this.files.keys()].filter((file) => file.startsWith(prefix));
  }
}
