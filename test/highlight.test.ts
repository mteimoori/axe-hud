import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Highlighter, resolveElement } from '../src/highlight'

describe('resolveElement', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('resolves a simple selector target', () => {
    const el = document.createElement('button')
    el.id = 'target'
    document.body.appendChild(el)
    expect(resolveElement(['#target'])).toBe(el)
  })

  it('returns null for a missing target', () => {
    expect(resolveElement(['#missing'])).toBeNull()
  })

  it('returns null for an invalid selector instead of throwing', () => {
    expect(resolveElement(['::::'])).toBeNull()
  })
})

describe('Highlighter', () => {
  let parent: HTMLElement

  beforeEach(() => {
    parent = document.createElement('div')
    document.body.appendChild(parent)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  function overlay(): HTMLElement | null {
    return parent.querySelector('.axe-hud-highlight')
  }

  it('shows the overlay for an existing element', () => {
    const target = document.createElement('button')
    target.id = 'x'
    document.body.appendChild(target)

    const highlighter = new Highlighter(parent)
    expect(overlay()?.hidden).toBe(true)

    highlighter.highlight(['#x'])
    expect(overlay()?.hidden).toBe(false)

    highlighter.destroy()
    expect(overlay()).toBeNull()
  })

  it('leaves the overlay hidden for a missing element', () => {
    const highlighter = new Highlighter(parent)
    highlighter.highlight(['#nope'])
    expect(overlay()?.hidden).toBe(true)
    highlighter.destroy()
  })

  it('clear() hides the overlay again', () => {
    const target = document.createElement('div')
    target.id = 'y'
    document.body.appendChild(target)

    const highlighter = new Highlighter(parent)
    highlighter.highlight(['#y'])
    expect(overlay()?.hidden).toBe(false)
    highlighter.clear()
    expect(overlay()?.hidden).toBe(true)
    highlighter.destroy()
  })
})
