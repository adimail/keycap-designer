import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  options?: { disabled?: boolean },
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (options?.disabled) return

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [callback, options?.disabled])

  return ref
}
