import { render } from 'preact'
import { HUD_ROOT_ID } from '../runner'
import type { Store } from '../store'
import type { WidgetPosition } from '../types'
import { App } from './App'
import type { HudActions, HudState } from './state'
import { hudStyles } from './styles'

export interface HudMount {
  /** The shadow root the HUD is rendered into (overlays attach here too). */
  root: ShadowRoot
  /** Remove the HUD from the DOM and unmount the Preact tree. */
  unmount(): void
}

/**
 * Mount the HUD into an isolated shadow root appended to `<body>`.
 *
 * The host element carries {@link HUD_ROOT_ID} so axe scans can exclude it, and the shadow
 * boundary keeps the HUD's styles from leaking into — or being broken by — the host page.
 */
export function mountHud(
  store: Store<HudState>,
  position: WidgetPosition,
  actions: HudActions,
): HudMount {
  const host = document.createElement('div')
  host.id = HUD_ROOT_ID

  const shadow = host.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  style.textContent = hudStyles
  shadow.appendChild(style)

  const container = document.createElement('div')
  shadow.appendChild(container)
  document.body.appendChild(host)

  render(<App store={store} position={position} actions={actions} />, container)

  return {
    root: shadow,
    unmount() {
      render(null, container)
      host.remove()
    },
  }
}
