import { WasmLoader } from './loader';
import { handleWasmRequest } from './router';
import type { NextConfig } from '../config-shared'; // Corrected path

// Singleton instance management for the server lifecycle
let wasmLoader: WasmLoader | null = null;

export async function initializeWasmRuntime(servicesDir: string) {
  if (!wasmLoader) {
    console.log(`[NextWasm] Initializing runtime in ${servicesDir}`);
    wasmLoader = new WasmLoader(servicesDir);
    const services = await wasmLoader.discoverAndLoad();
    console.log(`[NextWasm] Loaded ${services.length} services: ${services.join(', ')}`);
  }
}

export async function wasmRequestHandler(
  req: Request, 
  params: { service: string }
): Promise<Response> {
  // Parse body if needed, currently passing raw stream or text would be ideal
  // For prototype, we assume JSON body
  try {
    const body = await req.json();
    return handleWasmRequest(params.service, body);
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }
}

// Hook to check if feature is enabled
export function isWasmEnabled(nextConfig: NextConfig): boolean {
  // @ts-ignore
  return !!nextConfig.experimental?.wasmBackend;
}
