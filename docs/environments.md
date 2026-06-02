# Environments & the production gate

axe-hud is a development/QA aid. It is designed to be **off in production** and on only where you
want it (local, preview, staging). This page explains how that gate works and how to control it.

## How detection works

When you don't pass `enabled`, axe-hud classifies the current `window.location.hostname` into one
of: `local`, `preview`, `stage`, `production`, or `unknown`, using generic, vendor-neutral
heuristics:

| Environment  | Matched when the hostname…                                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `local`      | is `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`, or ends in `.local` / `.localhost`                                                                         |
| `preview`    | contains `preview`, `deploy-preview`, `pr-<n>`, `branch`, or is a `*.vercel.app` / `*.netlify.app` / `*.pages.dev` / `*.onrender.com` / `*.surge.sh` host |
| `stage`      | contains `stag`, `staging`, `stage`, `stg`, `test`, `testing`, `qa`, `uat`, or `sandbox`                                                                  |
| `production` | anything else (the safe default)                                                                                                                          |
| `unknown`    | there is no DOM (e.g. server-side rendering)                                                                                                              |

**The gate fails safe:** anything not clearly local/preview/stage is treated as `production`, and
`production` (and `unknown`) never enable the HUD implicitly.

## Controlling the gate

```ts
import { createAxeHud } from 'axe-hud'

// 1. Let detection decide (default allowlist: local, preview, stage):
createAxeHud()

// 2. Force it explicitly (wins over detection) — e.g. only in dev builds:
createAxeHud({ enabled: import.meta.env.DEV })

// 3. Narrow the allowlist:
createAxeHud({ environments: ['local'] })

// 4. Provide your own detector for a bespoke hosting scheme:
createAxeHud({
  detect: () => (location.hostname.endsWith('.internal.example') ? 'stage' : 'production'),
})
```

## Verifying

When the HUD activates it logs a one-line notice, e.g. `[axe-hud] active — enabled for stage`. If
you don't see the widget, check that line (or its absence) to understand the gate's decision.

## Inspecting detection yourself

```ts
import { detectEnvironment, resolveEnabled } from 'axe-hud'

detectEnvironment() // => 'local' | 'preview' | 'stage' | 'production' | 'unknown'
detectEnvironment('staging.example.com') // => 'stage'
resolveEnabled({ environments: ['local'] }) // => { enabled, environment, reason }
```
