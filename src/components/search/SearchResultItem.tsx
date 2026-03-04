import StarRating from '@/components/StarRating'
import CategoryBadge from '@/components/CategoryBadge'
import type { SearchResult } from '@/data/search'
import { buildIconUrl } from '@/data/api'

interface SearchResultItemProps {
  result: SearchResult
  index: number
  selectedIndex: number
  variant?: 'compact' | 'expanded'
  onSelect: (result: SearchResult) => void
  onHover: (index: number) => void
}

export function SearchResultItem({
  result,
  index,
  selectedIndex,
  variant = 'compact',
  onSelect,
  onHover,
}: SearchResultItemProps) {
  const iconUrl = result.iconId ? buildIconUrl(result.iconId) : null
  const isSelected = selectedIndex === index
  const key = result.type === 'badge' ? `badge-${result.badgeSlug}` : `group-${result.groupSlug}`
  const href = result.type === 'group' ? `/${result.groupSlug}` : `/sprawnosc/${result.badgeSlug}`

  const baseClasses = variant === 'compact'
    ? 'flex items-center gap-3 px-4 py-3 transition-colors border-b border-border/20 last:border-0'
    : 'flex items-center gap-4 px-4 py-4 hover:bg-muted/40 active:bg-muted/60 transition-colors'

  const selectedClasses = variant === 'compact'
    ? isSelected ? 'bg-primary/10' : 'hover:bg-muted/60'
    : ''

  return (
    <a
      key={key}
      href={href}
      onClick={(e) => { e.preventDefault(); onSelect(result) }}
      onMouseEnter={() => onHover(index)}
      className={`${baseClasses} ${selectedClasses}`}
    >
      {iconUrl && (
        <div className={`
          ${variant === 'compact' ? 'w-9 h-9 rounded-full' : 'w-12 h-12 rounded-full'}
          shrink-0 border flex items-center justify-center p-1.5 transition-colors
          ${isSelected
            ? variant === 'compact' ? 'bg-primary/20 border-primary/30' : 'bg-primary/10 border-primary/20'
            : variant === 'compact' ? 'bg-primary/5 border-primary/10' : 'bg-primary/5 border-primary/10'
          }
        `}>
          <img src={result.iconUrl} alt="" className="w-full h-full object-contain" loading="lazy" decoding="async" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className={`font-bold text-foreground leading-tight ${variant === 'compact' ? 'text-sm' : 'text-base'
          }`}>
          {result.badgeName || result.groupName}
        </div>
        <div className={`text-sm mt-0.5 ${variant === 'compact' ? 'text-[11px] text-muted-foreground truncate' : 'text-muted-foreground'
          }`}>
          {result.type === 'badge' ? result.groupName : 'Grupa sprawności'}
        </div>
        {variant === 'expanded' && (
          <div className="flex items-center gap-2 mt-1">
            {result.category && (
              <CategoryBadge category={result.category} size="sm" />
            )}
            {result.stars && <StarRating stars={result.stars} size="sm" />}
          </div>
        )}
        {variant === 'compact' && (
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-muted-foreground truncate">
              {result.type === 'badge' ? result.groupName : 'Grupa'}
            </span>
            {result.stars && <StarRating stars={result.stars} size="sm" />}
          </div>
        )}
      </div>
    </a>
  )
}
