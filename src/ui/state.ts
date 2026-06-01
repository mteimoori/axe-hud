import type { AuditOutcome, Impact } from '../types'

/** Active severity filter in the sidebar. */
export type ImpactFilter = 'all' | Impact

/** UI state held in the store and rendered by the HUD. */
export interface HudState {
  outcome: AuditOutcome
  /** Whether the report sidebar is open. */
  open: boolean
  /** Severity filter applied to the report. */
  filter: ImpactFilter
}

/** Imperative actions the UI can invoke, wired by the orchestrator. */
export interface HudActions {
  /** Re-run the audit on the current page. */
  rerun(): void
}

export function initialHudState(url: string): HudState {
  return {
    outcome: { status: 'idle', url, timestamp: 0, results: null, error: null },
    open: false,
    filter: 'all',
  }
}
