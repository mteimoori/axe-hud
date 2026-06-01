import { describe, expect, it } from 'vitest'
import { detectEnvironment, resolveEnabled } from '../src/env'

describe('detectEnvironment', () => {
  it('classifies local hosts', () => {
    expect(detectEnvironment('localhost')).toBe('local')
    expect(detectEnvironment('127.0.0.1')).toBe('local')
    expect(detectEnvironment('app.local')).toBe('local')
    expect(detectEnvironment('myapp.localhost')).toBe('local')
  })

  it('classifies preview hosts and platforms', () => {
    expect(detectEnvironment('preview.example.com')).toBe('preview')
    expect(detectEnvironment('deploy-preview-42.example.com')).toBe('preview')
    expect(detectEnvironment('pr-7.example.com')).toBe('preview')
    expect(detectEnvironment('my-app-git-feature.vercel.app')).toBe('preview')
    expect(detectEnvironment('site.netlify.app')).toBe('preview')
  })

  it('classifies staging-like hosts', () => {
    expect(detectEnvironment('staging.example.com')).toBe('stage')
    expect(detectEnvironment('app.stage.example.com')).toBe('stage')
    expect(detectEnvironment('qa.example.com')).toBe('stage')
    expect(detectEnvironment('uat-app.example.com')).toBe('stage')
  })

  it('treats anything unrecognized as production (fail safe)', () => {
    expect(detectEnvironment('example.com')).toBe('production')
    expect(detectEnvironment('www.example.com')).toBe('production')
    expect(detectEnvironment('mainstream.example.com')).toBe('production')
  })
})

describe('resolveEnabled', () => {
  it('honors an explicit enabled override regardless of environment', () => {
    expect(resolveEnabled({ enabled: true, detect: () => 'production' }).enabled).toBe(true)
    expect(resolveEnabled({ enabled: false, detect: () => 'local' }).enabled).toBe(false)
  })

  it('never enables on production without an explicit override', () => {
    const result = resolveEnabled({ detect: () => 'production' })
    expect(result.enabled).toBe(false)
    expect(result.reason).toContain('production')
  })

  it('enables for environments in the allowlist', () => {
    expect(resolveEnabled({ detect: () => 'local' }).enabled).toBe(true)
    expect(resolveEnabled({ detect: () => 'stage' }).enabled).toBe(true)
  })

  it('respects a custom allowlist', () => {
    expect(resolveEnabled({ detect: () => 'preview', environments: ['local'] }).enabled).toBe(false)
    expect(resolveEnabled({ detect: () => 'preview', environments: ['preview'] }).enabled).toBe(
      true,
    )
  })

  it('does not enable for unknown environments', () => {
    expect(resolveEnabled({ detect: () => 'unknown' }).enabled).toBe(false)
  })
})
