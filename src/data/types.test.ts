import { describe, it, expect } from 'vitest'
import { CATEGORY_NAMES, CATEGORY_ICONS } from './types'

describe('CATEGORY_NAMES', () => {
  it('category 1 → Obozownictwo i przyroda', () => {
    expect(CATEGORY_NAMES[1]).toBe('Obozownictwo i przyroda')
  })
  it('category 2 → Sport, turystyka i krajoznawstwo', () => {
    expect(CATEGORY_NAMES[2]).toBe('Sport, turystyka i krajoznawstwo')
  })
  it('category 3 → Sztuka i technika', () => {
    expect(CATEGORY_NAMES[3]).toBe('Sztuka i technika')
  })
  it('category 4 → Nauka i kultura', () => {
    expect(CATEGORY_NAMES[4]).toBe('Nauka i kultura')
  })
  it('category 6 → Duch i charakter', () => {
    expect(CATEGORY_NAMES[6]).toBe('Duch i charakter')
  })
})

describe('CATEGORY_ICONS', () => {
  it('category 1 icon → ⛺', () => {
    expect(CATEGORY_ICONS[1]).toBe('⛺')
  })
  it('category 2 icon → ⛰️', () => {
    expect(CATEGORY_ICONS[2]).toBe('⛰️')
  })
  it('category 3 icon → 🎨', () => {
    expect(CATEGORY_ICONS[3]).toBe('🎨')
  })
  it('category 4 icon → 📚 (unchanged)', () => {
    expect(CATEGORY_ICONS[4]).toBe('📚')
  })
  it('category 6 icon → ⚜️', () => {
    expect(CATEGORY_ICONS[6]).toBe('⚜️')
  })
})
