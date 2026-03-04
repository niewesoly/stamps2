import { useLocation } from 'react-router'
import { Search, Home, BookOpen } from 'lucide-react'
import { NavItem } from './NavItem'

const NAV_ITEMS = [
  { to: '/', label: 'Sprawności', icon: Home },
  { to: '/o-sprawnosciach', label: 'O sprawnościach', icon: BookOpen },
] as const

interface MobileTabBarProps {
  searchOpen: boolean
  onSearchClick: () => void
}

export default function MobileTabBar({ searchOpen, onSearchClick }: MobileTabBarProps) {
  const location = useLocation()

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border/30 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
      role="tablist"
      aria-label="Nawigacja główna"
    >
      <div className="flex items-stretch justify-around h-16 max-w-md mx-auto px-2">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            icon={icon}
            isActive={location.pathname === to && !searchOpen}
            variant="mobile"
          />
        ))}

        {/* Search tab */}
        <button
          role="tab"
          aria-selected={searchOpen}
          onClick={onSearchClick}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mx-1 ${
            searchOpen
              ? 'text-primary'
              : 'text-muted-foreground active:scale-95'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
              searchOpen ? 'bg-primary/12 scale-105' : ''
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
  )
}
