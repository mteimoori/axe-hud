import { useLayoutEffect, useState } from 'preact/hooks'
import type { Store } from '../store'

/**
 * Subscribe a Preact component to a {@link Store}, re-rendering on every change.
 *
 * Uses a layout effect so the subscription is active synchronously at commit — no window
 * between the first render and the subscription where a store update could be missed.
 */
export function useStore<T extends object>(store: Store<T>): T {
  const [state, setState] = useState<T>(store.get())
  useLayoutEffect(() => {
    setState(store.get())
    return store.subscribe(setState)
  }, [store])
  return state
}
