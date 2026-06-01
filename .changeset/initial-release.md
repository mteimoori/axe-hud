---
'axe-hud': minor
---

Initial release of axe-hud: an in-page accessibility HUD powered by axe-core.

- Floating widget with a live, severity-colored violation count
- Report sidebar grouped by impact, with severity filters, doc links, and click-to-highlight
- Per-page summary modal with per-URL dismissal
- Automatic re-audits on SPA navigation, plus an imperative `audit()` trigger
- Shadow-DOM isolation and a conservative production gate (off in production by default)
- Lazy-loaded axe-core and an optional `axe-hud/react` provider + hook
