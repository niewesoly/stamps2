import type { BadgeSpec, BadgeGroup } from '@/data/types'
import StarRating from './StarRating'

interface Props {
  badge: BadgeSpec
  group: BadgeGroup
}

export default function BadgeCard({ badge, group }: Props) {
  return (
    <a
      href={`/sprawnosc/${badge.slug}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="h-full bg-card rounded-xl border p-4 flex items-start gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/10 group-hover:bg-primary/15 transition-colors">
            {badge.iconUrl ? (
              <img
                src={badge.iconUrl}
                alt={badge.name}
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
            ) : (
              <svg width="20" height="23" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/60" aria-hidden="true">
                <path d="M14 2C14 2 10 6 10 10C10 12.5 11.5 14.5 14 15C16.5 14.5 18 12.5 18 10C18 6 14 2 14 2Z" fill="currentColor" />
                <path d="M14 15C14 15 8 14 5 18C3 21 4 24 7 25C9 25.8 11 25 12 23.5C12 23.5 11 27 9 28.5C11 29.5 14 30 14 30C14 30 17 29.5 19 28.5C17 27 16 23.5 16 23.5C17 25 19 25.8 21 25C24 24 25 21 23 18C20 14 14 15 14 15Z" fill="currentColor" />
              </svg>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2 mb-1.5">
            <h3 className="text-[0.95rem] font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {badge.name}
            </h3>
            <span className="shrink-0 mt-0.5">
              <StarRating stars={badge.stars} size="sm" />
            </span>
          </div>

          {badge.requirements[0] && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-2.5">
              {badge.requirements[0]}
            </p>
          )}

          <p className="text-[0.68rem] font-semibold text-muted-foreground uppercase tracking-widest">
            {group.spec.name}
          </p>
        </div>
      </div>
    </a>
  )
}
