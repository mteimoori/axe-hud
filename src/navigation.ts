export type NavigationListener = (url: string) => void

const LOCATION_CHANGE_EVENT = 'axe-hud:locationchange'
const PATCH_FLAG = '__axeHudHistoryPatched'

type PatchableHistory = History & { [PATCH_FLAG]?: boolean }

let refCount = 0
let originalPushState: History['pushState'] | null = null
let originalReplaceState: History['replaceState'] | null = null

function emitLocationChange(): void {
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT))
}

// Patch `history.pushState`/`replaceState` once (ref-counted) so that programmatic SPA
// navigations emit an event. Multiple observers — or multiple HUD instances under React
// StrictMode — share a single patch and only the last `release()` restores the originals.
function acquireHistoryPatch(): void {
  const history = window.history as PatchableHistory
  if (history[PATCH_FLAG]) {
    refCount += 1
    return
  }
  const nativePushState = history.pushState.bind(history)
  const nativeReplaceState = history.replaceState.bind(history)
  originalPushState = nativePushState
  originalReplaceState = nativeReplaceState
  history.pushState = (...args: Parameters<History['pushState']>) => {
    const result = nativePushState(...args)
    emitLocationChange()
    return result
  }
  history.replaceState = (...args: Parameters<History['replaceState']>) => {
    const result = nativeReplaceState(...args)
    emitLocationChange()
    return result
  }
  history[PATCH_FLAG] = true
  refCount += 1
}

function releaseHistoryPatch(): void {
  refCount = Math.max(0, refCount - 1)
  if (refCount > 0) return
  const history = window.history as PatchableHistory
  if (originalPushState) history.pushState = originalPushState
  if (originalReplaceState) history.replaceState = originalReplaceState
  originalPushState = null
  originalReplaceState = null
  delete history[PATCH_FLAG]
}

/**
 * Observes client-side navigation without depending on any router.
 *
 * Detects `pushState`/`replaceState` (via a shared, ref-counted patch), `popstate`, and
 * `hashchange`. SSR-safe: `start()` is a no-op when there is no `window`.
 */
export class NavigationObserver {
  private readonly listeners = new Set<NavigationListener>()
  private started = false
  private readonly handleChange = (): void => this.notify()

  start(): void {
    if (this.started || typeof window === 'undefined') return
    this.started = true
    acquireHistoryPatch()
    window.addEventListener(LOCATION_CHANGE_EVENT, this.handleChange)
    window.addEventListener('popstate', this.handleChange)
    window.addEventListener('hashchange', this.handleChange)
  }

  stop(): void {
    if (!this.started) return
    this.started = false
    window.removeEventListener(LOCATION_CHANGE_EVENT, this.handleChange)
    window.removeEventListener('popstate', this.handleChange)
    window.removeEventListener('hashchange', this.handleChange)
    releaseHistoryPatch()
  }

  /** Subscribe to navigation changes. Returns an unsubscribe function. */
  subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    const url = window.location.href
    for (const listener of [...this.listeners]) listener(url)
  }
}
