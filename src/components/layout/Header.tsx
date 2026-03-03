import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50 shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3 sm:gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 -ml-1 transition-all"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 overflow-hidden transition-transform group-hover:scale-105 duration-300">
            <img
              src="/stamps-logo.png"
              alt="Stamps Logo"
              className="w-full h-full object-cover scale-[1.3]"
            />
          </div>

          <div className="leading-none flex flex-col justify-center">
            <div className="font-bold text-foreground tracking-tight text-lg">
              Stamps
            </div>
            <div className="text-[0.60rem] sm:text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground mt-0.5 hidden min-[360px]:block">
              Odkryj swój szlak
            </div>
          </div>
        </Link>

        {/* Right nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/o-sprawnosciach"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors px-3 py-2 sm:px-4 rounded-md text-xs font-semibold tracking-wider uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-center leading-tight sm:leading-normal"
          >
            O sprawnościach
          </Link>
          <Link
            to="/"
            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors px-4 py-2 rounded-md text-xs font-semibold tracking-wider uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Strona główna
          </Link>
        </nav>
      </div>
    </header>
  )
}
