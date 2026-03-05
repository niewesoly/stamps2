import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="bg-muted/30 text-muted-foreground border-t mb-[80px] sm:mb-0">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-white/5">
            <img
              src="/stamps-logo.webp"
              alt=""
              className="w-full h-full object-cover scale-[1.3]"
              width="24"
              height="24"
              loading="lazy"
              decoding="async"
            />
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
          <a
            href="https://github.com/niewesoly/stamps2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium tracking-wide uppercase hover:text-primary transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm opacity-80 inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-2.15 1.004-3.025-.1-.256-.435-1.292.096-2.68 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.532 1.387.199 2.424.098 2.68.616.874 1.003 1.932 1.003 3.025 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
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

