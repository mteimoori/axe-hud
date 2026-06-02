import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAxeHud } from '../src/create'
import { detectEnvironment, resolveEnabled } from '../src/env'

// Simulate a server environment by removing the DOM globals the HUD touches.
describe('server-side rendering safety', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detectEnvironment returns "unknown" without a window', () => {
    vi.stubGlobal('window', undefined)
    expect(detectEnvironment()).toBe('unknown')
  })

  it('does not enable for an unknown (server) environment by default', () => {
    vi.stubGlobal('window', undefined)
    expect(resolveEnabled().enabled).toBe(false)
  })

  it('createAxeHud is an inert no-op without a DOM, even when forced enabled', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)

    const hud = createAxeHud({ enabled: true })
    expect(() => {
      hud.open()
      hud.close()
      hud.destroy()
    }).not.toThrow()
    await expect(hud.audit()).resolves.toBeUndefined()
  })
})
