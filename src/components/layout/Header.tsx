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
          {/* Fleur-de-lis SVG mark */}
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <svg
              width="20"
              height="24"
              viewBox="0 0 28 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M14 2C14 2 10 6 10 10C10 12.5 11.5 14.5 14 15C16.5 14.5 18 12.5 18 10C18 6 14 2 14 2Z"
                fill="currentColor"
              />
              <path
                d="M14 15C14 15 8 14 5 18C3 21 4 24 7 25C9 25.8 11 25 12 23.5C12 23.5 11 27 9 28.5C11 29.5 14 30 14 30C14 30 17 29.5 19 28.5C17 27 16 23.5 16 23.5C17 25 19 25.8 21 25C24 24 25 21 23 18C20 14 14 15 14 15Z"
                fill="currentColor"
              />
            </svg>
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
