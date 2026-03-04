import { useLocation } from 'react-router'
import { NAV_ITEMS } from './constants'
import { NavItem } from './NavItem'

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
