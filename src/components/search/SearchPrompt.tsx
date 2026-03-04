interface SearchPromptProps {
  variant?: 'compact' | 'expanded'
}

export function SearchPrompt({ variant = 'expanded' }: SearchPromptProps) {
  if (variant === 'expanded') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-4xl mb-3">⚜️</div>
        <p className="text-muted-foreground text-sm font-medium">
          Gotów do zdobywania?
        </p>
        <p className="text-muted-foreground/80 text-xs mt-1">
          Wpisz fragment nazwy sprawności, której szukasz.
        </p>
      </div>
    )
  }

  return null
}
