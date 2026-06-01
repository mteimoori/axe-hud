import type { NodeResult, Result } from 'axe-core'
import { useState } from 'preact/hooks'
import { normalizeImpact } from '../results'

/** Render an axe target selector (which may contain nested frame selectors) as a string. */
function formatTarget(target: readonly unknown[]): string {
  return target.map((part) => (Array.isArray(part) ? part.join(' ') : String(part))).join(' ')
}

export interface FindingCardProps {
  violation: Result
  onHighlight: (target: NodeResult['target']) => void
}

/** A single violated rule: collapsed summary that expands to description, docs, and failing nodes. */
export function FindingCard({ violation, onHighlight }: FindingCardProps) {
  const [open, setOpen] = useState(false)
  const impact = normalizeImpact(violation.impact) ?? 'minor'

  return (
    <li class="axe-hud-finding">
      <button
        type="button"
        class="axe-hud-finding__summary"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span class={`axe-hud-dot axe-hud-dot--${impact}`} aria-hidden="true" />
        <span class="axe-hud-finding__title">{violation.help}</span>
        <span class="axe-hud-finding__chevron" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open && (
        <div class="axe-hud-finding__detail">
          <p class="axe-hud-finding__desc">{violation.description}</p>
          {violation.helpUrl && (
            <a
              class="axe-hud-finding__link"
              href={violation.helpUrl}
              target="_blank"
              rel="noreferrer"
            >
              Learn more ↗
            </a>
          )}
          <p class="axe-hud-finding__nodes-label">Failing elements ({violation.nodes.length})</p>
          <ul class="axe-hud-finding__nodes">
            {violation.nodes.map((node, index) => (
              <li key={index}>
                <button
                  type="button"
                  class="axe-hud-node"
                  title="Highlight this element on the page"
                  onClick={() => onHighlight(node.target)}
                >
                  <code>{formatTarget(node.target)}</code>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
