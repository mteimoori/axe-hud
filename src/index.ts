export { createAxeHud } from './create'
export { detectEnvironment, resolveEnabled, DEFAULT_ENVIRONMENTS, type Enablement } from './env'
export { countByImpact, worstImpact, normalizeImpact } from './results'
export { HUD_ROOT_ID, DEFAULT_AXE_OPTIONS } from './runner'
export type {
  AuditOutcome,
  AuditStatus,
  AxeHudController,
  AxeHudOptions,
  AxeLike,
  Environment,
  Impact,
  ImpactCounts,
  ModalMode,
  WidgetPosition,
} from './types'
export { IMPACT_ORDER } from './types'
