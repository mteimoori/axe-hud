import { countByImpact, worstImpact } from '../results'
import type { Impact, WidgetPosition } from '../types'
import type { HudState } from './state'

const IMPACT_COLOR: Record<Impact, string> = {
  critical: '#b91c1c',
  serious: '#c2410c',
  moderate: '#a16207',
  minor: '#3f6212',
}
const CLEAN_COLOR = '#15803d'

const CORNER: Record<WidgetPosition, string> = {
  'bottom-right': 'bottom:16px;right:16px',
  'bottom-left': 'bottom:16px;left:16px',
  'top-right': 'top:16px;right:16px',
  'top-left': 'top:16px;left:16px',
}

export interface WidgetProps {
  state: HudState
  position: WidgetPosition
  onToggle: () => void
}

/** Floating action button showing a live violation count, colored by worst severity. */
export function Widget({ state, position, onToggle }: WidgetProps) {
  const counts = countByImpact(state.outcome.results)
  const worst = worstImpact(counts)
  const running = state.outcome.status === 'running'
  const accent = worst ? IMPACT_COLOR[worst] : CLEAN_COLOR
  const label = running
    ? 'Running accessibility audit'
    : `Accessibility: ${counts.total} ${counts.total === 1 ? 'issue' : 'issues'}`

  return (
    <button
      type="button"
      class="axe-hud-fab"
      style={`${CORNER[position]};--axe-hud-accent:${accent}`}
      aria-label={label}
      aria-expanded={state.open}
      onClick={onToggle}
    >
      <span class="axe-hud-fab__glyph" aria-hidden="true">
        axe
      </span>
      <span class="axe-hud-fab__count">{running ? '…' : counts.total}</span>
    </button>
  )
}
