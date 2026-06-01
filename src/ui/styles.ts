/** Stylesheet injected into the HUD's shadow root. Scoped — it never leaks to the host page. */
export const hudStyles = `
:host { all: initial; }
* { box-sizing: border-box; }

.axe-hud-fab {
  position: fixed;
  z-index: 2147483000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 10px 14px;
  border: none;
  border-radius: 999px;
  background: var(--axe-hud-accent, #111827);
  color: #fff;
  font: 600 13px/1 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: filter 120ms ease;
}
.axe-hud-fab:hover { filter: brightness(1.08); }
.axe-hud-fab:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

.axe-hud-fab__glyph {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.85;
}
.axe-hud-fab__count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .axe-hud-fab { transition: none; }
}
`
