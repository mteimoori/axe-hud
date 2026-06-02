export type StoreListener<T> = (state: T) => void

export type StateUpdater<T> = Partial<T> | ((prev: T) => Partial<T>)

/**
 * Minimal reactive store: holds an immutable state object, shallow-merges updates, and notifies
 * subscribers on change. No framework dependency — the UI layer binds to it.
 */
export class Store<T extends object> {
  private state: T
  private readonly listeners = new Set<StoreListener<T>>()

  constructor(initial: T) {
    this.state = initial
  }

  get(): T {
    return this.state
  }

  set(update: StateUpdater<T>): void {
    const patch = typeof update === 'function' ? update(this.state) : update
    this.state = { ...this.state, ...patch }
    for (const listener of [...this.listeners]) listener(this.state)
  }

  /** Subscribe to changes. Returns an unsubscribe function. */
  subscribe(listener: StoreListener<T>): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}
