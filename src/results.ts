import type { AxeResults } from 'axe-core'
import { IMPACT_ORDER, type Impact, type ImpactCounts } from './types'

const emptyCounts = (): ImpactCounts => ({
  critical: 0,
  serious: 0,
  moderate: 0,
  minor: 0,
  total: 0,
})

/** Narrow an arbitrary axe impact string to our {@link Impact} union, or `null`. */
export function normalizeImpact(value: string | null | undefined): Impact | null {
  switch (value) {
    case 'critical':
    case 'serious':
    case 'moderate':
    case 'minor':
      return value
    default:
      return null
  }
}

/** Count violated rules per severity. One count per violation rule (not per affected node). */
export function countByImpact(results: AxeResults | null): ImpactCounts {
  const counts = emptyCounts()
  if (!results) return counts
  for (const violation of results.violations) {
    const impact = normalizeImpact(violation.impact)
    if (impact === null) continue
    counts[impact] += 1
    counts.total += 1
  }
  return counts
}

/** The most severe impact present in the counts, or `null` when there are no violations. */
export function worstImpact(counts: ImpactCounts): Impact | null {
  for (const impact of IMPACT_ORDER) {
    if (counts[impact] > 0) return impact
  }
  return null
}
