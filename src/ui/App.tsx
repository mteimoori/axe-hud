import type { Store } from '../store'
import type { WidgetPosition } from '../types'
import { Modal } from './Modal'
import { Sidebar } from './Sidebar'
import type { HudActions, HudState, ImpactFilter } from './state'
import { useStore } from './useStore'
import { Widget } from './Widget'

export interface AppProps {
  store: Store<HudState>
  position: WidgetPosition
  actions: HudActions
}

/** Root of the HUD UI tree rendered inside the shadow root. */
export function App({ store, position, actions }: AppProps) {
  const state = useStore(store)
  const toggle = () => store.set((prev) => ({ open: !prev.open }))
  const close = () => store.set({ open: false })
  const setFilter = (filter: ImpactFilter) => store.set({ filter })

  return (
    <>
      <Sidebar state={state} actions={actions} onClose={close} onFilter={setFilter} />
      <Modal state={state} actions={actions} />
      <Widget state={state} position={position} onToggle={toggle} />
    </>
  )
}
