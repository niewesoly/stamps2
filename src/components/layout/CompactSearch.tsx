import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import Fuse from 'fuse.js'
import type { BadgeGroup } from '@/data/types'
import { buildSearchIndex, type SearchResult, type SearchDocument } from '@/data/search'
import StarRating from '@/components/StarRating'

// Debounce helper for search
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

interface CompactSearchProps {
  groups: BadgeGroup[]
}

export default function CompactSearch({ groups }: CompactSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Build search index once
  const fuse = useMemo(() => buildSearchIndex(groups), [groups])

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((q: string, currentFuse: Fuse<SearchDocument>) => {
      if (q.trim().length < 2) {
        setResults([])
        return
      }
      const hits = currentFuse.search(q, { limit: 6 })
      setResults(hits.map(h => h.item.result))
      setSelectedIndex(-1)
    }, 150),
    []
  )

  const handleSelect = (r: SearchResult) => {
    navigate(r.type === 'group' ? `/${r.groupSlug}` : `/sprawnosc/${r.badgeSlug}`)
    setOpen(false)
    setQuery('')
    setResults([])
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = selectedIndex >= 0 && selectedIndex < results.length
        ? results[selectedIndex]
        : (results.length > 0 ? results[0] : null)
      if (selected) handleSelect(selected)
    }
  }

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
        onChange={(e) => { setQuery(e.target.value); debouncedSearch(e.target.value, fuse); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Szukaj sprawności..."
        aria-label="Szukaj sprawności"
        className="w-full bg-muted/40 text-foreground placeholder:text-muted-foreground/50 rounded-full pl-9 pr-4 py-1.5 text-xs font-medium border border-border/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:bg-muted/60 transition-all"
      />

      {open && results.length > 0 && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 min-w-[340px] bg-card/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-border/50 overflow-hidden z-[60] max-h-[50vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {results.map((r, i) => {
            const isSelected = selectedIndex === i
            const key = r.type === 'badge' ? `badge-${r.badgeSlug}` : `group-${r.groupSlug}`
            return (
              <a
                key={key}
                href={r.type === 'group' ? `/${r.groupSlug}` : `/sprawnosc/${r.badgeSlug}`}
                onClick={(e) => { e.preventDefault(); handleSelect(r) }}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-border/20 last:border-0 ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-muted/60'
                }`}
              >
                {r.iconUrl && (
                  <div className={`w-9 h-9 shrink-0 rounded-lg border flex items-center justify-center p-1 transition-colors ${
                    isSelected ? 'bg-primary/20 border-primary/30' : 'bg-primary/5 border-primary/10'
                  }`}>
                    <img src={r.iconUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-foreground leading-tight truncate">
                    {r.badgeName || r.groupName}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground truncate">
                      {r.type === 'badge' ? r.groupName : 'Grupa'}
                    </span>
                    {r.stars && <StarRating stars={r.stars} size="sm" />}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 min-w-[280px] bg-card/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-border/50 px-4 py-6 text-center text-xs text-muted-foreground z-[60] animate-in fade-in slide-in-from-top-2">
          Brak wyników dla „<span className="text-foreground font-bold">{query}</span>"
        </div>
      )}
    </div>
  )
}
