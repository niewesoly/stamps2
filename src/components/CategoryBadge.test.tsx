import { describe, it, expect } from 'vitest'
import { getCategoryName, getCategoryIcon } from '@/data/api'

// CategoryBadge uses these helpers to render category name and icon.
// We test that all valid category values have proper values.
describe('CategoryBadge category support', () => {
  it('getCategoryName returns a name for every valid category', () => {
    const validCategories = [1, 2, 3, 4, 5, 6]
    validCategories.forEach(c => {
      const name = getCategoryName(c)
      expect(name).toBeDefined()
      expect(name.length).toBeGreaterThan(0)
    })
  })

  it('getCategoryIcon returns an icon for every valid category', () => {
    const validCategories = [1, 2, 3, 4, 5, 6]
    validCategories.forEach(c => {
      const icon = getCategoryIcon(c)
      expect(icon).toBeDefined()
      expect(icon.length).toBeGreaterThan(0)
    })
  })
})
