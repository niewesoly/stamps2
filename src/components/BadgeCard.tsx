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
      <div className="h-full relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:bg-card/80 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        {/* Left Side: Prominent Icon */}
        <div className="shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-linear-to-br from-primary/15 to-primary/5 border border-primary/20 group-hover:scale-105 group-hover:border-primary/40 transition-all duration-300 shadow-sm overflow-hidden p-2">
            {badge.iconUrl ? (
              <img
                src={badge.iconUrl}
                alt={badge.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <svg width="32" height="38" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/60 w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true">
                <path d="M14 2C14 2 10 6 10 10C10 12.5 11.5 14.5 14 15C16.5 14.5 18 12.5 18 10C18 6 14 2 14 2Z" fill="currentColor" />
                <path d="M14 15C14 15 8 14 5 18C3 21 4 24 7 25C9 25.8 11 25 12 23.5C12 23.5 11 27 9 28.5C11 29.5 14 30 14 30C14 30 17 29.5 19 28.5C17 27 16 23.5 16 23.5C17 25 19 25.8 21 25C24 24 25 21 23 18C20 14 14 15 14 15Z" fill="currentColor" />
              </svg>
            )}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">
                {group.spec.name}
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                {badge.name}
              </h3>
            </div>
            {/* Stars badge */}
            <div className="shrink-0 mt-1 sm:mt-0">
              <StarRating stars={badge.stars} size="md" />
            </div>
          </div>

          {/* All Requirements */}
          <div className="bg-background/40 rounded-xl p-4 border border-border/40 group-hover:bg-background/60 transition-colors">
            {badge.requirements.length > 0 && (
              <ul className="text-sm text-foreground/90 leading-relaxed space-y-2 list-none">
                {badge.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="text-primary/70 shrink-0 select-none mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-2xl" />
      </div>
    </a>
  )
}
