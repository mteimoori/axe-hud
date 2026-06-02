# Recipes

Practical patterns for wiring up axe-hud.

## Load only outside production

The library has no environment gating — keep it out of production by not importing it there. A
guarded dynamic import drops the whole chunk from prod builds:

```ts
// Vite
if (import.meta.env.DEV) {
  const { createAxeHud } = await import('axe-hud')
  createAxeHud()
}

// Webpack / Node-style
if (process.env.NODE_ENV !== 'production') {
  import('axe-hud').then(({ createAxeHud }) => createAxeHud())
}
```

See [environments.md](./environments.md) for a local + staging example and the React variant.

## React

```tsx
import { AxeHudProvider } from 'axe-hud/react'

export function Root() {
  return (
    <AxeHudProvider>
      <App />
    </AxeHudProvider>
  )
}
```

The provider mounts the HUD for its lifetime and is safe under StrictMode and SSR.

## Re-audit after an in-page view change

axe-hud re-audits on route changes (History API, `popstate`, `hashchange`) but does not watch
arbitrary DOM mutations. For a view that changes without navigation — opening a dialog, switching a
tab, expanding an accordion — trigger an audit yourself:

```tsx
import { useAxeHud } from 'axe-hud/react'

function Dialog({ open }) {
  const hud = useAxeHud()
  useEffect(() => {
    hud?.audit() // re-check once the new view has rendered
  }, [open, hud])
  // …
}
```

Or with the vanilla controller: `const hud = createAxeHud(); hud.audit()`.

## Choose a rule set

The default is the EU baseline (`EN-301-549`). Override via `axeOptions`:

```ts
// Stricter — add best-practice rules and WCAG 2.2 AA:
createAxeHud({
  axeOptions: { runOnly: { type: 'tag', values: ['EN-301-549', 'best-practice', 'wcag22aa'] } },
})

// Or target specific rules only:
createAxeHud({ axeOptions: { runOnly: { type: 'rule', values: ['color-contrast', 'label'] } } })
```

## Exclude part of the page from scans

The HUD's own root is always excluded. To exclude more (e.g. a third-party embed), pass an axe
context:

```ts
createAxeHud({
  axeContext: { exclude: [['#third-party-widget'], ['.ad-slot']] },
})
```

## React to audit results programmatically

```ts
createAxeHud({
  onAudit: (outcome) => {
    if (outcome.status === 'done' && outcome.results) {
      console.log('violations:', outcome.results.violations.length)
    }
  },
})
```

## Pin or inject axe-core

```ts
import axe from 'axe-core'
createAxeHud({ axe }) // skip the lazy import; use your own instance/version
```

## Content Security Policy

The HUD renders inside a shadow root and injects a `<style>` element there. If your CSP sets
`style-src` without `'unsafe-inline'`, allow the HUD's styles (it does not inject inline `style`
attributes for layout beyond the widget position). axe-core itself runs as part of your app bundle;
no external scripts are loaded.
