import type { AxeResults, ElementContext, RunOptions } from 'axe-core'

/** Coarse runtime environment the HUD uses to decide whether it may run. */
export type Environment = 'local' | 'preview' | 'stage' | 'production' | 'unknown'

/** axe-core severity levels, worst to least. */
export type Impact = 'critical' | 'serious' | 'moderate' | 'minor'

/** Severity order from worst to least, used for sorting and "worst impact" logic. */
export const IMPACT_ORDER: readonly Impact[] = ['critical', 'serious', 'moderate', 'minor']

/** Corner the floating widget is anchored to. */
export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

/** When the per-page summary modal is shown after an audit. */
export type ModalMode = 'always' | 'onViolations' | 'never'

/** Lifecycle of a single audit. */
export type AuditStatus = 'idle' | 'running' | 'done' | 'error'

/** Number of violated rules per severity, plus the total. */
export interface ImpactCounts {
  critical: number
  serious: number
  moderate: number
  minor: number
  total: number
}

/** The result of (attempting) an audit of the current page. */
export interface AuditOutcome {
  status: AuditStatus
  /** Page URL the audit was run against. */
  url: string
  /** Epoch milliseconds when the outcome was produced. */
  timestamp: number
  results: AxeResults | null
  error: Error | null
}

/**
 * Minimal slice of the axe-core API the runner depends on. Lets consumers inject
 * a custom or version-pinned axe instance instead of the bundled lazy import.
 */
export interface AxeLike {
  run(context: ElementContext, options?: RunOptions): Promise<AxeResults>
}

/** Public configuration for the HUD. */
export interface AxeHudOptions {
  /** Explicit override. When set, wins over environment detection (forces on/off). */
  enabled?: boolean
  /** Environments the HUD is allowed to run in. Defaults to `['local', 'preview', 'stage']`. */
  environments?: Environment[]
  /** Custom environment detector. Defaults to {@link detectEnvironment}. */
  detect?: () => Environment
  /** Inject a custom axe-core instance instead of the bundled lazy import. */
  axe?: AxeLike
  /** Options forwarded to `axe.run`. Defaults to the EN 301 549 (EU baseline) tag set. */
  axeOptions?: RunOptions
  /** Context forwarded to `axe.run`. The HUD's own root is always excluded. */
  axeContext?: ElementContext
  /** Which events trigger an audit. Both default to `true`. */
  runOn?: { initial?: boolean; navigation?: boolean }
  /** Debounce window, in milliseconds, for navigation-triggered audits. */
  debounceMs?: number
  /** When to surface the per-page summary modal. Defaults to `'onViolations'`. */
  modal?: ModalMode
  /** Corner the widget is anchored to. Defaults to `'bottom-right'`. */
  position?: WidgetPosition
  /** Called with every completed (or failed) audit outcome. */
  onAudit?: (outcome: AuditOutcome) => void
}

/** Imperative handle returned by `createAxeHud`. */
export interface AxeHudController {
  /** Trigger an audit of the current page. */
  audit(): Promise<void>
  /** Open the report sidebar. */
  open(): void
  /** Close the report sidebar. */
  close(): void
  /** Tear down the HUD and restore all global patches. */
  destroy(): void
}
