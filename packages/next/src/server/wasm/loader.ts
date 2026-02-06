import { promises as fs } from 'fs';
import * as path from 'path';
import { globalWasmRuntime } from './runtime';

export class WasmLoader {
  private servicesDir: string;

  constructor(servicesDir: string) {
    this.servicesDir = servicesDir;
  }

  async discoverAndLoad(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.servicesDir);
      const loadedServices: string[] = [];

      for (const file of files) {
        if (file.endsWith('.wasm')) {
          const absPath = path.join(this.servicesDir, file);
          await globalWasmRuntime.load(absPath);
          loadedServices.push(file);
        }
      }

      return loadedServices;
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        // Directory doesn't exist, which is fine
        return [];
      }
      throw e;
    }
  }
}
