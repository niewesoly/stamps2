import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import Fuse from 'fuse.js'
import type { BadgeGroup } from '@/data/types'
import { buildSearchIndex, type SearchResult, type SearchDocument } from '@/data/search'

// Debounce helper for search
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

interface UseSearchOptions {
  groups: BadgeGroup[]
  limit: number
  onClose?: () => void
}

interface UseSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleSelect: (result: SearchResult) => void
  clearSearch: () => void
}

export function useSearch({ groups, limit, onClose }: UseSearchOptions): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const navigate = useNavigate()

  // Build search index once
  const fuse = useMemo(() => buildSearchIndex(groups), [groups])

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((q: string, currentFuse: Fuse<SearchDocument>) => {
      if (q.trim().length < 2) {
        setResults([])
        return
      }
      const hits = currentFuse.search(q, { limit })
      setResults(hits.map(h => h.item.result))
      setSelectedIndex(-1)
    }, 150),
    [limit]
  )

  const handleSelect = (result: SearchResult) => {
    navigate(result.type === 'group' ? `/${result.groupSlug}` : `/sprawnosc/${result.badgeSlug}`)
    clearSearch()
    onClose?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.()
      return
    }
    if (results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = selectedIndex >= 0 && selectedIndex < results.length
        ? results[selectedIndex]
        : (results.length > 0 ? results[0] : null)
      if (selected) handleSelect(selected)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSelectedIndex(-1)
  }

  // Expose debouncedSearch for manual invocation
  const setQueryWithSearch = (newQuery: string) => {
    setQuery(newQuery)
    debouncedSearch(newQuery, fuse)
  }

  return {
    query,
    setQuery: setQueryWithSearch,
    results,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleSelect,
    clearSearch,
  }
}
