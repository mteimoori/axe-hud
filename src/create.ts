import { resolveEnabled } from './env'
import { Highlighter } from './highlight'
import { NavigationObserver } from './navigation'
import { countByImpact } from './results'
import { AxeRunner } from './runner'
import { Store } from './store'
import type { AuditOutcome, AxeHudController, AxeHudOptions } from './types'
import { mountHud } from './ui/mount'
import { initialHudState, type HudActions, type HudState } from './ui/state'

const NOOP_CONTROLLER: AxeHudController = {
  audit: async () => {},
  open: () => {},
  close: () => {},
  destroy: () => {},
}

function currentUrl(): string {
  if (typeof window === 'undefined' || !window.location) return ''
  return window.location.href
}

/**
 * Create and mount the accessibility HUD.
 *
 * Resolves whether it may run (environment gate), and if so mounts the widget in an isolated
 * shadow root, wires navigation-triggered re-audits, and runs an initial audit. When disabled —
 * including on the server, where there is no DOM — it returns an inert controller and mounts
 * nothing, so it is safe to call unconditionally.
 */
export function createAxeHud(options: AxeHudOptions = {}): AxeHudController {
  const enablement = resolveEnabled(options)
  if (!enablement.enabled || typeof document === 'undefined') {
    return NOOP_CONTROLLER
  }

  console.info(`[axe-hud] active — ${enablement.reason}`)

  const store = new Store<HudState>(initialHudState(currentUrl()))
  const runner = new AxeRunner({
    axe: options.axe,
    axeOptions: options.axeOptions,
    context: options.axeContext,
    debounceMs: options.debounceMs,
  })
  const navigation = new NavigationObserver()
  const modalMode = options.modal ?? 'onViolations'
  const dismissedModals = new Set<string>()

  const emit = (outcome: AuditOutcome): void => {
    if (outcome.status === 'running') {
      // New audit (often a navigation) — clear any stale per-page modal.
      store.set({ outcome, modalOpen: false })
      return
    }
    store.set({ outcome })
    options.onAudit?.(outcome)
    if (outcome.status !== 'done' || modalMode === 'never') return
    const showModal = modalMode === 'always' || countByImpact(outcome.results).total > 0
    if (showModal && !dismissedModals.has(outcome.url)) {
      store.set({ modalOpen: true })
    }
  }

  const auditNow = async (): Promise<void> => {
    const outcome = await runner.run()
    if (outcome) emit(outcome)
  }

  let highlighter: Highlighter | null = null

  const actions: HudActions = {
    rerun: () => void auditNow(),
    dismissModal: () => {
      dismissedModals.add(store.get().outcome.url)
      store.set({ modalOpen: false })
    },
    viewReport: () => {
      dismissedModals.add(store.get().outcome.url)
      store.set({ open: true, modalOpen: false })
    },
    highlight: (target) => highlighter?.highlight(target),
  }

  const mount = mountHud(store, options.position ?? 'bottom-right', actions)
  highlighter = new Highlighter(mount.root)

  const runOnInitial = options.runOn?.initial ?? true
  const runOnNavigation = options.runOn?.navigation ?? true

  if (runOnNavigation) {
    navigation.start()
    navigation.subscribe(() => runner.schedule(emit))
  }
  if (runOnInitial) {
    runner.schedule(emit)
  }

  return {
    audit: auditNow,
    open: () => store.set({ open: true }),
    close: () => store.set({ open: false }),
    destroy: () => {
      runner.cancel()
      navigation.stop()
      highlighter?.destroy()
      mount.unmount()
    },
  }
}
