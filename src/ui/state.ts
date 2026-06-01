import type { NodeResult } from 'axe-core'
import type { AuditOutcome, Impact } from '../types'

/** Active severity filter in the sidebar. */
export type ImpactFilter = 'all' | Impact

/** UI state held in the store and rendered by the HUD. */
export interface HudState {
  outcome: AuditOutcome
  /** Whether the report sidebar is open. */
  open: boolean
  /** Whether the per-page summary modal is showing. */
  modalOpen: boolean
  /** Severity filter applied to the report. */
  filter: ImpactFilter
}

/** Imperative actions the UI can invoke, wired by the orchestrator. */
export interface HudActions {
  /** Re-run the audit on the current page. */
  rerun(): void
  /** Dismiss the per-page modal (remembered for the current URL). */
  dismissModal(): void
  /** Open the full report sidebar and dismiss the modal. */
  viewReport(): void
  /** Outline a failing element on the page and scroll it into view. */
  highlight(target: NodeResult['target']): void
}

export function initialHudState(url: string): HudState {
  return {
    outcome: { status: 'idle', url, timestamp: 0, results: null, error: null },
    open: false,
    modalOpen: false,
    filter: 'all',
  }
}
