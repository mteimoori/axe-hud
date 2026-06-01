import type { Store } from '../store'
import type { WidgetPosition } from '../types'
import type { HudState } from './state'
import { useStore } from './useStore'
import { Widget } from './Widget'

export interface AppProps {
  store: Store<HudState>
  position: WidgetPosition
}

/** Root of the HUD UI tree rendered inside the shadow root. */
export function App({ store, position }: AppProps) {
  const state = useStore(store)
  const toggle = () => store.set((prev) => ({ open: !prev.open }))

  return <Widget state={state} position={position} onToggle={toggle} />
}
