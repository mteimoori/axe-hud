import type { AxeResults } from 'axe-core'
import { act, createElement, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxeHudProvider } from '../src/react'
import { HUD_ROOT_ID } from '../src/runner'
import type { AxeLike } from '../src/types'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

function fakeAxe(): AxeLike {
  return { run: vi.fn().mockResolvedValue({ violations: [] } as unknown as AxeResults) }
}

const providerProps = {
  axe: fakeAxe(),
  runOn: { initial: false, navigation: false },
}

describe('AxeHudProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('mounts the HUD while rendered and removes it on unmount', async () => {
    const root = createRoot(container)
    await act(async () => {
      root.render(createElement(AxeHudProvider, providerProps))
    })
    expect(document.getElementById(HUD_ROOT_ID)).not.toBeNull()

    await act(async () => {
      root.unmount()
    })
    expect(document.getElementById(HUD_ROOT_ID)).toBeNull()
  })

  it('mounts exactly one HUD under StrictMode', async () => {
    const root = createRoot(container)
    await act(async () => {
      root.render(createElement(StrictMode, null, createElement(AxeHudProvider, providerProps)))
    })
    expect(document.querySelectorAll(`#${HUD_ROOT_ID}`)).toHaveLength(1)

    await act(async () => {
      root.unmount()
    })
    expect(document.getElementById(HUD_ROOT_ID)).toBeNull()
  })
})
