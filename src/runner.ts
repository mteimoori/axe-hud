import type { ElementContext, RunOptions } from 'axe-core'
import type { AuditOutcome, AxeLike } from './types'
import { debounce, onIdle, type Debounced } from './utils'

/** DOM id of the HUD's shadow-root host. Always excluded from scans so the HUD never audits itself. */
export const HUD_ROOT_ID = 'axe-hud-root'

/** Default rule set: the EU-required baseline (EN 301 549 ≈ WCAG 2.1 A + AA). */
export const DEFAULT_AXE_OPTIONS: RunOptions = {
  runOnly: { type: 'tag', values: ['EN-301-549'] },
}

const DEFAULT_CONTEXT: ElementContext = { exclude: [[`#${HUD_ROOT_ID}`]] }

export interface AxeRunnerOptions {
  /** Inject a custom axe instance. When omitted, axe-core is dynamically imported on first run. */
  axe?: AxeLike
  axeOptions?: RunOptions
  context?: ElementContext
  /** Debounce window for {@link AxeRunner.schedule}. Defaults to 250ms. */
  debounceMs?: number
}

export type OutcomeHandler = (outcome: AuditOutcome) => void

function currentUrl(): string {
  if (typeof window === 'undefined' || !window.location) return ''
  return window.location.href
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

/**
 * Runs axe-core against the current page.
 *
 * - **Lazy**: axe-core is imported only on the first real run, so bundles that never enable the
 *   HUD don't pay for it.
 * - **Cancellable**: each run takes a monotonic id; a run whose id is stale (superseded by a newer
 *   run or a `cancel()`) resolves to `null` and never emits.
 * - **Debounced + idle**: {@link schedule} coalesces rapid triggers and defers to browser idle time.
 */
export class AxeRunner {
  private axe: AxeLike | null
  private runId = 0
  private readonly debounceMs: number
  private scheduled: Debounced<[OutcomeHandler]> | null = null

  constructor(private readonly options: AxeRunnerOptions = {}) {
    this.axe = options.axe ?? null
    this.debounceMs = options.debounceMs ?? 250
  }

  /** Resolve the axe instance, importing axe-core lazily on first use. */
  async loadAxe(): Promise<AxeLike> {
    if (this.axe) return this.axe
    const mod = await import('axe-core')
    this.axe = (mod.default ?? mod) as unknown as AxeLike
    return this.axe
  }

  /** Run immediately. Returns the outcome, or `null` if the run was superseded. */
  async run(): Promise<AuditOutcome | null> {
    const id = ++this.runId
    const url = currentUrl()
    try {
      const axe = await this.loadAxe()
      const results = await axe.run(this.options.context ?? DEFAULT_CONTEXT, {
        ...DEFAULT_AXE_OPTIONS,
        ...this.options.axeOptions,
      })
      if (id !== this.runId) return null
      return { status: 'done', url, timestamp: Date.now(), results, error: null }
    } catch (error) {
      if (id !== this.runId) return null
      return { status: 'error', url, timestamp: Date.now(), results: null, error: toError(error) }
    }
  }

  /**
   * Debounced, idle-deferred run. Emits a `running` outcome up front, then the final
   * `done`/`error` outcome. Rapid calls collapse to a single run.
   */
  schedule(handler: OutcomeHandler): void {
    this.scheduled ??= debounce((emit: OutcomeHandler) => {
      onIdle(() => {
        emit({
          status: 'running',
          url: currentUrl(),
          timestamp: Date.now(),
          results: null,
          error: null,
        })
        void this.run().then((outcome) => {
          if (outcome) emit(outcome)
        })
      })
    }, this.debounceMs)
    this.scheduled(handler)
  }

  /** Cancel any pending scheduled run and invalidate any in-flight run. */
  cancel(): void {
    this.runId += 1
    this.scheduled?.cancel()
  }
}
