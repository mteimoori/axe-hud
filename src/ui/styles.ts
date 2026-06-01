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
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.18);
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
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  font-size: 16px;
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
.axe-hud-finding__nodes code {
  display: block;
  padding: 8px 10px;
  background: #f6f7f9;
  border: 1px solid #eceef1;
  border-radius: 8px;
  font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: #1f2937;
  overflow-wrap: anywhere;
}

.axe-hud-modal {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 2147483002;
  width: 360px;
  max-width: calc(100vw - 32px);
  padding: 14px 16px;
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
  font: 400 14px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.axe-hud-modal__head { display: flex; align-items: center; gap: 8px; }
.axe-hud-modal__title { flex: 1; font-size: 14px; }
.axe-hud-modal__counts {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #4b5563;
  font-size: 13px;
}
.axe-hud-modal__counts li { display: inline-flex; align-items: center; gap: 6px; text-transform: capitalize; }
.axe-hud-modal__actions { margin-top: 14px; display: flex; gap: 8px; }

.axe-hud-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 9px;
  background: #111827;
  color: #fff;
  font: 600 13px/1 inherit;
  cursor: pointer;
}
.axe-hud-btn:hover { filter: brightness(1.1); }
.axe-hud-btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.axe-hud-btn--ghost { background: transparent; color: #374151; border: 1px solid #e5e7eb; }
.axe-hud-btn--ghost:hover { background: #f3f4f6; filter: none; }
`
