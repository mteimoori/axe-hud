import type { AuditOutcome } from '../types'

/** UI state held in the store and rendered by the HUD. */
export interface HudState {
  outcome: AuditOutcome
  /** Whether the report sidebar is open. */
  open: boolean
}

export function initialHudState(url: string): HudState {
  return {
    outcome: { status: 'idle', url, timestamp: 0, results: null, error: null },
    open: false,
  }
}
