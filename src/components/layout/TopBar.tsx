import { Search } from 'lucide-react'
import type { BadgeGroup } from '@/data/types'
import HeaderLogo from './HeaderLogo'
import DesktopNav from './DesktopNav'
import CompactSearch from './CompactSearch'

interface TopBarProps {
  groups: BadgeGroup[]
  onSearchClick: () => void
}

export default function TopBar({ groups, onSearchClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-3">
        <HeaderLogo />

        {/* Desktop: inline search + pill nav */}
        <div className="hidden sm:flex items-center gap-3 flex-1 justify-end">
          <div className="relative max-w-xs flex-1">
            <CompactSearch groups={groups} />
          </div>
          <DesktopNav />
        </div>

        {/* Mobile: search icon in top bar */}
        <button
          onClick={onSearchClick}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Szukaj"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
