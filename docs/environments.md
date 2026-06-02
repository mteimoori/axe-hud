# Loading axe-hud (and keeping it out of production)

axe-hud is a development/QA aid. **The library has no environment logic of its own** —
`createAxeHud()` mounts the HUD whenever it's called in a browser. You decide where it runs by
deciding where you load it.

The reliable way to keep it out of production is simply to **not import it there**. A guarded
dynamic `import()` lets the bundler drop the entire chunk (axe-hud + axe-core) from builds where the
condition is statically false — so production ships zero bytes of it.

## Load only in local + staging

```ts
// Your build exposes some env identifier; use whatever your tooling provides.
const APP_ENV = import.meta.env.VITE_APP_ENV

if (APP_ENV === 'development' || APP_ENV === 'staging') {
  const { createAxeHud } = await import('axe-hud')
  createAxeHud()
}
```

Because the `import()` lives in a branch that is `false` in a production build, bundlers
(Vite/Rollup, webpack, esbuild) tree-shake the whole module out — including axe-core.

## Other common gates

```ts
// Vite dev server only (local):
if (import.meta.env.DEV) {
  const { createAxeHud } = await import('axe-hud')
  createAxeHud()
}
```

```ts
// Node-style env var (webpack and friends):
if (['development', 'staging'].includes(process.env.APP_ENV ?? '')) {
  import('axe-hud').then(({ createAxeHud }) => createAxeHud())
}
```

```ts
// A manual switch (query string, localStorage, feature flag…):
if (new URLSearchParams(location.search).has('a11y')) {
  import('axe-hud').then(({ createAxeHud }) => createAxeHud())
}
```

## React

Gate the provider — or, better, its import — the same way:

```tsx
// AxeHudGate.tsx — only pulled into dev/staging bundles
import { AxeHudProvider } from 'axe-hud/react'
export const Gate = AxeHudProvider

// app entry
let Gate = ({ children }: { children: React.ReactNode }) => <>{children}</>
if (import.meta.env.VITE_APP_ENV !== 'production') {
  Gate = (await import('./AxeHudGate')).Gate
}
```

A static `import { AxeHudProvider } from 'axe-hud/react'` that only renders conditionally also
works, but it leaves axe-hud in the bundle; prefer the dynamic import when you care about prod size.

## Why no built-in gate?

Runtime hostname detection has to _guess_ the environment and can be wrong, and it still ships the
code to production. Letting the consumer decide where to load axe-hud is simpler, has one source of
truth (your build config), and guarantees nothing reaches end users.
