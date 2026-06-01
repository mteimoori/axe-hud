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

function shadow(): ShadowRoot {
  const root = document.getElementById(HUD_ROOT_ID)?.shadowRoot
  if (!root) throw new Error('HUD not mounted')
  return root
}

describe('Sidebar', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  async function openWith(violations: Result[]) {
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe(violations),
      runOn: { initial: false, navigation: false },
    })
    await hud.audit()
    hud.open()
    await flush()
    return hud
  }

  it('lists all findings when open', async () => {
    const hud = await openWith([
      violation('a', 'critical'),
      violation('b', 'serious'),
      violation('c', 'critical'),
    ])
    expect(shadow().querySelectorAll('.axe-hud-finding')).toHaveLength(3)
    hud.destroy()
  })

  it('filters findings by severity chip', async () => {
    const hud = await openWith([
      violation('a', 'critical'),
      violation('b', 'serious'),
      violation('c', 'critical'),
    ])
    const criticalChip = Array.from(shadow().querySelectorAll<HTMLElement>('.axe-hud-chip')).find(
      (chip) => chip.textContent?.startsWith('Critical'),
    )
    criticalChip?.click()
    await flush()
    expect(shadow().querySelectorAll('.axe-hud-finding')).toHaveLength(2)
    hud.destroy()
  })

  it('expands a finding to reveal selectors and a docs link', async () => {
    const hud = await openWith([violation('a', 'critical')])
    shadow().querySelector<HTMLElement>('.axe-hud-finding__summary')?.click()
    await flush()
    expect(shadow().querySelector('.axe-hud-finding__nodes code')?.textContent).toContain('#a')
    expect(shadow().querySelector<HTMLAnchorElement>('.axe-hud-finding__link')?.href).toContain(
      'example.com/a',
    )
    hud.destroy()
  })

  it('is not rendered until opened', async () => {
    const hud = createAxeHud({
      enabled: true,
      axe: fakeAxe([violation('a', 'critical')]),
      runOn: { initial: false, navigation: false },
    })
    await hud.audit()
    await flush()
    expect(shadow().querySelector('.axe-hud-sidebar')).toBeNull()
    hud.destroy()
  })
})
