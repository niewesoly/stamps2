import { useRef } from 'react'
import { Search, X } from 'lucide-react'
import type { BadgeGroup } from '@/data/types'
import { useSearch } from '@/hooks/useSearch'
import { useAutoFocus } from '@/hooks/useAutoFocus'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { SearchResults, SearchNoResults, SearchPrompt } from '@/components/search'

interface MobileSearchOverlayProps {
  groups: BadgeGroup[]
  onClose: () => void
}

export default function MobileSearchOverlay({ groups, onClose }: MobileSearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null!)

  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    handleSelect,
  } = useSearch({ groups, limit: 8, onClose })

  // Auto-focus the input
  useAutoFocus(inputRef, true)

  // Focus trap and escape key handler
  useFocusTrap({ isOpen: true, onClose })

  return (
    <div
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Czego chcesz się dziś nauczyć?..."
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
        {results.length > 0 ? (
          <SearchResults
            results={results}
            selectedIndex={selectedIndex}
            variant="expanded"
            onSelect={handleSelect}
            onHover={setSelectedIndex}
          />
        ) : query.length >= 2 ? (
          <SearchNoResults query={query} variant="expanded" />
        ) : (
          <SearchPrompt variant="expanded" />
        )}
      </div>
    </div>
  )
}
