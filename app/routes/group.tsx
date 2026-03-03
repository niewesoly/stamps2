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

const STAR_SUBLABELS: Record<1 | 2 | 3, string> = {
  1: 'Poziom podstawowy',
  2: 'Poziom średni',
  3: 'Poziom zaawansowany',
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
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in">

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2 flex-wrap font-medium">
        <a href="/" className="hover:text-primary transition-colors py-2 px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
          Strona główna
        </a>
        <span className="text-muted-foreground/50" aria-hidden="true">›</span>
        <span className="text-foreground">{spec.name}</span>
      </nav>

      {/* Group header */}
      <header className="mb-10">
        <div className="flex items-start gap-4 mb-4 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {spec.name}
          </h1>
          <div className="mt-1">
            <CategoryBadge category={group.category} />
          </div>
        </div>

        {/* Decorative rule */}
        <div className="h-px bg-border mb-6" />

        <blockquote className="text-muted-foreground italic leading-relaxed pl-4 border-l-4 border-primary/30 text-lg">
          {spec.comment}
        </blockquote>

        {/* Keywords */}
        <div className="mt-6 flex flex-wrap gap-2">
          {spec.keywords.map((kw: string) => (
            <span
              key={kw}
              className="text-xs font-semibold bg-muted text-muted-foreground rounded-md px-2.5 py-1 tracking-wide"
            >
              {kw}
            </span>
          ))}
        </div>
      </header>

      {/* Badges grouped by star level */}
      {([1, 2, 3] as const).map((stars, i) =>
        badgesByStars[stars].length > 0 ? (
          <section
            key={stars}
            className="mb-10 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Level header */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating stars={stars} size="lg" />
              <div>
                <span className="text-foreground font-bold text-lg tracking-tight">
                  {STAR_LABELS[stars]}
                </span>
                <span className="ml-2 text-muted-foreground text-sm font-medium">
                  · {STAR_SUBLABELS[stars]}
                </span>
              </div>
              <span className="ml-auto text-sm font-bold bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">
                {badgesByStars[stars].length}
              </span>
            </div>
            <div className="h-px bg-border mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
              {badgesByStars[stars].map((badge) => (
                <BadgeCard key={badge.id} badge={badge} group={group} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  )
}
