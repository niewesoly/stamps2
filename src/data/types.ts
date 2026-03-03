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
  category: 1 | 2 | 3 | 4 | 5 | 6
  slug: string
  spec: {
    name: string
    comment: string
    keywords: string[]
    badges: BadgeSpec[]
  }
}
