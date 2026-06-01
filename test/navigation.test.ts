import { afterEach, describe, expect, it, vi } from 'vitest'
import { NavigationObserver } from '../src/navigation'

describe('NavigationObserver', () => {
  const observers: NavigationObserver[] = []

  function track(observer: NavigationObserver): NavigationObserver {
    observers.push(observer)
    return observer
  }

  afterEach(() => {
    for (const observer of observers.splice(0)) observer.stop()
  })

  it('notifies on history.pushState and replaceState', () => {
    const observer = track(new NavigationObserver())
    const listener = vi.fn()
    observer.start()
    observer.subscribe(listener)

    history.pushState({}, '', '/page-a')
    history.replaceState({}, '', '/page-b')

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenLastCalledWith(expect.stringContaining('/page-b'))
  })

  it('notifies on popstate and hashchange', () => {
    const observer = track(new NavigationObserver())
    const listener = vi.fn()
    observer.start()
    observer.subscribe(listener)

    window.dispatchEvent(new Event('popstate'))
    window.dispatchEvent(new Event('hashchange'))

    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('stops notifying and restores history methods after stop()', () => {
    const observer = track(new NavigationObserver())
    const listener = vi.fn()
    observer.start()
    observer.subscribe(listener)
    observer.stop()

    history.pushState({}, '', '/after-stop')
    window.dispatchEvent(new Event('popstate'))

    expect(listener).not.toHaveBeenCalled()
  })

  it('shares a single history patch across overlapping observers', () => {
    const a = track(new NavigationObserver())
    const b = track(new NavigationObserver())
    const listenerA = vi.fn()
    const listenerB = vi.fn()
    a.start()
    b.start()
    a.subscribe(listenerA)
    b.subscribe(listenerB)

    // When the first observer stops, the patch must remain for the second.
    a.stop()
    history.pushState({}, '', '/still-observed')

    expect(listenerA).not.toHaveBeenCalled()
    expect(listenerB).toHaveBeenCalledTimes(1)
  })

  it('unsubscribe stops a single listener', () => {
    const observer = track(new NavigationObserver())
    const listener = vi.fn()
    observer.start()
    const unsubscribe = observer.subscribe(listener)
    unsubscribe()

    history.pushState({}, '', '/unsubscribed')

    expect(listener).not.toHaveBeenCalled()
  })
})
