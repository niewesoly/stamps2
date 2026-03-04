import { Link } from 'react-router'

export default function HeaderLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 -ml-1 transition-all"
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 overflow-hidden transition-transform group-hover:scale-105 duration-300">
        <img
          src="/stamps-logo.png"
          alt="Stamps Logo"
          className="w-full h-full object-cover scale-[1.3]"
        />
      </div>
      <div className="leading-none flex flex-col justify-center">
        <span className="font-bold text-foreground tracking-tight text-[15px] sm:text-lg">
          Stamps
        </span>
        <span className="text-[0.5rem] sm:text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground/70 mt-px hidden min-[360px]:block">
          Książeczka Sprawności
        </span>
      </div>
    </Link>
  )
}
