import { countByImpact } from '../results'
import type { WidgetPosition } from '../types'
import type { HudState } from './state'

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

/**
 * Floating action button.
 *
 * Neutral (white) before the first audit and while one is running; red once an audit finds
 * violations, green once an audit completes clean.
 */
export function Widget({ state, position, onToggle }: WidgetProps) {
  const { status } = state.outcome
  const counts = countByImpact(state.outcome.results)
  const running = status === 'running'
  const settled = status === 'done'
  const tone = settled ? (counts.total > 0 ? 'violation' : 'clean') : 'neutral'
  const count = running ? '…' : settled ? counts.total : '–'
  const label = running
    ? 'Running accessibility audit'
    : settled
      ? `Accessibility: ${counts.total} ${counts.total === 1 ? 'issue' : 'issues'}`
      : 'Accessibility audit'

  return (
    <button
      type="button"
      class={`axe-hud-fab axe-hud-fab--${tone}`}
      style={CORNER[position]}
      aria-label={label}
      aria-expanded={state.open}
      aria-busy={running}
      onClick={onToggle}
    >
      <span class="axe-hud-fab__glyph" aria-hidden="true">
        axe
      </span>
      <span class="axe-hud-fab__count">{count}</span>
    </button>
  )
}
