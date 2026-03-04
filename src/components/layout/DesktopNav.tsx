import { Link } from 'react-router'
import type { Location } from 'react-router'
import { Home, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Sprawności', icon: Home },
  { to: '/o-sprawnosciach', label: 'O sprawnościach', icon: BookOpen },
] as const

interface DesktopNavProps {
  location: Location
}

export default function DesktopNav({ location }: DesktopNavProps) {
  return (
    <nav className="flex items-center gap-1 bg-muted/40 rounded-full p-1 border border-border/30 shrink-0">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
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
  )
}
