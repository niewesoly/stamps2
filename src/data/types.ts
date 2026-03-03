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

export const CATEGORY_COLORS: Record<number, string> = {
  1: 'bg-forest-700 text-parchment',
  2: 'bg-earth-700 text-parchment',
  3: 'bg-earth-500 text-parchment',
  4: 'bg-forest-600 text-parchment',
}
