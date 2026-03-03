import { describe, it, expect } from 'vitest'
import { CATEGORY_NAMES, CATEGORY_ICONS } from './types'

describe('CATEGORY_NAMES', () => {
  it('has entry for category 6 (Duch i charakter)', () => {
    expect(CATEGORY_NAMES[6]).toBe('Duch i charakter')
  })
})

describe('CATEGORY_ICONS', () => {
  it('has icon for category 6', () => {
    expect(CATEGORY_ICONS[6]).toBeDefined()
  })
})
