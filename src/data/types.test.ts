import { describe, it, expect } from 'vitest'
import { getCategoryName, getCategoryIcon } from '@/data/api'

describe('getCategoryName', () => {
  it('returns name for category 1 (Obozownictwo i przyroda)', () => {
    expect(getCategoryName(1)).toBe('Obozownictwo i przyroda')
  })
  it('returns name for category 2 (Sport, Turystyka i Krajoznawstwo)', () => {
    expect(getCategoryName(2)).toBe('Sport, Turystyka i Krajoznawstwo')
  })
  it('returns name for category 3 (Sztuka i Technika)', () => {
    expect(getCategoryName(3)).toBe('Sztuka i Technika')
  })
  it('returns name for category 4 (Nauka i kultura)', () => {
    expect(getCategoryName(4)).toBe('Nauka i kultura')
  })
  it('returns name for category 5 (Duch i charakter)', () => {
    expect(getCategoryName(5)).toBe('Duch i charakter')
  })
  it('returns name for category 6 (Muzyka i ekspresja)', () => {
    expect(getCategoryName(6)).toBe('Muzyka i ekspresja')
  })
})

describe('getCategoryIcon', () => {
  it('returns icon for category 1', () => {
    expect(getCategoryIcon(1)).toBe('⛺')
  })
  it('returns icon for category 2', () => {
    expect(getCategoryIcon(2)).toBe('⛰️')
  })
  it('returns icon for category 3', () => {
    expect(getCategoryIcon(3)).toBe('🎨')
  })
  it('returns icon for category 4', () => {
    expect(getCategoryIcon(4)).toBe('📚')
  })
  it('returns icon for category 5 (Duch)', () => {
    expect(getCategoryIcon(5)).toBe('⚜️')
  })
  it('returns icon for category 6 (Muzyka)', () => {
    expect(getCategoryIcon(6)).toBe('🎭')
  })
})
