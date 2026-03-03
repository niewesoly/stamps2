import type { Route } from './+types/home'
import { fetchBadgeGroups, getCategoryName, getCategoryIcon, getSortedCategoryIds } from '@/data/api'
import { type BadgeGroup } from '@/data/types'
import SearchBar from '@/components/SearchBar'
import CategoryBadge from '@/components/CategoryBadge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function meta() {
  return [
    { title: 'Stamps – Odkryj swój szlak' },
    {
      name: 'description',
      content: 'Przeglądaj sprawności, ucz się wymagań i planuj swój harcerski rozwój z aplikacją Stamps.',
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

  // Get unique categories sorted by their ordinal from API
  const categoryIds = Object.keys(byCategory).map(Number)
  const categories = getSortedCategoryIds(categoryIds)

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

        <div className="relative mx-auto max-w-3xl px-6 py-12 text-center animate-fade-in">
          {/* Ornamental emblem (smaller) */}
          <div className="flex justify-center mb-6">
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-forest-800/50 border border-forest-600/30 backdrop-blur-sm transition-transform hover:scale-105"
            >
              <svg
                width="24"
                height="28"
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

          <h1 className="text-3xl sm:text-4xl font-bold mb-8 leading-tight tracking-tight">
            Narzędzie puszczańskie
          </h1>

          {/* Search (Emphasized) */}
          <div className="max-w-xl mx-auto mb-6 transform transition-all relative z-50">
            <SearchBar groups={groups} />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-white/50 text-xs font-medium">
            <span>{groups.length} grup</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{groups.reduce((s: number, g: BadgeGroup) => s + g.spec.badges.length, 0)} sprawności</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{categories.length} kategorie</span>
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
              <span className="text-2xl bg-muted p-2 rounded-xl text-primary leading-none">{getCategoryIcon(cat)}</span>
              {getCategoryName(cat)}
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
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 bg-card/80 backdrop-blur-xl border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <CardHeader className="pb-3 pt-5">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors duration-300">
                {group.spec.name}
              </CardTitle>
              <Badge variant="secondary" className="shrink-0 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                {group.spec.badges.length}&nbsp;spraw.
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pb-5">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic mb-5">
              „{group.spec.comment}"
            </p>

            <div className="flex flex-wrap gap-2">
              {group.spec.keywords.slice(0, 4).map(kw => (
                <span
                  key={kw}
                  className="text-[0.7rem] font-medium bg-muted/60 text-muted-foreground rounded-md px-2.5 py-1 backdrop-blur-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pt-0 flex items-center justify-between pb-5">
            <CategoryBadge category={group.category} size="sm" />
            <span className="text-muted-foreground/40 text-sm font-bold group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1.5 duration-300" aria-hidden>
              →
            </span>
          </CardFooter>
        </div>
      </Card>
    </a>
  )
}
