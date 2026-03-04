import { useRef, useState } from 'react'
import { Search } from 'lucide-react'
import type { BadgeGroup } from '@/data/types'
import { useSearch } from '@/hooks/useSearch'
import { SearchResults, SearchNoResults } from '@/components/search'

interface CompactSearchProps {
  groups: BadgeGroup[]
}

export default function CompactSearch({ groups }: CompactSearchProps) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleSelect,
  } = useSearch({ groups, limit: 6, onClose: () => setOpen(false) })

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Szukaj sprawności..."
        aria-label="Szukaj sprawności"
        className="w-full bg-muted/40 text-foreground placeholder:text-muted-foreground/50 rounded-full pl-9 pr-4 py-1.5 text-xs font-medium border border-border/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:bg-muted/60 transition-all"
      />

      {open && results.length > 0 && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 min-w-[340px] bg-card/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-border/50 overflow-hidden z-[60] max-h-[50vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <SearchResults
            results={results}
            selectedIndex={selectedIndex}
            variant="compact"
            onSelect={handleSelect}
            onHover={setSelectedIndex}
          />
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <SearchNoResults query={query} variant="compact" />
      )}
    </div>
  )
}
