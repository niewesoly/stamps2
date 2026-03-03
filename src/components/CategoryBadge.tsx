import { CATEGORY_NAMES, CATEGORY_ICONS } from '@/data/types'
import { Badge } from './ui/badge'

interface Props {
  category: 1 | 2 | 3 | 4
  size?: 'sm' | 'md'
}

const CATEGORY_STYLES: Record<number, string> = {
  1: 'bg-green-100/80 text-green-900 dark:bg-green-900/60 dark:text-green-100 border-green-200 dark:border-green-800',       // forest
  2: 'bg-amber-100/80 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100 border-amber-200 dark:border-amber-800',       // earth
  3: 'bg-orange-100/80 text-orange-900 dark:bg-orange-900/60 dark:text-orange-100 border-orange-200 dark:border-orange-800', // warm earth
  4: 'bg-blue-100/80 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100 border-blue-200 dark:border-blue-800',             // deep blue
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const styles = CATEGORY_STYLES[category] ?? CATEGORY_STYLES[1]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[0.7rem]' : 'px-3 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold border ${styles} ${padding} transition-colors`}
    >
      <span className={size === 'sm' ? 'text-[0.75rem] leading-none' : 'text-sm leading-none'}>
        {CATEGORY_ICONS[category]}
      </span>
      {CATEGORY_NAMES[category]}
    </span>
  )
}
