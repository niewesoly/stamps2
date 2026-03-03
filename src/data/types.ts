export interface BadgeSpec {
  id: string
  name: string
  slug: string
  stars: 1 | 2 | 3
  requirements: string[]
  basedOn: string[]
  iconUrl: string | null
}

export interface BadgeGroup {
  id: string
  ordinal: number
  category: 1 | 2 | 3 | 4 | 6
  slug: string
  spec: {
    name: string
    comment: string
    keywords: string[]
    badges: BadgeSpec[]
  }
}

export const CATEGORY_NAMES: Record<number, string> = {
  1: 'Puszcza i przyroda',
  2: 'Sport',
  3: 'Umiejętności',
  4: 'Kultura i wiedza',
  6: 'Duch i charakter',
}

export const CATEGORY_ICONS: Record<number, string> = {
  1: '🌲',
  2: '🏹',
  3: '🔧',
  4: '📚',
  6: '🎭',
}
