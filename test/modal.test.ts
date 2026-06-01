import type { AxeResults, Result } from 'axe-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAxeHud } from '../src/create'
import { HUD_ROOT_ID } from '../src/runner'
import type { AxeHudOptions, AxeLike } from '../src/types'

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

function modal(): Element | null {
  return document.getElementById(HUD_ROOT_ID)?.shadowRoot?.querySelector('.axe-hud-modal') ?? null
}

function setup(violations: Result[], options: Partial<AxeHudOptions> = {}) {
  return createAxeHud({
    enabled: true,
    axe: fakeAxe(violations),
    runOn: { initial: false, navigation: false },
    ...options,
  })
}

describe('Modal', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('appears after an audit with violations (default onViolations)', async () => {
    const hud = setup([violation('a', 'critical')])
    await hud.audit()
    await flush()
    expect(modal()).not.toBeNull()
    hud.destroy()
  })

  it('does not appear when there are no violations (onViolations)', async () => {
    const hud = setup([])
    await hud.audit()
    await flush()
    expect(modal()).toBeNull()
    hud.destroy()
  })

  it('never appears when modal mode is "never"', async () => {
    const hud = setup([violation('a', 'critical')], { modal: 'never' })
    await hud.audit()
    await flush()
    expect(modal()).toBeNull()
    hud.destroy()
  })

  it('appears with zero issues when modal mode is "always"', async () => {
    const hud = setup([], { modal: 'always' })
    await hud.audit()
    await flush()
    expect(modal()).not.toBeNull()
    hud.destroy()
  })

  it('stays dismissed for the same URL after dismissal', async () => {
    const hud = setup([violation('a', 'critical')])
    await hud.audit()
    await flush()
    document
      .getElementById(HUD_ROOT_ID)
      ?.shadowRoot?.querySelector<HTMLElement>('.axe-hud-modal [aria-label="Dismiss summary"]')
      ?.click()
    await flush()
    expect(modal()).toBeNull()

    await hud.audit()
    await flush()
    expect(modal()).toBeNull()
    hud.destroy()
  })

  it('opens the sidebar from "View report"', async () => {
    const hud = setup([violation('a', 'critical')])
    await hud.audit()
    await flush()
    const shadow = document.getElementById(HUD_ROOT_ID)?.shadowRoot
    Array.from(shadow?.querySelectorAll<HTMLElement>('.axe-hud-modal .axe-hud-btn') ?? [])
      .find((btn) => btn.textContent === 'View report')
      ?.click()
    await flush()
    expect(modal()).toBeNull()
    expect(shadow?.querySelector('.axe-hud-sidebar')).not.toBeNull()
    hud.destroy()
  })
})
