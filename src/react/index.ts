import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createAxeHud } from '../create'
import type { AxeHudController, AxeHudOptions } from '../types'

const AxeHudContext = createContext<AxeHudController | null>(null)

export interface AxeHudProviderProps extends AxeHudOptions {
  children?: ReactNode
}

/**
 * Mounts the accessibility HUD for the lifetime of the provider and exposes its controller via
 * context. Safe under React StrictMode (the effect cleanup tears the HUD down) and on the server
 * (the HUD no-ops without a DOM). Options are read once on mount.
 */
export function AxeHudProvider({ children, ...options }: AxeHudProviderProps) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const [controller, setController] = useState<AxeHudController | null>(null)

  useEffect(() => {
    const hud = createAxeHud(optionsRef.current)
    setController(hud)
    return () => {
      hud.destroy()
      setController(null)
    }
  }, [])

  return createElement(AxeHudContext.Provider, { value: controller }, children)
}

/** Access the HUD controller (`audit` / `open` / `close` / `destroy`). Null until mounted. */
export function useAxeHud(): AxeHudController | null {
  return useContext(AxeHudContext)
}

export type { AxeHudController, AxeHudOptions } from '../types'
