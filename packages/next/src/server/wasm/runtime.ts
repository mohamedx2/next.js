import { promises as fs } from 'fs';
import { NextWasi } from './wasi';
import type { WasmRuntime, WasmService, WasmExecutionResult } from './types';
import { mergeConfig } from './config';

export class NextWasmRuntimeEngine implements WasmRuntime {
  private services: Map<string, WasmService> = new Map();


  async load(absPath: string): Promise<WasmService> {
    const buffer = await fs.readFile(absPath);
    
    // Verify Magic Bytes (Asm... - \0asm)
    if (buffer.readUInt32BE(0) !== 0x0061736d) {
      throw new Error(`Invalid WASM file: ${absPath}`);
    }

    const module = await WebAssembly.compile(new Uint8Array(buffer));
    const name = this.getServiceNameFromPath(absPath);

    const service: WasmService = {
      name,
      path: absPath,
      hash: 'TODO-hash', // Would implement proper hashing
      config: mergeConfig(), // TODO: Load .meta.json if exists
      module,
    };

    this.services.set(name, service);
    return service;
  }

  async execute(serviceName: string, input: any): Promise<WasmExecutionResult> {
    const service = this.services.get(serviceName);
    if (!service || !service.module) {
      throw new Error(`Service not found: ${serviceName}`);
    }

    const inputString = JSON.stringify(input);
    const wasi = new NextWasi(service.config, inputString);
    
    // Instantiate with fresh memory per request
    const instance = await WebAssembly.instantiate(service.module, {
      wasi_snapshot_preview1: wasi.getImportObject(),
    });

    const exitCode = wasi.start(instance);
    const output = wasi.getStdout();

    return {
      output: output || '{}', // Default to empty JSON
      exitCode: Number(exitCode),
    };
  }

  private getServiceNameFromPath(p: string): string {
    const parts = p.split(/[\\/]/);
    const filename = parts[parts.length - 1];
    return filename.replace('.wasm', '');
  }
}

export const globalWasmRuntime = new NextWasmRuntimeEngine();
