import type { BadgeGroup } from '@/data/types'
import HeaderLogo from './HeaderLogo'
import DesktopNav from './DesktopNav'
import CompactSearch from './CompactSearch'

interface TopBarProps {
  groups: BadgeGroup[]
}

export default function TopBar({ groups }: TopBarProps) {
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
      </div>
    </header>
  )
}
