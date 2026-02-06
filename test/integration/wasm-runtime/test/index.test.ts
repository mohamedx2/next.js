import { nextBuild, nextStart, findPort, killApp, renderViaHTTP } from 'next-test-utils'
import { join } from 'path'

const appDir = join(__dirname, '../')
let appPort: number
let app: any

describe('NextWasmRuntime Integration', () => {
  beforeAll(async () => {
    await nextBuild(appDir)
    appPort = await findPort()
    app = await nextStart(appDir, appPort)
  })

  afterAll(() => killApp(app))

  it('should route requests to wasm services', async () => {
    const res = await renderViaHTTP(appPort, '/api/wasm/test-service')
    expect(res).toContain('authenticated') // Based on our RFC example
  })
})
