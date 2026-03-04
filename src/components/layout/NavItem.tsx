import { Link } from 'react-router'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
  isActive: boolean
  variant?: 'desktop' | 'mobile'
}

export function NavItem({ to, label, icon: Icon, isActive, variant = 'desktop' }: NavItemProps) {
  if (variant === 'mobile') {
    return (
      <Link
        key={to}
        to={to}
        role="tab"
        aria-selected={isActive}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mx-1 ${
          isActive
            ? 'text-primary'
            : 'text-muted-foreground active:scale-95'
        }`}
      >
        <div
          className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
            isActive ? 'bg-primary/12 scale-105' : ''
          }`}
        >
          <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
        </div>
        <span className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${isActive ? 'text-primary' : ''}`}>
          {label}
        </span>
      </Link>
    )
  }

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
}
