import type { AxeResults, ElementContext, RunOptions } from 'axe-core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxeRunner, DEFAULT_AXE_OPTIONS, HUD_ROOT_ID } from '../src/runner'
import type { AxeLike } from '../src/types'

function fakeResults(): AxeResults {
  return { violations: [] } as unknown as AxeResults
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('AxeRunner.run', () => {
  it('uses an injected axe instance without importing axe-core', async () => {
    const run = vi.fn().mockResolvedValue(fakeResults())
    const runner = new AxeRunner({ axe: { run } })
    const outcome = await runner.run()
    expect(outcome?.status).toBe('done')
    expect(outcome?.results).toEqual(fakeResults())
    expect(run).toHaveBeenCalledTimes(1)
  })

  it('excludes the HUD root and applies the EU baseline by default', async () => {
    const run = vi.fn().mockResolvedValue(fakeResults())
    const runner = new AxeRunner({ axe: { run } })
    await runner.run()
    const [context, options] = run.mock.calls[0] as [ElementContext, RunOptions]
    expect(context).toEqual({ exclude: [[`#${HUD_ROOT_ID}`]] })
    expect(options).toMatchObject(DEFAULT_AXE_OPTIONS)
  })

  it('reports an error outcome when axe throws', async () => {
    const run = vi.fn().mockRejectedValue(new Error('boom'))
    const runner = new AxeRunner({ axe: { run } })
    const outcome = await runner.run()
    expect(outcome?.status).toBe('error')
    expect(outcome?.error?.message).toBe('boom')
  })

  it('resolves a superseded run to null', async () => {
    const first = deferred<AxeResults>()
    const second = deferred<AxeResults>()
    const run = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const runner = new AxeRunner({ axe: { run } as AxeLike })

    const firstRun = runner.run()
    const secondRun = runner.run()
    second.resolve(fakeResults())
    first.resolve(fakeResults())

    expect(await firstRun).toBeNull()
    expect((await secondRun)?.status).toBe('done')
  })

  it('cancel() invalidates an in-flight run', async () => {
    const pending = deferred<AxeResults>()
    const run = vi.fn().mockReturnValue(pending.promise)
    const runner = new AxeRunner({ axe: { run } as AxeLike })
    const runPromise = runner.run()
    runner.cancel()
    pending.resolve(fakeResults())
    expect(await runPromise).toBeNull()
  })
})

describe('AxeRunner.schedule', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('requestIdleCallback', undefined)
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('debounces rapid triggers into a single run and emits running then done', async () => {
    const run = vi.fn().mockResolvedValue(fakeResults())
    const runner = new AxeRunner({ axe: { run }, debounceMs: 100 })
    const handler = vi.fn()

    runner.schedule(handler)
    runner.schedule(handler)
    runner.schedule(handler)

    await vi.advanceTimersByTimeAsync(200)

    expect(run).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls.map((c) => (c[0] as { status: string }).status)).toEqual([
      'running',
      'done',
    ])
  })
})
