import { data } from 'react-router'
import type { Route } from './+types/group'
import { getGroupBySlug } from '@/data/api'
import type { BadgeSpec } from '@/data/types'
import BadgeCard from '@/components/BadgeCard'
import CategoryBadge from '@/components/CategoryBadge'
import StarRating from '@/components/StarRating'

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: 'Nie znaleziono – Sprawności ZHR' }]
  return [
    { title: `${loaderData.group.spec.name} – Sprawności ZHR` },
    { name: 'description', content: loaderData.group.spec.comment },
  ]
}

export async function loader({ params }: Route.LoaderArgs) {
  const group = await getGroupBySlug(params.groupSlug)
  if (!group) throw data(null, { status: 404 })
  return { group }
}

const STAR_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Jedna gwiazdka',
  2: 'Dwie gwiazdki',
  3: 'Trzy gwiazdki',
}

export default function GroupPage({ loaderData }: Route.ComponentProps) {
  const { group } = loaderData
  const { spec } = group

  const badgesByStars: Record<1 | 2 | 3, BadgeSpec[]> = {
    1: spec.badges.filter(b => b.stars === 1),
    2: spec.badges.filter(b => b.stars === 2),
    3: spec.badges.filter(b => b.stars === 3),
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 animate-fade-in">
      {/* Compact header - badges are the star */}
      <header className="mb-6 sticky top-0 z-40 bg-background/80 backdrop-blur-lg -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 border-b border-border/50">
        <div className="flex items-center gap-3 flex-wrap">
          <nav className="text-xs text-muted-foreground font-medium">
            <a href="/" className="hover:text-primary transition-colors">Start</a>
            <span className="mx-1.5 text-muted-foreground/40">/</span>
            <span className="text-foreground">{spec.name}</span>
          </nav>
          <div className="h-4 w-px bg-border mx-1" />
          <CategoryBadge category={group.category} size="sm" />
          <span className="text-xs text-muted-foreground font-medium ml-auto">
            {spec.badges.length} sprawności
          </span>
        </div>
      </header>

      {/* Badges grouped by star level - visual but compact */}
      {([1, 2, 3] as const).map((stars, i) =>
        badgesByStars[stars].length > 0 ? (
          <section
            key={stars}
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Minimal section header */}
            <div className="flex items-center gap-2 mb-3">
              <StarRating stars={stars} size="md" />
              <span className="text-sm font-bold text-foreground">
                {STAR_LABELS[stars]}
              </span>
              <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {badgesByStars[stars].length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {badgesByStars[stars].map((badge) => (
                <BadgeCard key={badge.id} badge={badge} group={group} />
              ))}
            </div>
          </section>
        ) : null
      )}

      {/* Info footer */}
      {spec.comment && (
        <footer className="mt-10 pt-6 border-t border-border">
          <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
            {spec.comment}
          </blockquote>
        </footer>
      )}
    </div>
  )
}
