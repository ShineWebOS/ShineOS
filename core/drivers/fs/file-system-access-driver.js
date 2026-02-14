export class FileSystemAccessDriver {
  constructor() {
    this.root = null;
  }

  async ensureRoot() {
    if (this.root) return this.root;
    if (!window.showDirectoryPicker) {
      throw new Error('File System Access API is unavailable in this runtime');
    }

    this.root = await window.showDirectoryPicker({ mode: 'readwrite' });
    return this.root;
  }

  async writeFile(path, content) {
    const root = await this.ensureRoot();
    const safe = path.replace(/^\/+/, '');
    const handle = await root.getFileHandle(safe, { create: true });
    const writable = await handle.createWritable();
    await writable.write(String(content));
    await writable.close();
    return true;
  }

  async readFile(path) {
    const root = await this.ensureRoot();
    const safe = path.replace(/^\/+/, '');
    const handle = await root.getFileHandle(safe, { create: false });
    const file = await handle.getFile();
    return file.text();
  }

  async readdir() {
    const root = await this.ensureRoot();
    const names = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const [name] of root.entries()) {
      names.push(`/${name}`);
    }
    return names;
  }
}
