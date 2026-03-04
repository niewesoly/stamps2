import type { SearchResult } from '@/data/search'
import { SearchResultItem } from './SearchResultItem'

interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  variant?: 'compact' | 'expanded'
  onSelect: (result: SearchResult) => void
  onHover: (index: number) => void
}

export function SearchResults({
  results,
  selectedIndex,
  variant = 'compact',
  onSelect,
  onHover,
}: SearchResultsProps) {
  if (results.length === 0) return null

  return (
    <div className={variant === 'compact' ? '' : 'divide-y divide-border/20'}>
      {results.map((result, index) => (
        <SearchResultItem
          key={result.type === 'badge' ? `badge-${result.badgeSlug}` : `group-${result.groupSlug}`}
          result={result}
          index={index}
          selectedIndex={selectedIndex}
          variant={variant}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </div>
  )
}
