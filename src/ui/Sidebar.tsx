import { countByImpact } from '../results'
import { IMPACT_ORDER } from '../types'
import { FindingCard } from './FindingCard'
import type { HudActions, HudState, ImpactFilter } from './state'

const FILTERS: ImpactFilter[] = ['all', ...IMPACT_ORDER]

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function chipLabel(filter: ImpactFilter, counts: ReturnType<typeof countByImpact>): string {
  const count = filter === 'all' ? counts.total : counts[filter]
  return `${filter === 'all' ? 'All' : capitalize(filter)} ${count}`
}

export interface SidebarProps {
  state: HudState
  actions: HudActions
  onClose: () => void
  onFilter: (filter: ImpactFilter) => void
}

/** Slide-in report panel: severity filters plus the list of expandable findings. */
export function Sidebar({ state, actions, onClose, onFilter }: SidebarProps) {
  if (!state.open) return null

  const violations = state.outcome.results?.violations ?? []
  const counts = countByImpact(state.outcome.results)
  const visible =
    state.filter === 'all'
      ? violations
      : violations.filter((violation) => violation.impact === state.filter)
  const running = state.outcome.status === 'running'

  return (
    <aside class="axe-hud-sidebar" role="dialog" aria-label="Accessibility report">
      <header class="axe-hud-sidebar__header">
        <h2 class="axe-hud-sidebar__title">Accessibility</h2>
        <div class="axe-hud-sidebar__actions">
          <button
            type="button"
            class="axe-hud-icon-btn"
            aria-label="Re-run audit"
            onClick={actions.rerun}
          >
            ⟳
          </button>
          <button
            type="button"
            class="axe-hud-icon-btn"
            aria-label="Close report"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </header>

      <div class="axe-hud-chips" role="group" aria-label="Filter by severity">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            class={`axe-hud-chip axe-hud-chip--${filter}${state.filter === filter ? ' is-active' : ''}`}
            aria-pressed={state.filter === filter}
            onClick={() => onFilter(filter)}
          >
            {chipLabel(filter, counts)}
          </button>
        ))}
      </div>

      {running && <p class="axe-hud-empty">Running audit…</p>}
      {!running && visible.length === 0 && (
        <p class="axe-hud-empty">
          No issues{state.filter === 'all' ? '' : ` at ${state.filter} severity`}.
        </p>
      )}
      {visible.length > 0 && (
        <ul class="axe-hud-findings">
          {visible.map((violation) => (
            <FindingCard key={violation.id} violation={violation} />
          ))}
        </ul>
      )}
    </aside>
  )
}
