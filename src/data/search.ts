import Fuse from 'fuse.js'
import type { BadgeGroup } from './types'

export interface SearchResult {
  type: 'badge' | 'group'
  groupSlug: string
  groupName: string
  badgeSlug?: string
  badgeName?: string
  stars?: 1 | 2 | 3
  iconUrl?: string | null
  category: 1 | 2 | 3 | 4
}

export interface SearchDocument {
  name: string
  keywords: string
  groupName: string
  requirements: string
  result: SearchResult
}

export function buildSearchIndex(groups: BadgeGroup[]): Fuse<SearchDocument> {
  const docs: SearchDocument[] = []

  for (const group of groups) {
    docs.push({
      name: group.spec.name,
      keywords: group.spec.keywords.join(' '),
      groupName: group.spec.name,
      requirements: '',
      result: {
        type: 'group',
        groupSlug: group.slug,
        groupName: group.spec.name,
        category: group.category,
      },
    })

    for (const badge of group.spec.badges) {
      docs.push({
        name: badge.name,
        keywords: group.spec.keywords.join(' '),
        groupName: group.spec.name,
        requirements: badge.requirements.join(' '),
        result: {
          type: 'badge',
          groupSlug: group.slug,
          groupName: group.spec.name,
          badgeSlug: badge.slug,
          badgeName: badge.name,
          stars: badge.stars,
          iconUrl: badge.iconUrl,
          category: group.category,
        },
      })
    }
  }

  return new Fuse(docs, {
    keys: [
      { name: 'name', weight: 2.0 },
      { name: 'keywords', weight: 1.5 },
      { name: 'groupName', weight: 1.0 },
      { name: 'requirements', weight: 0.5 },
    ],
    threshold: 0.35,
    minMatchCharLength: 2,
    includeScore: true,
  })
}
