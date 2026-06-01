import { useLayoutEffect, useRef } from 'preact/hooks'
import { countByImpact, worstImpact } from '../results'
import { IMPACT_ORDER } from '../types'
import type { HudActions, HudState } from './state'

export interface ModalProps {
  state: HudState
  actions: HudActions
}

/** Lightweight per-page summary card shown after an audit. The detailed view lives in the sidebar. */
export function Modal({ state, actions }: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!state.modalOpen) return
    cardRef.current?.querySelector<HTMLElement>('.axe-hud-btn')?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') actions.dismissModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state.modalOpen, actions])

  if (!state.modalOpen) return null

  const counts = countByImpact(state.outcome.results)
  const worst = worstImpact(counts)
  const heading =
    counts.total === 0
      ? 'No accessibility issues on this page'
      : `${counts.total} accessibility ${counts.total === 1 ? 'issue' : 'issues'} on this page`

  return (
    <div
      ref={cardRef}
      class="axe-hud-modal"
      role="dialog"
      aria-label="Accessibility summary for this page"
    >
      <div class="axe-hud-modal__head">
        <span class={`axe-hud-dot axe-hud-dot--${worst ?? 'minor'}`} aria-hidden="true" />
        <strong class="axe-hud-modal__title">{heading}</strong>
        <button
          type="button"
          class="axe-hud-icon-btn"
          aria-label="Dismiss summary"
          onClick={actions.dismissModal}
        >
          ✕
        </button>
      </div>

      {counts.total > 0 && (
        <ul class="axe-hud-modal__counts">
          {IMPACT_ORDER.filter((impact) => counts[impact] > 0).map((impact) => (
            <li key={impact}>
              <span class={`axe-hud-dot axe-hud-dot--${impact}`} aria-hidden="true" />
              {counts[impact]} {impact}
            </li>
          ))}
        </ul>
      )}

      <div class="axe-hud-modal__actions">
        <button type="button" class="axe-hud-btn" onClick={actions.viewReport}>
          View report
        </button>
        <button type="button" class="axe-hud-btn axe-hud-btn--ghost" onClick={actions.dismissModal}>
          Dismiss
        </button>
      </div>
    </div>
  )
}
