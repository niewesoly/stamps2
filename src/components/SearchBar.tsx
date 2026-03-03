import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import Fuse from 'fuse.js'
import type { BadgeGroup } from '@/data/types'
import { buildSearchIndex, type SearchResult } from '@/data/search'
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
  const fuseRef = useRef<Fuse<any> | null>(null)
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
      let selected = selectedIndex >= 0 && selectedIndex < results.length
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
    <div className="relative w-full" onBlur={handleBlur}>
      <div className="relative">
        <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none select-none">
          🔍
        </span>
        <input
          ref={inputRef}
          type="search"
          aria-label="Wyszukaj sprawność po nazwie"
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Szukaj sprawności..."
          className="w-full bg-black/20 text-white placeholder:text-white/70 rounded-xl pl-10 pr-4 py-3 text-base border border-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:border-transparent backdrop-blur-md transition-all shadow-sm"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-card/95 backdrop-blur-xl text-card-foreground rounded-xl shadow-xl border border-border overflow-hidden z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2">
          {results.map((r, i) => (
            <a
              key={i}
              href={r.type === 'group' ? `/${r.groupSlug}` : `/sprawnosc/${r.badgeSlug}`}
              className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-border/50 last:border-0 ${selectedIndex === i ? 'bg-primary/10' : 'hover:bg-muted/80'}`}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              {r.iconUrl && (
                <div className="w-10 h-10 shrink-0 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-center p-1">
                  <img src={r.iconUrl} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm truncate">
                    {r.type === 'badge' ? r.badgeName : r.groupName}
                  </span>
                  {r.stars && <StarRating stars={r.stars} size="sm" />}
                </div>
                {r.type === 'badge' && (
                  <p className="text-xs text-muted-foreground truncate font-medium">{r.groupName}</p>
                )}
              </div>
              <CategoryBadge category={r.category} size="sm" />
            </a>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-card/95 backdrop-blur-xl text-muted-foreground rounded-xl shadow-xl border border-border px-4 py-8 text-center text-sm z-50 animate-in slide-in-from-top-2">
          Brak wyników dla „<span className="text-foreground font-semibold">{query}</span>"
        </div>
      )}
    </div>
  )
}
