import { describe, it, expect } from 'vitest'
import { CATEGORY_NAMES, CATEGORY_ICONS } from '@/data/types'

// CategoryBadge uses these constants internally.
// We test that all valid category values (including 6) have entries.
describe('CategoryBadge category support', () => {
  it('CATEGORY_NAMES has entry for every category accepted by CategoryBadge props', () => {
    const validCategories: Array<1 | 2 | 3 | 4 | 6> = [1, 2, 3, 4, 6]
    validCategories.forEach(c => {
      expect(CATEGORY_NAMES[c]).toBeDefined()
      expect(CATEGORY_ICONS[c]).toBeDefined()
    })
  })
})
