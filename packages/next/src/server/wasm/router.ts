import { globalWasmRuntime } from './runtime';

export async function handleWasmRequest(
  serviceName: string,
  reqBody: any
): Promise<Response> {
  try {
    const result = await globalWasmRuntime.execute(serviceName, reqBody);

    if (result.exitCode !== 0) {
      return new Response(
        JSON.stringify({ error: 'Service exited with error', code: result.exitCode }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Try to parse output as JSON, otherwise return text
    try {
      JSON.parse(result.output); // Just to check validity
      return new Response(result.output, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(result.output, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'Runtime Error', details: e.message }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
