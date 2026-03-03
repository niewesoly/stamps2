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
      className="group block h-full"
    >
      <div className="h-full relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:bg-card/80">
        {/* Header: Icon + Stars */}
        <div className="flex items-start gap-3 mb-3">
          {/* Larger, prominent icon */}
          <div className="shrink-0">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 group-hover:scale-105 group-hover:border-primary/40 transition-all duration-300 shadow-sm">
              {badge.iconUrl ? (
                <img
                  src={badge.iconUrl}
                  alt={badge.name}
                  className="w-9 h-9 object-contain"
                  loading="lazy"
                />
              ) : (
                <svg width="24" height="28" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/60" aria-hidden="true">
                  <path d="M14 2C14 2 10 6 10 10C10 12.5 11.5 14.5 14 15C16.5 14.5 18 12.5 18 10C18 6 14 2 14 2Z" fill="currentColor" />
                  <path d="M14 15C14 15 8 14 5 18C3 21 4 24 7 25C9 25.8 11 25 12 23.5C12 23.5 11 27 9 28.5C11 29.5 14 30 14 30C14 30 17 29.5 19 28.5C17 27 16 23.5 16 23.5C17 25 19 25.8 21 25C24 24 25 21 23 18C20 14 14 15 14 15Z" fill="currentColor" />
                </svg>
              )}
            </div>
          </div>

          {/* Stars badge */}
          <div className="ml-auto">
            <StarRating stars={badge.stars} size="md" />
          </div>
        </div>

        {/* Badge name - prominent */}
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
          {badge.name}
        </h3>

        {/* First requirement preview */}
        {badge.requirements[0] && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {badge.requirements[0]}
          </p>
        )}

        {/* Footer: Group name */}
        <div className="pt-3 mt-3 border-t border-border/40">
          <p className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wider">
            {group.spec.name}
          </p>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      </div>
    </a>
  )
}
