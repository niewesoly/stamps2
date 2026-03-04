import { useLocation } from 'react-router'
import { Home, BookOpen } from 'lucide-react'
import { NavItem } from './NavItem'

const NAV_ITEMS = [
  { to: '/', label: 'Sprawności', icon: Home },
  { to: '/o-sprawnosciach', label: 'O sprawnościach', icon: BookOpen },
] as const

export default function DesktopNav() {
  const location = useLocation()

  return (
    <nav className="flex items-center gap-1 bg-muted/40 rounded-full p-1 border border-border/30 shrink-0">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavItem
          key={to}
          to={to}
          label={label}
          icon={icon}
          isActive={location.pathname === to}
          variant="desktop"
        />
      ))}
    </nav>
  )
}
