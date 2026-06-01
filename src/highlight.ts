import type { NodeResult } from 'axe-core'

/** An axe node target: one selector per frame, where a frame selector may itself pierce shadow roots. */
export type HighlightTarget = NodeResult['target']

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Resolve an axe target to a DOM element, descending through shadow roots where needed. */
export function resolveElement(target: HighlightTarget): Element | null {
  const first = target[0]
  try {
    if (typeof first === 'string') return document.querySelector(first)
    if (Array.isArray(first)) {
      let root: Document | ShadowRoot = document
      let element: Element | null = null
      for (const selector of first) {
        element = root.querySelector(selector)
        if (!element) return null
        if (element.shadowRoot) root = element.shadowRoot
      }
      return element
    }
  } catch {
    return null
  }
  return null
}

/**
 * Draws a positioned overlay over a page element and scrolls it into view.
 *
 * The overlay lives inside the HUD's shadow root (so it is excluded from scans) and tracks the
 * target through scroll/resize. It auto-clears after a few seconds.
 */
export class Highlighter {
  private readonly overlay: HTMLElement
  private current: Element | null = null
  private clearTimer: ReturnType<typeof setTimeout> | undefined
  private readonly onViewportChange = (): void => this.reposition()

  constructor(parent: ParentNode) {
    this.overlay = document.createElement('div')
    this.overlay.className = 'axe-hud-highlight'
    this.overlay.setAttribute('aria-hidden', 'true')
    this.overlay.hidden = true
    parent.appendChild(this.overlay)
  }

  highlight(target: HighlightTarget): void {
    const element = resolveElement(target)
    if (!element) return
    this.current = element

    try {
      element.scrollIntoView?.({
        block: 'center',
        inline: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    } catch {
      // scrollIntoView is unavailable in some environments (e.g. jsdom); positioning still works.
    }

    this.reposition()
    window.addEventListener('scroll', this.onViewportChange, true)
    window.addEventListener('resize', this.onViewportChange)

    if (this.clearTimer) clearTimeout(this.clearTimer)
    this.clearTimer = setTimeout(() => this.clear(), 4000)
  }

  clear(): void {
    this.current = null
    this.overlay.hidden = true
    window.removeEventListener('scroll', this.onViewportChange, true)
    window.removeEventListener('resize', this.onViewportChange)
    if (this.clearTimer) {
      clearTimeout(this.clearTimer)
      this.clearTimer = undefined
    }
  }

  destroy(): void {
    this.clear()
    this.overlay.remove()
  }

  private reposition(): void {
    if (!this.current) return
    const rect = this.current.getBoundingClientRect()
    const style = this.overlay.style
    style.top = `${rect.top}px`
    style.left = `${rect.left}px`
    style.width = `${rect.width}px`
    style.height = `${rect.height}px`
    this.overlay.hidden = false
  }
}
