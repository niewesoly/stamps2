import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import Fuse from 'fuse.js'
import type { BadgeGroup } from '@/data/types'
import { buildSearchIndex, type SearchResult, type SearchDocument } from '@/data/search'
import CategoryBadge from './CategoryBadge'
import StarRating from './StarRating'

interface Props {
  groups: BadgeGroup[]
}

export default function SearchBar({ groups }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const fuseRef = useRef<Fuse<SearchDocument> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fuseRef.current = buildSearchIndex(groups)
  }, [groups])

  const search = useCallback((q: string) => {
    if (!fuseRef.current || q.trim().length < 2) {
      setResults([])
      return
    }
    const hits = fuseRef.current.search(q, { limit: 8 })
    setResults(hits.map(h => h.item.result))
    setSelectedIndex(-1)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    search(q)
    setOpen(true)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false)
      setSelectedIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      setSelectedIndex(-1)
      return
    }

    if (!open && results.length > 0 && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true)
      return
    }

    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = selectedIndex >= 0 && selectedIndex < results.length
        ? results[selectedIndex]
        : (results.length > 0 ? results[0] : null)

      if (selected) {
        navigate(selected.type === 'group' ? `/${selected.groupSlug}` : `/sprawnosc/${selected.badgeSlug}`)
        setOpen(false)
        inputRef.current?.blur()
      }
    }
  }

  return (
    <div className={`relative w-full ${open ? 'z-50' : 'z-10'}`} onBlur={handleBlur}>
      {/* Backdrop when open */}
      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="relative z-50">
        <span aria-hidden="true" className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none select-none text-xl">
          🔍
        </span>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
          aria-label="Wyszukaj sprawność po nazwie"
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Szukaj sprawności..."
          className="w-full bg-black/30 text-white placeholder:text-white/60 rounded-2xl pl-14 pr-5 py-4 text-lg font-medium border border-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:border-transparent backdrop-blur-xl transition-all shadow-xl hover:bg-black/40"
        />
      </div>

      {open && results.length > 0 && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-[calc(100%+0.75rem)] -left-4 -right-4 sm:left-0 sm:right-0 bg-card/95 backdrop-blur-2xl text-card-foreground rounded-2xl shadow-2xl border border-border/50 overflow-hidden z-50 max-h-[60vh] overflow-y-auto animate-in fade-in slide-in-from-top-4"
        >
          {results.map((r, i) => {
            const isSelected = selectedIndex === i
            // Create stable key from type + slug (badgeSlug for badges, groupSlug for groups)
            const key = r.type === 'badge'
              ? `badge-${r.badgeSlug}`
              : `group-${r.groupSlug}`
            return (
              <a
                key={key}
                id={`search-result-${i}`}
                role="option"
                aria-selected={isSelected}
                href={r.type === 'group' ? `/${r.groupSlug}` : `/sprawnosc/${r.badgeSlug}`}
                className={`flex items-center gap-4 px-5 py-4 transition-colors border-b border-border/30 last:border-0 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/80'
                  }`}
                onMouseEnter={() => setSelectedIndex(i)}
                // Focus styling for keyboard users
                onFocus={() => setSelectedIndex(i)}
              >
                {r.iconUrl && (
                  <div className={`w-14 h-14 shrink-0 rounded-full border flex items-center justify-center p-1.5 transition-colors ${isSelected ? 'bg-primary/20 border-primary/30' : 'bg-primary/5 border-primary/10'}`}>
                    <img src={r.iconUrl} alt="" className="w-full h-full object-contain drop-shadow-sm" loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="min-w-0 flex-1 flex flex-col items-start gap-1">
                  <span className="font-extrabold text-foreground text-lg leading-tight">
                    {r.badgeName || r.groupName}
                  </span>

                  <span className="text-sm text-muted-foreground font-medium line-clamp-1 mb-1">
                    {r.type === 'badge' ? r.groupName : 'Grupa sprawności'}
                  </span>

                  <div className="flex flex-wrap items-center gap-3">
                    <CategoryBadge category={r.category} size="sm" />
                    {r.stars && <StarRating stars={r.stars} size="sm" />}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-[calc(100%+0.75rem)] -left-4 -right-4 sm:left-0 sm:right-0 bg-card/95 backdrop-blur-2xl text-muted-foreground rounded-2xl shadow-2xl border border-border px-6 py-10 text-center text-base font-medium z-50 animate-in fade-in slide-in-from-top-4">
          Nie znaleźliśmy sprawności odpowiadającej haśle „<span className="text-foreground font-bold">{query}</span>”.<br />
          <span className="text-sm opacity-80 mt-2 block">Spróbuj wpisać krótszy fragment nazwy.</span>
        </div>
      )}
    </div>
  )
}
