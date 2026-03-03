interface Props {
  stars: 1 | 2 | 3
  size?: 'sm' | 'md' | 'lg'
}

const STAR_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Jedna gwiazdka',
  2: 'Dwie gwiazdki',
  3: 'Trzy gwiazdki',
}

const SIZE_MAP: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export default function StarRating({ stars, size = 'md' }: Props) {
  return (
    <span
      className={`${SIZE_MAP[size]} tracking-tight flex items-center`}
      aria-label={STAR_LABELS[stars]}
    >
      <span aria-hidden="true" className="text-amber-500">{'★'.repeat(stars)}</span>
      <span aria-hidden="true" className="text-muted-foreground/30">{'★'.repeat(3 - stars)}</span>
    </span>
  )
}
