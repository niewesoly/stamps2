export interface BadgeSpec {
  id: string
  name: string
  slug: string
  stars: 1 | 2 | 3
  requirements: string[]
  basedOn: string[]
  iconId: string | null // Store only icon ID to prevent React Router auto-preload
}

/** Build full icon URL from iconId */
export function buildIconUrl(iconId: string | null): string | null {
  return iconId ? `https://stamps.zhr.pl/img/form/${iconId}` : null
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
