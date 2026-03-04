import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { BadgeGroup } from './types'

function makeGroup(overrides: Partial<BadgeGroup> & { id: string; ordinal: number }): BadgeGroup {
  return {
    category: 1,
    slug: `group-${overrides.id}`,
    spec: { name: `Group ${overrides.id}`, comment: '', keywords: [], badges: [] },
    ...overrides,
  }
}

describe('fetchBadgeGroups – sort order', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns groups sorted by ordinal ascending (lowest first)', async () => {
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            badges: [
              { id: 'c', ordinal: 30, category: 1, spec: { name: 'C', comment: '', keywords: [], badges: [], badgeIcons: {} } },
              { id: 'a', ordinal: 10, category: 1, spec: { name: 'A', comment: '', keywords: [], badges: [], badgeIcons: {} } },
              { id: 'b', ordinal: 20, category: 1, spec: { name: 'B', comment: '', keywords: [], badges: [], badgeIcons: {} } },
            ],
            categories: [
              { id: 1, name: 'Test Category', ordinal: 1 },
            ],
          }),
      })
    )

    const { fetchBadgeGroups } = await import('./api')
    const groups = await fetchBadgeGroups()

    expect(groups[0].ordinal).toBe(10)
    expect(groups[1].ordinal).toBe(20)
    expect(groups[2].ordinal).toBe(30)

    vi.unstubAllGlobals()
  })
})

describe('findPrerequisiteById', () => {
  it('finds a badge within the same group', async () => {
    const { findPrerequisiteById } = await import('./api')

    const groups: BadgeGroup[] = [
      {
        ...makeGroup({ id: 'g1', ordinal: 1 }),
        spec: {
          name: 'Group 1',
          comment: '',
          keywords: [],
          badges: [
            { id: 'b1', name: 'Badge 1', slug: 'badge-1', stars: 1, requirements: [], basedOn: [], iconUrl: null },
            { id: 'b2', name: 'Badge 2', slug: 'badge-2', stars: 2, requirements: [], basedOn: ['b1'], iconUrl: null },
          ],
        },
      },
    ]

    const prereq = findPrerequisiteById(groups, 'b1')
    expect(prereq?.id).toBe('b1')
  })

  it('finds a badge in a different group (cross-group reference)', async () => {
    const { findPrerequisiteById } = await import('./api')

    const groups: BadgeGroup[] = [
      {
        ...makeGroup({ id: 'g1', ordinal: 1 }),
        spec: {
          name: 'Group 1',
          comment: '',
          keywords: [],
          badges: [
            { id: 'prereq-badge', name: 'Prereq', slug: 'prereq', stars: 1, requirements: [], basedOn: [], iconUrl: null },
          ],
        },
      },
      {
        ...makeGroup({ id: 'g2', ordinal: 2 }),
        spec: {
          name: 'Group 2',
          comment: '',
          keywords: [],
          badges: [
            { id: 'main-badge', name: 'Main', slug: 'main', stars: 2, requirements: [], basedOn: ['prereq-badge'], iconUrl: null },
          ],
        },
      },
    ]

    const prereq = findPrerequisiteById(groups, 'prereq-badge')
    expect(prereq?.id).toBe('prereq-badge')
    expect(prereq?.name).toBe('Prereq')
  })

  it('returns null when badge id does not exist', async () => {
    const { findPrerequisiteById } = await import('./api')

    const groups: BadgeGroup[] = [makeGroup({ id: 'g1', ordinal: 1 })]

    const prereq = findPrerequisiteById(groups, 'nonexistent')
    expect(prereq).toBeNull()
  })
})
