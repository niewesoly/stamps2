import { useEffect } from 'react'

export function useAutoFocus(inputRef: React.RefObject<HTMLInputElement>, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return

    const timerId = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timerId)
  }, [isOpen, inputRef])
}
