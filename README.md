# axe-hud

> In-page accessibility HUD that runs [axe-core](https://github.com/dequelabs/axe-core) against
> the page you're looking at and surfaces findings in-context — a floating widget, a report
> sidebar, and a per-page summary modal — re-auditing automatically as you navigate.

Framework-agnostic core with an optional React binding. Designed to be **off in production** and
enabled only in local, preview, and staging environments.

> **Status:** early development. The public API is not stable yet (pre-1.0).

## Why

Accessibility regressions are easiest to catch while you're actually using the app. `axe-hud`
gives developers and QA live, in-context feedback against the **EU-required baseline**
(EN 301 549 / WCAG 2.1 A + AA) without leaving the page or opening devtools.

## Features

- Runs axe-core against the currently rendered page.
- Floating **widget** with a live violation count, colored by worst severity.
- Report **sidebar** grouped by impact, with filtering, doc links, and click-to-highlight.
- Per-page **modal** summary after each audit.
- Re-audits on SPA navigation (History API, `popstate`, `hashchange`) and on demand.
- Isolated in a Shadow DOM so it never leaks styles into — or scans — your app's UI.
- Conservative **production gate**: never runs on production unless you explicitly force it.

## Install

```sh
npm install axe-hud
# or: pnpm add axe-hud / yarn add axe-hud
```

## Quick start

### Vanilla

```ts
import { createAxeHud } from 'axe-hud'

const hud = createAxeHud({
  environments: ['local', 'preview', 'stage'],
})

// later, if needed:
hud.destroy()
```

### React

```tsx
import { AxeHudProvider } from 'axe-hud/react'

export function App() {
  return (
    <AxeHudProvider environments={['local', 'preview', 'stage']}>
      <YourApp />
    </AxeHudProvider>
  )
}
```

## Configuration

A full configuration reference is documented as the API stabilizes. See
[`docs/`](./docs) for environment-gating details and recipes.

## Browser support

Modern evergreen browsers (Chromium, Firefox, Safari). The HUD is a development/QA aid and is
not intended to ship to end users in production.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
