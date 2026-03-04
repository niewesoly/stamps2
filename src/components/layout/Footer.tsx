import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="bg-muted/30 text-muted-foreground border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-white/5">
            <img src="/stamps-logo.png" alt="" className="w-full h-full object-cover scale-[1.3]" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground/80">
            Stamps
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
          <p className="text-xs text-center font-medium tracking-wide text-muted-foreground/80 leading-relaxed max-w-[280px] sm:max-w-none">
            Dane z oficjalnego systemu{' '}
            <a
              href="https://stamps.zhr.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm font-semibold"
            >
              stamps.zhr.pl
            </a>
            . Tworzone z pasją przez harcerzy dla harcerzy.
          </p>
        </div>
      </div>
    </footer>
  )
}

