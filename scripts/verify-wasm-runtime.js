const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🧪 Testing NextWasmRuntime module structure...');

  // 1. Check if files exist
  const files = [
    'runtime.ts',
    'loader.ts',
    'router.ts',
    'wasi.ts',
    'integration.ts',
    'types.ts',
    'config.ts',
    'index.ts'
  ];
  
  const baseDir = path.join(__dirname, '../packages/next/src/server/wasm');
  const missing = [];
  
  for (const f of files) {
    const p = path.join(baseDir, f);
    if (!fs.existsSync(p)) {
        missing.push(f);
    } else {
        console.log(`✅ Found ${f}`);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing files:', missing);
    process.exit(1);
  } else {
    console.log('✅ All runtime files present.');
  }

  // 2. Check types.ts content for correct export
  const typesPath = path.join(baseDir, 'types.ts');
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  if (typesContent.includes('export interface WasmService')) {
     console.log('✅ types.ts contains WasmService definition');
  } else {
     console.error('❌ types.ts missing WasmService');
     process.exit(1);
  }

  // 3. Check integration.ts for exports
  const integrationPath = path.join(baseDir, 'integration.ts');
  const integrationContent = fs.readFileSync(integrationPath, 'utf8');
  if (integrationContent.includes('initializeWasmRuntime')) {
      console.log('✅ integration.ts exports initializeWasmRuntime');
  } else {
      console.error('❌ integration.ts missing initializeWasmRuntime');
      process.exit(1);
  }

  console.log('🎉 Verification Passed: Module structure is correct.');
}

main().catch(console.error);
