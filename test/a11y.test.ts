import type { AxeResults, Result } from 'axe-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAxeHud } from '../src/create'
import { HUD_ROOT_ID } from '../src/runner'
import type { AxeLike } from '../src/types'

function violation(id: string, impact: string): Result {
  return {
    id,
    impact,
    help: `${id} help`,
    description: `${id} description`,
    helpUrl: `https://example.com/${id}`,
    tags: [],
    nodes: [{ target: [`#${id}`], html: '<div></div>', any: [], all: [], none: [] }],
  } as unknown as Result
}

function fakeAxe(violations: Result[]): AxeLike {
  return { run: vi.fn().mockResolvedValue({ violations } as unknown as AxeResults) }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
const escape = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

function shadow(): ShadowRoot {
  const root = document.getElementById(HUD_ROOT_ID)?.shadowRoot
  if (!root) throw new Error('HUD not mounted')
  return root
}

describe('HUD accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('moves focus into the sidebar when it opens', async () => {
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe([]),
      runOn: { initial: false, navigation: false },
    })
    hud.open()
    await flush()
    expect(
      (shadow().activeElement as HTMLElement | null)?.classList.contains('axe-hud-sidebar'),
    ).toBe(true)
    hud.destroy()
  })

  it('closes the sidebar on Escape', async () => {
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe([]),
      runOn: { initial: false, navigation: false },
    })
    hud.open()
    await flush()
    expect(shadow().querySelector('.axe-hud-sidebar')).not.toBeNull()
    escape()
    await flush()
    expect(shadow().querySelector('.axe-hud-sidebar')).toBeNull()
    hud.destroy()
  })

  it('dismisses the modal on Escape', async () => {
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe([violation('a', 'critical')]),
      runOn: { initial: false, navigation: false },
    })
    await hud.audit()
    await flush()
    expect(shadow().querySelector('.axe-hud-modal')).not.toBeNull()
    escape()
    await flush()
    expect(shadow().querySelector('.axe-hud-modal')).toBeNull()
    hud.destroy()
  })
})
