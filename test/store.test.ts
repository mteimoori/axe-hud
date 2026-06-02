import { describe, expect, it, vi } from 'vitest'
import { Store } from '../src/store'

interface State {
  count: number
  label: string
}

describe('Store', () => {
  it('returns the initial state', () => {
    const store = new Store<State>({ count: 0, label: 'a' })
    expect(store.get()).toEqual({ count: 0, label: 'a' })
  })

  it('shallow-merges object updates and notifies subscribers', () => {
    const store = new Store<State>({ count: 0, label: 'a' })
    const listener = vi.fn()
    store.subscribe(listener)

    store.set({ count: 1 })

    expect(store.get()).toEqual({ count: 1, label: 'a' })
    expect(listener).toHaveBeenCalledWith({ count: 1, label: 'a' })
  })

  it('supports functional updates based on previous state', () => {
    const store = new Store<State>({ count: 1, label: 'a' })
    store.set((prev) => ({ count: prev.count + 1 }))
    expect(store.get().count).toBe(2)
  })

  it('stops notifying after unsubscribe', () => {
    const store = new Store<State>({ count: 0, label: 'a' })
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    unsubscribe()
    store.set({ count: 5 })
    expect(listener).not.toHaveBeenCalled()
  })
})
