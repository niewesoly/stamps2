import { data } from 'react-router'
import type { Route } from './+types/group'
import { getGroupBySlug } from '@/data/api'
import type { BadgeSpec } from '@/data/types'
import BadgeCard from '@/components/BadgeCard'
import CategoryBadge from '@/components/CategoryBadge'
import { Badge } from '@/components/ui/badge'
import StarRating from '@/components/StarRating'
import { buildBadgeTree } from '@/data/tree-utils'
import { BadgeTree } from '@/components/BadgeTree'
import { useMemo } from 'react'

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: 'Nie znaleziono – Sprawności ZHR' }]

  const title = `${loaderData.group.spec.name} – Sprawności ZHR`
  const description = loaderData.group.spec.comment

  return [
    { title },
    { name: 'description', content: description },
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: '/og-image.png' },
    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: '/og-image.png' },
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
    1: spec.badges.filter((b: BadgeSpec) => b.stars === 1),
    2: spec.badges.filter((b: BadgeSpec) => b.stars === 2),
    3: spec.badges.filter((b: BadgeSpec) => b.stars === 3),
  }

  const treeData = useMemo(() => buildBadgeTree(spec.badges), [spec.badges])
  const badgeCount = spec.badges.length

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 animate-fade-in">
      {/* Header with Title and Breadcrumbs */}
      <header className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <nav className="text-xs text-muted-foreground font-medium">
            <a href="/" className="hover:text-primary transition-colors">Start</a>
            <span className="mx-2 text-muted-foreground/40">/</span>
            <span className="text-foreground">{spec.name}</span>
          </nav>
          <div className="h-4 w-px bg-border mx-1" />
          <CategoryBadge category={group.category} size="sm" />
          <span className="text-xs text-muted-foreground font-medium ml-auto">
            {spec.badges.length} sprawności
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          {spec.name}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-10 mb-10">
        {/* Group Description / Comment & Keywords (Left Column on Desktop, 2/3 width) */}
        <section className="col-span-1 md:col-span-2 flex flex-col justify-start">
          {spec.comment ? (
            <div className="bg-muted/30 rounded-3xl p-6 border border-border/50 h-full">
              <h2 className="text-sm font-semibold text-foreground/80 mb-3 uppercase tracking-wider">O grupie</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {spec.comment}
              </p>

              {spec.keywords && spec.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {spec.keywords.map((kw: string, idx: number) => (
                    <Badge key={`${kw}-${idx}`} variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-muted/60 text-muted-foreground hover:bg-muted/80">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:block" />
          )}
        </section>

        {/* Tree View (Right Column on Desktop, 1/3 width) */}
        <section className="col-span-1 md:col-span-1 px-4 py-8 bg-card/40 rounded-3xl border border-border/50 animate-fade-in flex flex-col items-center min-w-0">
          <h2 className="text-lg font-bold text-foreground mb-6 text-center">Ścieżka rozwoju</h2>
          <div className="w-full flex justify-center">
            <BadgeTree treeData={treeData} badgeCount={badgeCount} variant="full" />
          </div>
        </section>
      </div>

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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
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
