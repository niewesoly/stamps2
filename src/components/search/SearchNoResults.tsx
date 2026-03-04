interface SearchNoResultsProps {
  query: string
  variant?: 'compact' | 'expanded'
}

export function SearchNoResults({ query, variant = 'compact' }: SearchNoResultsProps) {
  const baseClasses = variant === 'compact'
    ? 'absolute top-[calc(100%+0.5rem)] left-0 right-0 min-w-[280px] bg-card/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-border/50 px-4 py-6 text-center text-xs text-muted-foreground z-[60] animate-in fade-in slide-in-from-top-2'
    : 'flex flex-col items-center justify-center px-6 py-16 text-center'

  if (variant === 'expanded') {
    return (
      <div className={baseClasses}>
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-muted-foreground text-sm">
          Głucha cisza w lesie. Brak wyników dla „<span className="text-foreground font-bold">{query}</span>".
        </p>
        <p className="text-muted-foreground/70 text-xs mt-1">
          Spróbuj poszukać po innym haśle.
        </p>
      </div>
    )
  }

  return (
    <div className={baseClasses}>
      Brak wyników dla „<span className="text-foreground font-bold">{query}</span>"
    </div>
  )
}
