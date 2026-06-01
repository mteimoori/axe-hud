import type { AxeHudOptions, Environment } from './types'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '::1', ''])

// Generic, vendor-neutral hostname markers. Word-boundary anchored so they only match
// whole segments (e.g. `staging.example.com`, not `mainstream.example.com`).
const PREVIEW_PATTERN = /(^|[.-])(preview|deploy-preview|pr-\d+|branch)([.-]|$)/
const PREVIEW_PLATFORM = /\.(vercel\.app|netlify\.app|pages\.dev|onrender\.com|surge\.sh)$/
const STAGE_PATTERN = /(^|[.-])(stag|staging|stage|stg|test|testing|qa|uat|sandbox)([.-]|$)/

function currentHostname(): string | null {
  if (typeof window === 'undefined' || !window.location) return null
  return window.location.hostname
}

/**
 * Classify a hostname into a coarse {@link Environment} using generic heuristics.
 *
 * Anything unrecognized is treated as `production` so the gate fails safe (closed). Pass an
 * explicit hostname to make it deterministic; otherwise it reads `window.location.hostname`
 * and returns `'unknown'` when there is no DOM (e.g. during SSR).
 */
export function detectEnvironment(hostname?: string): Environment {
  const raw = hostname ?? currentHostname()
  if (raw === null) return 'unknown'
  const host = raw.toLowerCase()
  if (LOCAL_HOSTS.has(host) || host.endsWith('.local') || host.endsWith('.localhost')) {
    return 'local'
  }
  if (PREVIEW_PATTERN.test(host) || PREVIEW_PLATFORM.test(host)) return 'preview'
  if (STAGE_PATTERN.test(host)) return 'stage'
  return 'production'
}

/** Environments the HUD runs in when none are configured. */
export const DEFAULT_ENVIRONMENTS: Environment[] = ['local', 'preview', 'stage']

export interface Enablement {
  enabled: boolean
  environment: Environment
  /** Human-readable explanation, surfaced in a console notice when the HUD activates. */
  reason: string
}

/**
 * Decide whether the HUD may run.
 *
 * Precedence: an explicit `enabled` boolean always wins. Otherwise the detected environment is
 * checked against the allowlist, and `production` is never enabled implicitly.
 */
export function resolveEnabled(options: AxeHudOptions = {}): Enablement {
  const environment = options.detect?.() ?? detectEnvironment()

  if (typeof options.enabled === 'boolean') {
    return {
      enabled: options.enabled,
      environment,
      reason: options.enabled ? 'forced on via `enabled`' : 'forced off via `enabled`',
    }
  }

  if (environment === 'production') {
    return { enabled: false, environment, reason: 'gated off on production' }
  }

  const allowlist = options.environments ?? DEFAULT_ENVIRONMENTS
  const enabled = allowlist.includes(environment)
  return {
    enabled,
    environment,
    reason: enabled ? `enabled for ${environment}` : `${environment} not in allowlist`,
  }
}
