export interface Debounced<A extends unknown[]> {
  (...args: A): void
  cancel(): void
}

/** Trailing-edge debounce. Coalesces rapid calls into a single invocation after `wait` ms. */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
): Debounced<A> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: A): void => {
    if (timer !== undefined) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
      fn(...args)
    }, wait)
  }

  debounced.cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  return debounced
}

/** Run a callback when the browser is idle, falling back to a timeout where unsupported. */
export function onIdle(callback: () => void, timeout = 1000): void {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => callback(), { timeout })
  } else {
    setTimeout(callback, 1)
  }
}
