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
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: #111827;
  font: 600 13px/1 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: filter 120ms ease;
}
.axe-hud-fab:hover { filter: brightness(1.04); }
.axe-hud-fab:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

/* Neutral by default and while auditing; red on violations; green when clean. */
.axe-hud-fab--violation { background: #dc2626; border-color: #dc2626; color: #fff; }
.axe-hud-fab--clean { background: #16a34a; border-color: #16a34a; color: #fff; }
.axe-hud-fab--neutral[aria-busy='true'] { opacity: 0.85; }

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
  background: rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}
.axe-hud-fab--violation .axe-hud-fab__count,
.axe-hud-fab--clean .axe-hud-fab__count {
  background: rgba(255, 255, 255, 0.25);
}

@media (prefers-reduced-motion: reduce) {
  .axe-hud-fab { transition: none; }
}

.axe-hud-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2147483001;
  display: flex;
  flex-direction: column;
  width: 380px;
  max-width: 100vw;
  height: 100vh;
  background: #fff;
  color: #111827;
  font: 400 14px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
}

.axe-hud-sidebar__header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.axe-hud-sidebar__title { margin: 0; font-size: 16px; font-weight: 700; }
.axe-hud-sidebar__actions { display: inline-flex; gap: 4px; }

.axe-hud-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.axe-hud-icon-btn:hover { background: #f3f4f6; }
.axe-hud-icon-btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 1px; }

.axe-hud-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f1f3;
}
.axe-hud-chip {
  padding: 5px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.axe-hud-chip:hover { background: #f9fafb; }
.axe-hud-chip:focus-visible { outline: 2px solid #2563eb; outline-offset: 1px; }
.axe-hud-chip.is-active { background: #111827; border-color: #111827; color: #fff; }
.axe-hud-chip--critical.is-active { background: #b91c1c; border-color: #b91c1c; }
.axe-hud-chip--serious.is-active { background: #c2410c; border-color: #c2410c; }
.axe-hud-chip--moderate.is-active { background: #a16207; border-color: #a16207; }
.axe-hud-chip--minor.is-active { background: #3f6212; border-color: #3f6212; }

.axe-hud-empty { padding: 24px 16px; color: #6b7280; }

.axe-hud-findings { margin: 0; padding: 0; list-style: none; }
.axe-hud-finding { border-bottom: 1px solid #f0f1f3; }

.axe-hud-finding__summary {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.axe-hud-finding__summary:hover { background: #f9fafb; }
.axe-hud-finding__summary:focus-visible { outline: 2px solid #2563eb; outline-offset: -2px; }
.axe-hud-finding__title { flex: 1; font-weight: 600; }
.axe-hud-finding__chevron { color: #9ca3af; }

.axe-hud-dot {
  flex: none;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #9ca3af;
}
.axe-hud-dot--critical { background: #b91c1c; }
.axe-hud-dot--serious { background: #c2410c; }
.axe-hud-dot--moderate { background: #a16207; }
.axe-hud-dot--minor { background: #3f6212; }

.axe-hud-finding__detail { padding: 0 16px 14px 36px; }
.axe-hud-finding__desc { margin: 0 0 8px; color: #4b5563; }
.axe-hud-finding__link { color: #2563eb; font-weight: 600; text-decoration: none; }
.axe-hud-finding__link:hover { text-decoration: underline; }
.axe-hud-finding__nodes-label { margin: 12px 0 6px; font-size: 12px; font-weight: 600; color: #6b7280; }
.axe-hud-finding__nodes { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.axe-hud-node {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font: inherit;
}
.axe-hud-node code {
  display: block;
  padding: 8px 10px;
  background: #f6f7f9;
  border: 1px solid #eceef1;
  border-radius: 8px;
  font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: #1f2937;
  overflow-wrap: anywhere;
}
.axe-hud-node:hover code { background: #eef2ff; border-color: #c7d2fe; }
.axe-hud-node:focus-visible { outline: 2px solid #2563eb; outline-offset: 1px; border-radius: 8px; }

.axe-hud-highlight {
  position: fixed;
  z-index: 2147482000;
  pointer-events: none;
  border: 2px solid #2563eb;
  border-radius: 3px;
  background: rgba(37, 99, 235, 0.12);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  transition: top 120ms ease, left 120ms ease, width 120ms ease, height 120ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .axe-hud-highlight { transition: none; }
}
`
