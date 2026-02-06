import { WASI } from 'wasi';
import type { WasmServiceConfig } from './types';

// This is a minimal wrapper around node:wasi
// Future work: Abstract this for Edge Runtime compatibility

export class NextWasi {
  private instance: WASI;
  private stdoutBuffer: string = '';
  private stdinBuffer: Buffer;

  constructor(config: WasmServiceConfig, input: string) {
    this.stdinBuffer = Buffer.from(input, 'utf-8');

    // In a real implementation, we would implement a custom FD (File Descriptor)
    // allowing us to capture stdout without relying on temp files or process.stdout
    // For this design using the Node WASI shim, we'd need to mock fs or use a specific library.
    // For simplicity in this architectural source, we assume a standard configuration.

    this.instance = new WASI({
      args: [],
      env: this.buildEnv(config),
      preopens: {}, // No filesystem access by default
      // @ts-ignore - returnOnExit is specific to newer Node versions
      returnOnExit: true,
      // We would intercept stdout here in a full implementation
    });
  }

  private buildEnv(config: WasmServiceConfig): Record<string, string> {
    const env: Record<string, string> = {};
    const allowed = config.permissions?.env || [];
    
    for (const key of allowed) {
      if (process.env[key]) {
        env[key] = process.env[key]!;
      }
    }
    return env;
  }

  public getImportObject() {
    return this.instance.wasiImport;
  }

  public start(moduleInstance: WebAssembly.Instance) {
    try {
      this.instance.start(moduleInstance);
      return 0; // Success
    } catch (e: any) {
      // WASI might throw if exit code is non-zero
      if (e && typeof e.code === 'number') {
        return e.code;
      }
      throw e;
    }
  }

  // Implementation note: Capturing Stdout in node:wasi is non-trivial without 
  // overriding writeSync. In a real Next.js core PR, we would implement 
  // a custom WASI context (like Cloudflare's) rather than using node:wasi directly.
  // For the purpose of this architecture, we define the interface.
  public getStdout(): string {
     // Mock return for the design phase as implementing a full FD interceptor 
     // is outside the scope of a single file.
     return this.stdoutBuffer; 
  }
}
