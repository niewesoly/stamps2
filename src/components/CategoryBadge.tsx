import { getCategoryName, getCategoryIcon } from '@/data/api'

interface Props {
  category: number
  size?: 'sm' | 'md'
}

const CATEGORY_STYLES: Record<number, string> = {
  1: 'bg-green-100/80 text-green-900 dark:bg-green-900/60 dark:text-green-100 border-green-200 dark:border-green-800',       // forest
  2: 'bg-amber-100/80 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100 border-amber-200 dark:border-amber-800',       // earth
  3: 'bg-orange-100/80 text-orange-900 dark:bg-orange-900/60 dark:text-orange-100 border-orange-200 dark:border-orange-800', // warm earth
  4: 'bg-blue-100/80 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100 border-blue-200 dark:border-blue-800',             // deep blue
  5: 'bg-purple-100/80 text-purple-900 dark:bg-purple-900/60 dark:text-purple-100 border-purple-200 dark:border-purple-800', // duch
  6: 'bg-pink-100/80 text-pink-900 dark:bg-pink-900/60 dark:text-pink-100 border-pink-200 dark:border-pink-800',             // muzyka
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const styles = CATEGORY_STYLES[category] ?? CATEGORY_STYLES[1]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[0.7rem]' : 'px-3 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold border ${styles} ${padding} transition-colors`}
    >
      <span className={size === 'sm' ? 'text-[0.75rem] leading-none' : 'text-sm leading-none'}>
        {getCategoryIcon(category)}
      </span>
      {getCategoryName(category)}
    </span>
  )
}
