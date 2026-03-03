import { data, Link } from 'react-router'
import type { Route } from './+types/badge'
import { getBadgeBySlug } from '../../src/data/api'
import StarRating from '../../src/components/StarRating'
import CategoryBadge from '../../src/components/CategoryBadge'
import { Card, CardContent } from '../../src/components/ui/card'
import { Badge } from '../../src/components/ui/badge'

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: 'Nie znaleziono – Sprawności ZHR' }]
  return [
    { title: `${loaderData.badge.name} – ${loaderData.group.spec.name} – Sprawności ZHR` },
    { name: 'description', content: loaderData.badge.requirements[0] ?? '' },
  ]
}

export async function loader({ params }: Route.LoaderArgs) {
  const result = await getBadgeBySlug(params.badgeSlug)
  if (!result) throw data(null, { status: 404 })

  const { badge, group } = result
  const prerequisite =
    badge.basedOn.length > 0
      ? (group.spec.badges.find((b: { id: string }) => b.id === badge.basedOn[0]) ?? null)
      : null

  return { badge, group, prerequisite }
}

const LEVEL_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Poziom podstawowy',
  2: 'Poziom średni',
  3: 'Poziom zaawansowany',
}

export default function BadgePage({ loaderData }: Route.ComponentProps) {
  const { badge, group, prerequisite } = loaderData

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 animate-fade-in">

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2 flex-wrap font-medium">
        <Link to="/" className="hover:text-primary transition-colors py-2 px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
          Strona główna
        </Link>
        <span className="text-muted-foreground/50" aria-hidden="true">›</span>
        <Link to={`/${group.slug}`} className="hover:text-primary transition-colors py-2 px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
          {group.spec.name}
        </Link>
        <span className="text-muted-foreground/50" aria-hidden="true">›</span>
        <span className="text-foreground">{badge.name}</span>
      </nav>

      {/* Badge header card */}
      <Card className="mb-8 overflow-hidden border-primary/10 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Icon */}
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-primary/10 border border-primary/20">
                {badge.iconUrl ? (
                  <img
                    src={badge.iconUrl}
                    alt={badge.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
                  />
                ) : (
                  <svg width="40" height="46" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/60" aria-hidden="true">
                    <path d="M14 2C14 2 10 6 10 10C10 12.5 11.5 14.5 14 15C16.5 14.5 18 12.5 18 10C18 6 14 2 14 2Z" fill="currentColor" />
                    <path d="M14 15C14 15 8 14 5 18C3 21 4 24 7 25C9 25.8 11 25 12 23.5C12 23.5 11 27 9 28.5C11 29.5 14 30 14 30C14 30 17 29.5 19 28.5C17 27 16 23.5 16 23.5C17 25 19 25.8 21 25C24 24 25 21 23 18C20 14 14 15 14 15Z" fill="currentColor" />
                    <path d="M8 15C8 15 4 13 2 16C0.5 18 1.5 20 3 20.5C4.5 21 6 20 7 18.5L8 15Z" fill="currentColor" opacity="0.6" />
                    <path d="M20 15C20 15 24 13 26 16C27.5 18 26.5 20 25 20.5C23.5 21 22 20 21 18.5L20 15Z" fill="currentColor" opacity="0.6" />
                  </svg>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 flex-wrap">
                <CategoryBadge category={group.category} size="sm" />
                <Badge variant="secondary" className="text-xs font-medium">
                  {group.spec.name}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                {badge.name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-3 bg-muted/50 w-fit sm:mx-0 mx-auto px-4 py-2 rounded-lg">
                <StarRating stars={badge.stars} size="lg" />
                <span className="text-muted-foreground text-sm font-medium">
                  {LEVEL_LABELS[badge.stars as 1 | 2 | 3]}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prerequisite */}
      {prerequisite && (
        <div className="mb-8 px-5 py-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/50 flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider shrink-0">
            Wymagana wcześniej
          </span>
          <span className="hidden sm:block w-px h-5 bg-orange-200 dark:bg-orange-900 shrink-0" />
          <Link
            to={`/sprawnosc/${prerequisite.slug}`}
            className="text-foreground hover:text-primary font-medium flex items-center gap-2 transition-colors w-fit p-1 min-h-[44px] rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
          >
            {prerequisite.iconUrl && (
              <img src={prerequisite.iconUrl} alt="" className="w-5 h-5 object-contain" />
            )}
            <span className="font-semibold px-1">{prerequisite.name}</span>
            <StarRating stars={prerequisite.stars} size="sm" />
          </Link>
        </div>
      )}

      {/* Requirements */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          Wymagania do zdobycia sprawności
          <span className="flex-1 h-px bg-border" />
        </h2>
        <ol className="space-y-3">
          {badge.requirements.map((req: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl bg-card border shadow-sm transition-colors hover:border-primary/30"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                {i + 1}
              </span>
              <p className="text-foreground/90 leading-relaxed">
                {req}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Other badges in group */}
      <section className="pt-8 border-t">
        <h3 className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-5">
          Pozostałe sprawności · {group.spec.name}
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {group.spec.badges
            .filter((b: { id: string }) => b.id !== badge.id)
            .map((b: { id: string; slug: string; name: string; stars: 1 | 2 | 3 }) => (
              <Link
                key={b.id}
                to={`/sprawnosc/${b.slug}`}
                className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-lg bg-card hover:bg-muted text-foreground transition-all border shadow-sm hover:shadow hover:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background font-medium text-sm"
              >
                {b.name}
                <StarRating stars={b.stars} size="sm" />
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
