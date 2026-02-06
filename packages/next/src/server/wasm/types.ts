export interface WasmServiceConfig {
  /**
   * Permissions for the WASM service.
   * By default, all permissions are denied (Zero Trust).
   */
  permissions?: {
    /** List of environment variables the service can access */
    env?: string[];
    /** List of allowed network hosts (e.g., "api.stripe.com") */
    network?: string[];
  };
  /**
   * Resource limits for the execution.
   */
  resources?: {
    memoryLimit?: number; // in bytes
    timeout?: number; // in milliseconds
  };
}

export interface WasmService {
  name: string;
  path: string;
  hash: string; // Content hash for change detection
  config: WasmServiceConfig;
  module: WebAssembly.Module | null; // Pre-compiled module
}

export interface WasmExecutionResult {
  output: string; // JSON string output from STDOUT
  exitCode: number;
}

export interface WasmRuntime {
  load(path: string): Promise<WasmService>;
  execute(serviceName: string, input: any): Promise<WasmExecutionResult>;
}
