import { slugify } from './slugify'
import type { BadgeGroup, BadgeSpec } from './types'

const API_URL = 'https://stamps.zhr.pl/api/badges'
const ICON_BASE = 'https://stamps.zhr.pl/img/form/'

interface ApiResponse {
  badges: ApiGroup[]
  categories: ApiCategory[]
}

interface ApiCategory {
  id: number
  name: string
  ordinal: number
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
let _categories: ApiCategory[] | null = null

/**
 * Static fallback category names (matches API data).
 * Used before API is fetched and as fallback.
 */
const CATEGORY_NAMES: Record<number, string> = {
  1: 'Obozownictwo i przyroda',
  2: 'Sport, Turystyka i Krajoznawstwo',
  3: 'Sztuka i Technika',
  4: 'Nauka i kultura',
  5: 'Duch i charakter',
  6: 'Muzyka i ekspresja',
}

/**
 * Returns category name from API by category ID.
 * Falls back to static mapping if API not fetched yet.
 */
export function getCategoryName(categoryId: number): string {
  if (_categories) {
    const cat = _categories.find(c => c.id === categoryId)
    if (cat) return cat.name
  }
  return CATEGORY_NAMES[categoryId] || `Kategoria ${categoryId}`
}

/**
 * Returns emoji icon for category based on API mapping.
 * Uses local mapping since API doesn't provide icons.
 */
export function getCategoryIcon(categoryId: number): string {
  const ICON_MAP: Record<number, string> = {
    1: '⛺', // Obozownictwo i przyroda
    2: '⛰️', // Sport, Turystyka i Krajoznawstwo
    3: '🎨', // Sztuka i Technika
    4: '📚', // Nauka i kultura
    5: '⚜️', // Duch i charakter (lilija)
    6: '🎭', // Muzyka i ekspresja
    7: '📋', // Próby
  }
  return ICON_MAP[categoryId] || '📌'
}

/**
 * Returns ordinal for a category from API.
 * Falls back to static mapping if API not fetched yet.
 */
export function getCategoryOrdinal(categoryId: number): number {
  if (_categories) {
    const cat = _categories.find(c => c.id === categoryId)
    if (cat) return cat.ordinal
  }
  // Static fallback matches API data
  const ORDINAL_MAP: Record<number, number> = {
    1: 1, // Obozownictwo i przyroda
    2: 3, // Sport, Turystyka i Krajoznawstwo
    3: 4, // Sztuka i Technika
    4: 5, // Nauka i kultura
    5: 6, // Duch i charakter
    6: 2, // Muzyka i ekspresja
  }
  return ORDINAL_MAP[categoryId] || 99
}

export async function fetchBadgeGroups(): Promise<BadgeGroup[]> {
  if (_cache) return _cache

  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = (await res.json()) as ApiResponse

  // Cache categories for lookup
  _categories = data.categories

  _cache = data.badges
    .sort((a, b) => a.ordinal - b.ordinal || a.category - b.category)
    .map(group => {
      const badges: BadgeSpec[] = group.spec.badges.map(badge => {
        // Unique slug: {name}-{id} to handle duplicate names (e.g., "Strzelec" 2★ and 3★)
        const nameSlug = slugify(badge.name)
        const shortId = badge.id.split('-')[0] // e.g., "3e7e8570" from "3e7e8570-f7d3-..."
        const slug = `${nameSlug}-${shortId}`

        return {
          id: badge.id,
          name: badge.name,
          slug,
          stars: badge.stars as 1 | 2 | 3,
          requirements: badge.requirements,
          basedOn: badge.basedOn,
          iconUrl: group.spec.badgeIcons[badge.id]
            ? `${ICON_BASE}${group.spec.badgeIcons[badge.id]}`
            : null,
        }
      })

      return {
        id: group.id,
        ordinal: group.ordinal,
        category: group.category as 1 | 2 | 3 | 4 | 5 | 6,
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

export function findPrerequisiteById(groups: BadgeGroup[], id: string): BadgeSpec | null {
  for (const group of groups) {
    const found = group.spec.badges.find(b => b.id === id)
    if (found) return found
  }
  return null
}

/**
 * Returns unique category IDs from an array, sorted by their ordinal from API.
 */
export function getSortedCategoryIds(groupsWithCategories: number[]): number[] {
  const unique = Array.from(new Set(groupsWithCategories))
  return unique.sort((a, b) => getCategoryOrdinal(a) - getCategoryOrdinal(b))
}
