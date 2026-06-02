# axe-hud

[![CI](https://github.com/mteimoori/axe-hud/actions/workflows/ci.yml/badge.svg)](https://github.com/mteimoori/axe-hud/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> In-page accessibility HUD powered by [axe-core](https://github.com/dequelabs/axe-core). It audits
> the page you're looking at and surfaces findings in-context — a floating widget and a report
> sidebar — re-auditing automatically as you navigate.

**🔎 [Live demo →](https://mteimoori.github.io/axe-hud/)** · **📚 [API reference →](https://mteimoori.github.io/axe-hud/api/)**

![axe-hud widget and report sidebar](./docs/assets/preview.svg)

Framework-agnostic core with an optional React binding. Designed to be **off in production** and
enabled only in local, preview, and staging environments.

> **Status:** early development (pre-1.0). The public API may change before `1.0.0`.

## Why

Accessibility regressions are easiest to catch while you're actually using the app. `axe-hud` gives
developers and QA live, in-context feedback against the **EU-required baseline**
(EN 301 549 ≈ WCAG 2.1 A + AA) without leaving the page or opening devtools.

## Features

- 🧭 Runs axe-core against the currently rendered page.
- 🔴🟢 Floating **widget** with a live violation count — neutral while auditing, red on violations, green when clean.
- 📋 Report **sidebar** grouped by impact, with severity filters, doc links, and click-to-highlight.
- 🔁 Re-audits on SPA navigation (History API, `popstate`, `hashchange`) and on demand.
- 🧱 Isolated in a **Shadow DOM** — never leaks styles into, or scans, your app's own UI.
- 🚫 Conservative **production gate**: never runs on production unless you explicitly force it.
- ⚡ axe-core is **lazy-loaded** only when the HUD is enabled, so production bundles don't pay for it.
- ♿ The HUD itself is keyboard accessible (focus management, Escape to close, reduced-motion aware).

## Install

```sh
npm install axe-hud
# or: pnpm add axe-hud / yarn add axe-hud
```

## Quick start

### Vanilla

```ts
import { createAxeHud } from 'axe-hud'

const hud = createAxeHud()

// Imperative control if you need it:
hud.audit() // re-run on demand
hud.open() // open the report sidebar
hud.destroy() // tear everything down
```

### React

```tsx
import { AxeHudProvider } from 'axe-hud/react'

export function App() {
  return (
    <AxeHudProvider>
      <YourApp />
    </AxeHudProvider>
  )
}
```

Access the controller anywhere below the provider:

```tsx
import { useAxeHud } from 'axe-hud/react'

const hud = useAxeHud()
hud?.audit()
```

## Environment gating

By default the HUD runs only in `local`, `preview`, and `stage` environments and **never** on
`production`. The environment is inferred from `window.location.hostname` using generic heuristics
(localhost, common preview/staging markers); anything unrecognized is treated as production, so the
gate **fails safe**.

Override detection or force the HUD explicitly:

```ts
createAxeHud({
  // Force on/off regardless of detection (wins over everything):
  enabled: import.meta.env.DEV,

  // …or constrain which detected environments are allowed:
  environments: ['local', 'preview', 'stage'],

  // …or plug in your own detector:
  detect: () => (location.hostname.includes('.internal') ? 'stage' : 'production'),
})
```

## Configuration

| Option         | Type                                                           | Default                                                | Description                                        |
| -------------- | -------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| `enabled`      | `boolean`                                                      | _(unset)_                                              | Force on/off. Overrides environment detection.     |
| `environments` | `Environment[]`                                                | `['local', 'preview', 'stage']`                        | Detected environments the HUD may run in.          |
| `detect`       | `() => Environment`                                            | built-in hostname detection                            | Custom environment detector.                       |
| `axe`          | `AxeLike`                                                      | lazy `import('axe-core')`                              | Inject a custom/pinned axe instance.               |
| `axeOptions`   | `axe.RunOptions`                                               | `{ runOnly: { type: 'tag', values: ['EN-301-549'] } }` | Options passed to `axe.run` (rule set).            |
| `axeContext`   | `axe.ElementContext`                                           | excludes the HUD's own root                            | Context passed to `axe.run`.                       |
| `runOn`        | `{ initial?: boolean; navigation?: boolean }`                  | `{ initial: true, navigation: true }`                  | Which events trigger an audit.                     |
| `debounceMs`   | `number`                                                       | `250`                                                  | Debounce window for navigation-triggered audits.   |
| `position`     | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'`                                       | Corner the widget is anchored to.                  |
| `onAudit`      | `(outcome) => void`                                            | _(none)_                                               | Callback fired with every completed audit outcome. |

### Controller

`createAxeHud()` returns a controller:

| Method      | Description                                    |
| ----------- | ---------------------------------------------- |
| `audit()`   | Run an audit of the current page now.          |
| `open()`    | Open the report sidebar.                       |
| `close()`   | Close the report sidebar.                      |
| `destroy()` | Remove the HUD and restore all global patches. |

## Rule set

The default targets the EU legal baseline via axe-core's `EN-301-549` tag (which incorporates
WCAG 2.1 A + AA). Widen or narrow it through `axeOptions`:

```ts
// Add best-practice rules and WCAG 2.2 AA on top of the EU baseline:
createAxeHud({
  axeOptions: { runOnly: { type: 'tag', values: ['EN-301-549', 'best-practice', 'wcag22aa'] } },
})
```

## Performance

axe-core is imported lazily on the first audit and runs debounced and deferred to browser idle time.
Navigation re-audits are coalesced, and superseded runs are discarded. Because the HUD is gated off
in production, end users never download axe-core.

## Browser support

Modern evergreen browsers (Chromium, Firefox, Safari). axe-hud is a development/QA aid and is not
intended to ship to end users in production.

## Documentation

- [Environments & the production gate](./docs/environments.md)
- [Recipes](./docs/recipes.md)
- [Architecture](./docs/architecture.md) (for contributors)
- [API reference](https://mteimoori.github.io/axe-hud/api/)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Issues and PRs welcome.

## License

[MIT](./LICENSE)
