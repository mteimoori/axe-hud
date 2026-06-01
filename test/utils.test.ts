import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce, onIdle } from '../src/utils'

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('coalesces rapid calls into a single trailing invocation', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced('a')
    debounced('b')
    debounced('c')
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('cancel() prevents a pending invocation', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    debounced.cancel()
    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('onIdle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('falls back to a timeout when requestIdleCallback is unavailable', () => {
    vi.stubGlobal('requestIdleCallback', undefined)
    const cb = vi.fn()
    onIdle(cb)
    expect(cb).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('uses requestIdleCallback when available', () => {
    const ric = vi.fn((fn: IdleRequestCallback) => {
      fn({ didTimeout: false, timeRemaining: () => 0 })
      return 1
    })
    vi.stubGlobal('requestIdleCallback', ric)
    const cb = vi.fn()
    onIdle(cb)
    expect(ric).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
