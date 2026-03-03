// import type { Route } from './+types/home'
import { fetchBadgeGroups } from '../../src/data/api'
import { CATEGORY_NAMES, CATEGORY_ICONS, type BadgeGroup } from '../../src/data/types'
import SearchBar from '../../src/components/SearchBar'
import CategoryBadge from '../../src/components/CategoryBadge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../src/components/ui/card'
import { Badge } from '../../src/components/ui/badge'

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Sprawności ZHR – książeczka sprawności harcerskich' },
    {
      name: 'description',
      content: 'Przeglądaj wszystkie sprawności ZHR, ucz się wymagań i planuj swój szlak.',
    },
  ]
}

export async function loader() {
  const groups = await fetchBadgeGroups()
  return { groups }
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { groups } = loaderData

  const byCategory = groups.reduce((acc: Record<number, BadgeGroup[]>, g: BadgeGroup) => {
    if (!acc[g.category]) acc[g.category] = []
    acc[g.category].push(g)
    return acc
  }, {})

  const categories = ([1, 2, 3, 4] as const).filter(c => byCategory[c]?.length)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative z-10 bg-forest-950 bg-scout-pattern text-white">
        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,46,22,0.8) 100%)',
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center animate-fade-in">
          {/* Ornamental emblem */}
          <div className="flex justify-center mb-8">
            <div
              className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-forest-800/50 border border-forest-600/30 backdrop-blur-sm"
            >
              <svg
                width="36"
                height="42"
                viewBox="0 0 28 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
                aria-hidden="true"
              >
                <path d="M14 2C14 2 10 6 10 10C10 12.5 11.5 14.5 14 15C16.5 14.5 18 12.5 18 10C18 6 14 2 14 2Z" fill="currentColor" />
                <path d="M14 15C14 15 8 14 5 18C3 21 4 24 7 25C9 25.8 11 25 12 23.5C12 23.5 11 27 9 28.5C11 29.5 14 30 14 30C14 30 17 29.5 19 28.5C17 27 16 23.5 16 23.5C17 25 19 25.8 21 25C24 24 25 21 23 18C20 14 14 15 14 15Z" fill="currentColor" />
                <path d="M8 15C8 15 4 13 2 16C0.5 18 1.5 20 3 20.5C4.5 21 6 20 7 18.5L8 15Z" fill="currentColor" opacity="0.7" />
                <path d="M20 15C20 15 24 13 26 16C27.5 18 26.5 20 25 20.5C23.5 21 22 20 21 18.5L20 15Z" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Sprawności ZHR<br />
            <span className="text-forest-400">Książeczka Wirtualna</span>
          </h1>

          <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Odkryj wszystkie sprawności ZHR. Przeglądaj wymagania, poznaj szlak od jednej do trzech gwiazdek i planuj swój harcerski rozwój.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <SearchBar groups={groups} />
          </div>

          {/* Stats row */}
          <div className="mt-10 flex items-center justify-center gap-8 text-white/50 text-sm font-medium">
            <span>{groups.length} grup</span>
            <span className="w-px h-4 bg-white/20" />
            <span>{groups.reduce((s: number, g: BadgeGroup) => s + g.spec.badges.length, 0)} sprawności</span>
            <span className="w-px h-4 bg-white/20" />
            <span>4 kategorie</span>
          </div>
        </div>
      </section>

      {/* ── Category sections ────────────────────────────── */}
      {categories.map((cat, catIdx) => (
        <section
          key={cat}
          className="mx-auto max-w-6xl px-6 py-14 animate-fade-in-up"
          style={{ animationDelay: `${catIdx * 0.08}s` }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="text-2xl bg-muted p-2 rounded-xl text-primary leading-none">{CATEGORY_ICONS[cat]}</span>
              {CATEGORY_NAMES[cat]}
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {byCategory[cat].map((group: BadgeGroup) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      ))}

      {/* Bottom ornament */}
      <div className="pb-12 text-center text-muted-foreground/50 text-xl font-bold select-none">
        ···
      </div>
    </div>
  )
}

function GroupCard({ group }: { group: BadgeGroup }) {
  return (
    <a
      href={`/${group.slug}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
              {group.spec.name}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 text-xs font-medium">
              {group.spec.badges.length}&nbsp;spraw.
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic mb-4">
            „{group.spec.comment}"
          </p>

          <div className="flex flex-wrap gap-1.5">
            {group.spec.keywords.slice(0, 4).map(kw => (
              <span
                key={kw}
                className="text-[0.68rem] font-medium bg-muted text-muted-foreground rounded-md px-2 py-0.5"
              >
                {kw}
              </span>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          <CategoryBadge category={group.category} size="sm" />
          <span className="text-muted-foreground/50 text-xs font-bold group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 duration-200" aria-hidden>
            →
          </span>
        </CardFooter>
      </Card>
    </a>
  )
}
