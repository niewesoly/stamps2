import type { Route } from './+types/home'
import { fetchBadgeGroups, getCategoryName, getCategoryIcon, getSortedCategoryIds } from '@/data/api'
import { type BadgeGroup, type BadgeSpec } from '@/data/types'
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
          {/* Hidden H1 for SEO/Accessibility */}
          <h1 className="sr-only">Stamps - Wyszukiwarka sprawności</h1>

          {/* Hero Logo */}
          <div className="flex justify-center mb-8">
            <div
              className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md shadow-2xl transition-transform hover:scale-105 duration-500"
            >
              <img
                src="/stamps-logo.png"
                alt="Stamps Logo"
                className="w-full h-full object-cover scale-[1.3]"
              />
            </div>
          </div>

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

          <CardContent className="pb-5 relative">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic mb-5">
              „{group.spec.comment}"
            </p>

            <div className="flex flex-col items-center w-full mt-4">
              {/* Group badges by stars */}
              {Object.entries(
                group.spec.badges.reduce((acc, badge) => {
                  if (!acc[badge.stars]) acc[badge.stars] = []
                  acc[badge.stars].push(badge)
                  return acc
                }, {} as Record<number, BadgeSpec[]>)
              ).map(([stars, tierBadges], idx, arr) => (
                <div key={stars} className="flex flex-col items-center w-full">
                  {/* Tier Row */}
                  <div className="flex flex-row justify-center gap-4 shrink-0 w-full relative z-10">
                    {tierBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="relative flex flex-col items-center group/badge cursor-default"
                      >
                        <div className="w-12 h-12 rounded-full border-[1.5px] border-border/80 bg-background/50 flex items-center justify-center p-1.5 shadow-sm group-hover/badge:border-primary/40 group-hover/badge:bg-primary/5 group-hover/badge:shadow-md transition-all duration-300">
                          {badge.iconUrl ? (
                            <img
                              src={badge.iconUrl}
                              alt={badge.name}
                              className="w-full h-full object-contain filter group-hover/badge:brightness-110 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                            />
                          ) : (
                            <span className="text-[0.65rem] font-bold text-muted-foreground/40">{badge.stars}*</span>
                          )}
                        </div>

                        {/* Name tooltip */}
                        <span className="absolute -bottom-7 opacity-0 group-hover/badge:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-xl z-20 pointer-events-none translate-y-1 group-hover/badge:translate-y-0">
                          {badge.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Connecting Line to next tier (Vertical) */}
                  {idx < arr.length - 1 && (
                    <div className="h-4 w-0.5 my-1 bg-border/50 transition-colors duration-500 rounded-full" />
                  )}
                </div>
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
