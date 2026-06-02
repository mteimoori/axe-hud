import type { AxeResults } from 'axe-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAxeHud } from '../src/create'
import { HUD_ROOT_ID } from '../src/runner'
import type { AxeLike } from '../src/types'

function fakeAxe(): AxeLike {
  return { run: vi.fn().mockResolvedValue({ violations: [] } as unknown as AxeResults) }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
const escape = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

function shadow(): ShadowRoot {
  const root = document.getElementById(HUD_ROOT_ID)?.shadowRoot
  if (!root) throw new Error('HUD not mounted')
  return root
}

function open() {
  const hud = createAxeHud({
    axe: fakeAxe(),
    runOn: { initial: false, navigation: false },
  })
  hud.open()
  return hud
}

describe('HUD accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('moves focus into the sidebar when it opens', async () => {
    const hud = open()
    await flush()
    expect(
      (shadow().activeElement as HTMLElement | null)?.classList.contains('axe-hud-sidebar'),
    ).toBe(true)
    hud.destroy()
  })

  it('closes the sidebar on Escape', async () => {
    const hud = open()
    await flush()
    expect(shadow().querySelector('.axe-hud-sidebar')).not.toBeNull()
    escape()
    await flush()
    expect(shadow().querySelector('.axe-hud-sidebar')).toBeNull()
    hud.destroy()
  })
})
