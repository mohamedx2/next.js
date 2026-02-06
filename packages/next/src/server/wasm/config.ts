import type { WasmServiceConfig } from './types';

export const DEFAULT_WASM_CONFIG: WasmServiceConfig = {
  permissions: {
    env: [],
    network: [],
  },
  resources: {
    memoryLimit: 128 * 1024 * 1024, // 128MB
    timeout: 5000, // 5s
  },
};

export function mergeConfig(
  userConfig: Partial<WasmServiceConfig> = {}
): WasmServiceConfig {
  return {
    permissions: {
      env: userConfig.permissions?.env || DEFAULT_WASM_CONFIG.permissions!.env,
      network:
        userConfig.permissions?.network ||
        DEFAULT_WASM_CONFIG.permissions!.network,
    },
    resources: {
      memoryLimit:
        userConfig.resources?.memoryLimit ||
        DEFAULT_WASM_CONFIG.resources!.memoryLimit,
      timeout:
        userConfig.resources?.timeout || DEFAULT_WASM_CONFIG.resources!.timeout,
    },
  };
}
