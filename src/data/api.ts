import { slugify } from './slugify'
import type { BadgeGroup, BadgeSpec } from './types'

const API_URL = 'https://stamps.zhr.pl/api/badges'
const ICON_BASE = 'https://stamps.zhr.pl/img/form/'

interface ApiResponse {
  badges: ApiGroup[]
}

interface ApiGroup {
  id: string
  ordinal: number
  category: number
  spec: {
    name: string
    comment: string
    keywords: string[]
    badges: ApiBadge[]
    badgeIcons: Record<string, string>
  }
}

interface ApiBadge {
  id: string
  name: string
  stars: number
  requirements: string[]
  basedOn: string[]
}

let _cache: BadgeGroup[] | null = null

export async function fetchBadgeGroups(): Promise<BadgeGroup[]> {
  if (_cache) return _cache

  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = (await res.json()) as ApiResponse

  _cache = data.badges
    .sort((a, b) => b.ordinal - a.ordinal || a.category - b.category)
    .map(group => {
      const badges: BadgeSpec[] = group.spec.badges.map(badge => ({
        id: badge.id,
        name: badge.name,
        slug: slugify(badge.name),
        stars: badge.stars as 1 | 2 | 3,
        requirements: badge.requirements,
        basedOn: badge.basedOn,
        iconUrl: group.spec.badgeIcons[badge.id]
          ? `${ICON_BASE}${group.spec.badgeIcons[badge.id]}`
          : null,
      }))

      return {
        id: group.id,
        ordinal: group.ordinal,
        category: group.category as 1 | 2 | 3 | 4,
        slug: slugify(group.spec.name),
        spec: {
          name: group.spec.name,
          comment: group.spec.comment,
          keywords: group.spec.keywords,
          badges,
        },
      } satisfies BadgeGroup
    })

  return _cache
}

export async function getGroupBySlug(slug: string): Promise<BadgeGroup | undefined> {
  const groups = await fetchBadgeGroups()
  return groups.find(g => g.slug === slug)
}

export async function getBadgeBySlug(badgeSlug: string): Promise<{
  group: BadgeGroup
  badge: BadgeSpec
} | undefined> {
  const groups = await fetchBadgeGroups()
  for (const group of groups) {
    const badge = group.spec.badges.find(b => b.slug === badgeSlug)
    if (badge) return { group, badge }
  }
  return undefined
}
