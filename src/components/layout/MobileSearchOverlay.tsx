import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Search, X } from 'lucide-react'
import Fuse from 'fuse.js'
import type { BadgeGroup } from '@/data/types'
import { buildSearchIndex, type SearchResult, type SearchDocument } from '@/data/search'
import CategoryBadge from '@/components/CategoryBadge'
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

interface MobileSearchOverlayProps {
  groups: BadgeGroup[]
  onClose: () => void
}

export default function MobileSearchOverlay({ groups, onClose }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)

  // Build search index once
  const fuse = useMemo(() => buildSearchIndex(groups), [groups])

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((q: string, currentFuse: Fuse<SearchDocument>) => {
      if (q.trim().length < 2) {
        setResults([])
        return
      }
      const hits = currentFuse.search(q, { limit: 8 })
      setResults(hits.map(h => h.item.result))
    }, 150),
    []
  )

  useEffect(() => {
    // Auto-focus the input with proper cleanup
    const timerId = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timerId)
  }, [])

  // Focus trap and escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previouslyFocused = document.activeElement as HTMLElement

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  const handleSelect = (r: SearchResult) => {
    navigate(r.type === 'group' ? `/${r.groupSlug}` : `/sprawnosc/${r.badgeSlug}`)
    onClose()
  }

  return (
    <div
      ref={contentRef}
      className="sm:hidden fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Wyszukiwanie sprawności"
    >
      {/* Search header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-border/30">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); debouncedSearch(e.target.value, fuse) }}
            placeholder="Szukaj sprawności..."
            aria-label="Szukaj sprawności"
            className="w-full bg-muted/50 text-foreground placeholder:text-muted-foreground/50 rounded-xl pl-10 pr-4 py-3 text-base font-medium border border-border/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
          />
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
          aria-label="Zamknij wyszukiwanie"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto pb-20">
        {results.length > 0 && (
          <div className="divide-y divide-border/20">
            {results.map((r) => {
              const key = r.type === 'badge' ? `badge-${r.badgeSlug}` : `group-${r.groupSlug}`
              return (
                <a
                  key={key}
                  href={r.type === 'group' ? `/${r.groupSlug}` : `/sprawnosc/${r.badgeSlug}`}
                  onClick={(e) => { e.preventDefault(); handleSelect(r) }}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 active:bg-muted/60 transition-colors"
                >
                  {r.iconUrl && (
                    <div className="w-12 h-12 shrink-0 rounded-xl border bg-primary/5 border-primary/10 flex items-center justify-center p-1.5">
                      <img src={r.iconUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-base text-foreground leading-tight">
                      {r.badgeName || r.groupName}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {r.type === 'badge' ? r.groupName : 'Grupa sprawności'}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={r.category} size="sm" />
                      {r.stars && <StarRating stars={r.stars} size="sm" />}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-muted-foreground text-sm">
              Nie znaleźliśmy sprawności pasującej do „<span className="text-foreground font-bold">{query}</span>".
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              Spróbuj krótszy fragment nazwy.
            </p>
          </div>
        )}

        {query.length < 2 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="text-4xl mb-3">⚜️</div>
            <p className="text-muted-foreground text-sm">
              Wpisz co najmniej 2 znaki, aby wyszukać sprawność.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
