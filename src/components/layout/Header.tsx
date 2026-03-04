import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Home, BookOpen, Search, X } from 'lucide-react'
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

const NAV_ITEMS = [
  { to: '/', label: 'Sprawności', icon: Home },
  { to: '/o-sprawnosciach', label: 'O sprawnościach', icon: BookOpen },
] as const

interface HeaderProps {
  groups: BadgeGroup[]
}

export default function Header({ groups }: HeaderProps) {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

  // Close search when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchOpen(false)
  }, [location.pathname])

  return (
    <>
      {/* ───── Top Bar ───── */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 -ml-1 transition-all"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 overflow-hidden transition-transform group-hover:scale-105 duration-300">
              <img
                src="/stamps-logo.png"
                alt="Stamps Logo"
                className="w-full h-full object-cover scale-[1.3]"
              />
            </div>
            <div className="leading-none flex flex-col justify-center">
              <span className="font-bold text-foreground tracking-tight text-[15px] sm:text-lg">
                Stamps
              </span>
              <span className="text-[0.5rem] sm:text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground/70 mt-px hidden min-[360px]:block">
                Książeczka Sprawności
              </span>
            </div>
          </Link>

          {/* Desktop: inline search + pill nav */}
          <div className="hidden sm:flex items-center gap-3 flex-1 justify-end">
            {/* Compact search trigger */}
            <div className="relative max-w-xs flex-1">
              <CompactSearch groups={groups} />
            </div>

            {/* Pill nav */}
            <nav className="flex items-center gap-1 bg-muted/40 rounded-full p-1 border border-border/30 shrink-0">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Mobile: search icon in top bar */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Szukaj"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ───── Mobile Bottom Tab Bar ───── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border/30 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
        role="tablist"
        aria-label="Nawigacja główna"
      >
        <div className="flex items-stretch justify-around h-16 max-w-md mx-auto px-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to && !searchOpen
            return (
              <Link
                key={to}
                to={to}
                role="tab"
                aria-selected={isActive}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mx-1 ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground active:scale-95'
                  }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${isActive ? 'bg-primary/12 scale-105' : ''
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${isActive ? 'text-primary' : ''}`}>
                  {label}
                </span>
              </Link>
            )
          })}

          {/* Search tab */}
          <button
            role="tab"
            aria-selected={searchOpen}
            onClick={() => setSearchOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mx-1 ${searchOpen
                ? 'text-primary'
                : 'text-muted-foreground active:scale-95'
              }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${searchOpen ? 'bg-primary/12 scale-105' : ''
                }`}
            >
              <Search className={`w-5 h-5 transition-all duration-200 ${searchOpen ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
            </div>
            <span className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${searchOpen ? 'text-primary' : ''}`}>
              Szukaj
            </span>
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </nav>

      {/* ───── Mobile Full-Screen Search Overlay ───── */}
      {searchOpen && (
        <MobileSearchOverlay
          groups={groups}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  )
}

/* ─────────────────────────────────────────────
   Desktop: Compact inline search in top bar
   ───────────────────────────────────────────── */
function CompactSearch({ groups }: { groups: BadgeGroup[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Build search index once
  const fuse = useMemo(() => buildSearchIndex(groups), [groups])

  // Debounced search function - uses fuse directly without ref
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
                className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-border/20 last:border-0 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/60'
                  }`}
              >
                {r.iconUrl && (
                  <div className={`w-9 h-9 shrink-0 rounded-lg border flex items-center justify-center p-1 transition-colors ${isSelected ? 'bg-primary/20 border-primary/30' : 'bg-primary/5 border-primary/10'
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

/* ─────────────────────────────────────────────
   Mobile: Full-screen search overlay
   ───────────────────────────────────────────── */
function MobileSearchOverlay({ groups, onClose }: { groups: BadgeGroup[]; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)

  // Build search index once
  const fuse = useMemo(() => buildSearchIndex(groups), [groups])

  // Debounced search function - uses fuse directly without ref
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
