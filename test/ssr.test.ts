import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAxeHud } from '../src/create'

// Simulate a server environment by removing the DOM globals the HUD touches.
describe('server-side rendering safety', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('createAxeHud is an inert no-op without a DOM', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)

    const hud = createAxeHud()
    expect(() => {
      hud.open()
      hud.close()
      hud.destroy()
    }).not.toThrow()
    await expect(hud.audit()).resolves.toBeUndefined()
  })
})
