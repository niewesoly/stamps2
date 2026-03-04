interface SearchPromptProps {
  variant?: 'compact' | 'expanded'
}

export function SearchPrompt({ variant = 'expanded' }: SearchPromptProps) {
  if (variant === 'expanded') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-4xl mb-3">⚜️</div>
        <p className="text-muted-foreground text-sm">
          Wpisz co najmniej 2 znaki, aby wyszukać sprawność.
        </p>
      </div>
    )
  }

  return null
}
