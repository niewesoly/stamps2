import type { Route } from './+types/home'
import { fetchBadgeGroups, getCategoryName, getCategoryIcon, getSortedCategoryIds } from '@/data/api'
import { type BadgeGroup } from '@/data/types'
import { buildBadgeTree } from '@/data/tree-utils'
import SearchBar from '@/components/SearchBar'
import CategoryBadge from '@/components/CategoryBadge'
import { BadgeTree } from '@/components/BadgeTree'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMemo } from 'react'

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

  const categoryIds = Object.keys(byCategory).map(Number)
  const categories = getSortedCategoryIds(categoryIds)

  return (
    <div>
      <section className="relative z-10 bg-forest-950 bg-scout-pattern text-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,46,22,0.8) 100%)',
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6 py-12 text-center animate-fade-in">
          <h1 className="sr-only">Stamps - Wyszukiwarka sprawności</h1>

          <div className="flex justify-center mb-8">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md shadow-2xl transition-transform hover:scale-105 duration-500">
              <img
                src="/stamps-logo.png"
                alt="Stamps Logo"
                className="w-full h-full object-cover scale-[1.3]"
              />
            </div>
          </div>

          <div className="max-w-xl mx-auto mb-6 transform transition-all relative z-50">
            <SearchBar groups={groups} />
          </div>

          <div className="flex items-center justify-center gap-6 text-white/50 text-xs font-medium">
            <span>{groups.length} grup</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{groups.reduce((s: number, g: BadgeGroup) => s + g.spec.badges.length, 0)} sprawności</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{categories.length} kategorie</span>
          </div>
        </div>
      </section>

      {categories.map((cat, catIdx) => (
        <section
          key={cat}
          className="mx-auto max-w-6xl px-6 py-14 animate-fade-in-up"
          style={{ animationDelay: `${catIdx * 0.08}s` }}
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="text-2xl bg-muted p-2 rounded-xl text-primary leading-none">{getCategoryIcon(cat)}</span>
              {getCategoryName(cat)}
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {byCategory[cat].map((group: BadgeGroup) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      ))}

      <div className="pb-12 text-center text-muted-foreground/50 text-xl font-bold select-none">
        ···
      </div>
    </div>
  )
}

function GroupCard({ group }: { group: BadgeGroup }) {
  const treeData = useMemo(() => buildBadgeTree(group.spec.badges), [group.spec.badges])
  const badgeCount = group.spec.badges.length

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
              "{group.spec.comment}"
            </p>

            <div className="flex justify-center w-full mt-8 overflow-hidden">
              <BadgeTree treeData={treeData} badgeCount={badgeCount} />
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
