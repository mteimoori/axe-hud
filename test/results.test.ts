import type { AxeResults } from 'axe-core'
import { describe, expect, it } from 'vitest'
import { countByImpact, normalizeImpact, worstImpact } from '../src/results'

function resultsWithImpacts(impacts: Array<string | null>): AxeResults {
  return {
    violations: impacts.map((impact) => ({ impact })),
  } as unknown as AxeResults
}

describe('normalizeImpact', () => {
  it('passes through valid impacts', () => {
    expect(normalizeImpact('critical')).toBe('critical')
    expect(normalizeImpact('minor')).toBe('minor')
  })

  it('returns null for unknown or missing values', () => {
    expect(normalizeImpact(null)).toBeNull()
    expect(normalizeImpact(undefined)).toBeNull()
    expect(normalizeImpact('catastrophic')).toBeNull()
  })
})

describe('countByImpact', () => {
  it('returns all-zero counts for null results', () => {
    expect(countByImpact(null)).toEqual({
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      total: 0,
    })
  })

  it('counts one per violation rule and ignores unknown impacts', () => {
    const counts = countByImpact(
      resultsWithImpacts(['critical', 'critical', 'serious', 'minor', null]),
    )
    expect(counts).toEqual({ critical: 2, serious: 1, moderate: 0, minor: 1, total: 4 })
  })
})

describe('worstImpact', () => {
  it('returns null when there are no violations', () => {
    expect(worstImpact(countByImpact(null))).toBeNull()
  })

  it('returns the most severe impact present', () => {
    expect(worstImpact(countByImpact(resultsWithImpacts(['minor', 'serious'])))).toBe('serious')
    expect(worstImpact(countByImpact(resultsWithImpacts(['moderate', 'minor'])))).toBe('moderate')
  })
})
