import type { AxeResults } from 'axe-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAxeHud } from '../src/create'
import { HUD_ROOT_ID } from '../src/runner'
import type { AxeLike } from '../src/types'

function fakeAxe(impacts: string[]): AxeLike {
  const results = { violations: impacts.map((impact) => ({ impact })) } as unknown as AxeResults
  return { run: vi.fn().mockResolvedValue(results) }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('createAxeHud', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('mounts nothing and returns an inert controller when disabled', () => {
    const hud = createAxeHud({ enabled: false })
    expect(document.getElementById(HUD_ROOT_ID)).toBeNull()
    expect(() => hud.destroy()).not.toThrow()
  })

  it('mounts an isolated shadow root when enabled', () => {
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe([]),
      runOn: { initial: false, navigation: false },
    })
    const host = document.getElementById(HUD_ROOT_ID)
    expect(host).not.toBeNull()
    expect(host?.shadowRoot).toBeTruthy()
    hud.destroy()
    expect(document.getElementById(HUD_ROOT_ID)).toBeNull()
  })

  it('reflects audit results in the widget', async () => {
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe(['critical', 'serious']),
      runOn: { initial: false, navigation: false },
    })
    await hud.audit()
    await flush()

    const shadow = document.getElementById(HUD_ROOT_ID)?.shadowRoot
    expect(shadow?.querySelector('.axe-hud-fab__count')?.textContent).toBe('2')
    hud.destroy()
  })

  it('invokes onAudit for completed audits', async () => {
    const onAudit = vi.fn()
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe([]),
      runOn: { initial: false, navigation: false },
      onAudit,
    })
    await hud.audit()
    expect(onAudit).toHaveBeenCalledTimes(1)
    expect(onAudit).toHaveBeenCalledWith(expect.objectContaining({ status: 'done' }))
    hud.destroy()
  })
})
