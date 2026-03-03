import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="bg-muted/30 text-muted-foreground border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <svg width="16" height="18" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/60" aria-hidden="true">
            <path d="M14 2C14 2 10 6 10 10C10 12.5 11.5 14.5 14 15C16.5 14.5 18 12.5 18 10C18 6 14 2 14 2Z" fill="currentColor" />
            <path d="M14 15C14 15 8 14 5 18C3 21 4 24 7 25C9 25.8 11 25 12 23.5C12 23.5 11 27 9 28.5C11 29.5 14 30 14 30C14 30 17 29.5 19 28.5C17 27 16 23.5 16 23.5C17 25 19 25.8 21 25C24 24 25 21 23 18C20 14 14 15 14 15Z" fill="currentColor" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-foreground/80">
            Sprawności ZHR
          </span>
        </div>

        {/* Attribution & Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
          <Link
            to="/o-sprawnosciach"
            className="text-xs font-medium tracking-wide uppercase hover:text-primary transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm opacity-80"
          >
            O sprawnościach
          </Link>
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <p className="text-xs text-center font-medium tracking-wide uppercase opacity-80">
            Dane:{' '}
            <a
              href="https://stamps.zhr.pl"
              className="hover:text-primary transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              stamps.zhr.pl
            </a>
            {' '}·{' '}Związek Harcerstwa Rzeczpospolitej
          </p>
        </div>
      </div>
    </footer>
  )
}

