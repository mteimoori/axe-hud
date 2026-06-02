# Architecture

A map of the codebase for contributors. The package is a framework-agnostic core with a thin
optional React binding; the HUD UI is rendered with Preact inside a shadow root.

## Modules

| File                 | Responsibility                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/types.ts`       | Public types: `Impact`, `AxeHudOptions`, `AxeHudController`, `AuditOutcome`, …                         |
| `src/navigation.ts`  | `NavigationObserver` — a ref-counted patch of `pushState`/`replaceState` plus `popstate`/`hashchange`. |
| `src/runner.ts`      | `AxeRunner` — lazy-loads axe-core, runs/cancels audits, debounces and idle-defers `schedule()`.        |
| `src/store.ts`       | `Store<T>` — a tiny reactive store (get / set / subscribe).                                            |
| `src/results.ts`     | Derivations from axe results: `countByImpact`, `worstImpact`, `normalizeImpact`.                       |
| `src/highlight.ts`   | `Highlighter` — resolves an axe target to an element and draws a tracked overlay.                      |
| `src/ui/`            | Preact components: `App`, `Widget`, `Sidebar`, `FindingCard`, plus `mount`, `state`, `useStore`.       |
| `src/create.ts`      | `createAxeHud()` — the orchestrator that wires everything together.                                    |
| `src/index.ts`       | Public barrel export.                                                                                  |
| `src/react/index.ts` | `AxeHudProvider` + `useAxeHud()` — a thin wrapper over `createAxeHud`.                                 |

## Data flow

```
navigation / initial / manual ─▶ AxeRunner.schedule ─▶ axe.run ─▶ AuditOutcome
                                                                      │
                                                          createAxeHud.emit
                                                                      ▼
                                                                   Store
                                                                      │
                                                         useStore (Preact) ─▶ Widget / Sidebar
```

`createAxeHud` mounts the UI into a shadow root (when a DOM is present), constructs the runner,
navigation observer, store, and highlighter, then wires audits → store → UI. It has no environment
gating — the consumer decides where to load it. The returned controller
(`audit` / `open` / `close` / `destroy`) is the public handle.

## Design choices

- **Shadow DOM isolation.** The HUD mounts under `#axe-hud-root` with an open shadow root. This
  keeps the HUD's styles from leaking into the host page (and vice versa) and lets us exclude the
  HUD from its own scans via `exclude: [['#axe-hud-root']]`.
- **Lazy axe-core.** `AxeRunner` imports axe-core only on the first real run, so apps that bundle
  axe-hud but never enable it (production) don't pay for axe-core.
- **Cancellation.** Each run takes a monotonic id; superseded runs resolve to `null` and never
  emit, so rapid navigation can't render stale results.
- **SSR-safe.** Every entry point checks for `window`/`document` and no-ops without a DOM, so the
  package is safe to import and call on the server.
- **Preact under the hood, vanilla on the surface.** Preact gives ergonomic component code at ~4KB
  and is bundled into the package; consumers just call `createAxeHud()`.

## Tests

Vitest + jsdom. Unit tests cover SSR safety, the navigation observer, the runner (lazy load,
cancellation, debounce), the store, results derivations, the highlighter, SSR safety, and
integration tests that mount the HUD and assert widget/sidebar/keyboard behaviour.
