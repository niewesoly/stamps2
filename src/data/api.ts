import { slugify } from './slugify'
import type { BadgeGroup, BadgeSpec } from './types'
import badgesData from './badges-data.json'

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

/**
 * Process raw API data into BadgeGroup array.
 */
function processBadgeData(data: ApiResponse): BadgeGroup[] {
  return data.badges
    .sort((a, b) => a.ordinal - b.ordinal || a.category - b.category)
    .map(group => {
      const badges: BadgeSpec[] = group.spec.badges.map(badge => {
        const nameSlug = slugify(badge.name)
        const shortId = badge.id.split('-')[0]
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
      let formattedGroupName = group.spec.name;
      if (formattedGroupName === formattedGroupName.toUpperCase() && formattedGroupName.length > 2) {
        formattedGroupName = formattedGroupName.charAt(0) + formattedGroupName.slice(1).toLowerCase();
      } else {
        formattedGroupName = formattedGroupName.charAt(0).toUpperCase() + formattedGroupName.slice(1);
      }

      return {
        id: group.id,
        ordinal: group.ordinal,
        category: group.category as 1 | 2 | 3 | 4 | 5 | 6,
        slug: slugify(formattedGroupName),
        spec: {
          name: formattedGroupName,
          comment: group.spec.comment,
          keywords: group.spec.keywords,
          badges,
        },
      } satisfies BadgeGroup
    })
}

export async function fetchBadgeGroups(): Promise<BadgeGroup[]> {
  if (_cache) return _cache

  // First try live API (works in dev mode and tests with mocked fetch)
  try {
    const res = await fetch(API_URL)
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()

    // Runtime validation of API response structure
    if (!data || typeof data !== 'object') {
      throw new Error('API returned invalid response format: expected object')
    }
    if (!Array.isArray(data.badges)) {
      throw new Error('API returned invalid response format: missing badges array')
    }
    if (!Array.isArray(data.categories)) {
      throw new Error('API returned invalid response format: missing categories array')
    }

    const response = data as ApiResponse

    // Cache categories for lookup
    _categories = response.categories
    _cache = processBadgeData(response)

    return _cache
  } catch (error) {
    // If fetch fails (e.g., network error, API blocked), fall back to static data
    console.warn('Failed to fetch from API, using static data:', error instanceof Error ? error.message : error)
  }

  // Fallback to static data (for CI/CD builds without API access)
  try {
    const data = badgesData as ApiResponse

    if (data && Array.isArray(data.badges) && Array.isArray(data.categories)) {
      _categories = data.categories
      _cache = processBadgeData(data)
      console.log('Loaded badge data from static JSON')
      return _cache
    }
  } catch (error) {
    console.warn('Failed to load static data:', error instanceof Error ? error.message : error)
  }

  // If all else fails, throw an error
  throw new Error('Failed to fetch badge groups: API and static data unavailable')
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
