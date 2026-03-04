import { useEffect } from 'react'

interface UseFocusTrapOptions {
  isOpen: boolean
  onClose: () => void
}

export function useFocusTrap({ isOpen, onClose }: UseFocusTrapOptions) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previouslyFocused = document.activeElement as HTMLElement

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [isOpen, onClose])
}
