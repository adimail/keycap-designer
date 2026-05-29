import { useEffect, useCallback } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: (e: KeyboardEvent) => void
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options?: { disabled?: boolean },
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (options?.disabled) return

      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement

      shortcuts.forEach((s) => {
        const isSave = s.key === 's' && (e.ctrlKey || e.metaKey)
        if (isInput && !isSave) return

        const keyMatch = e.key === s.key
        const ctrlMatch = s.ctrlKey === undefined || s.ctrlKey === e.ctrlKey
        const metaMatch = s.metaKey === undefined || s.metaKey === e.metaKey
        const shiftMatch = s.shiftKey === undefined || s.shiftKey === e.shiftKey
        const altMatch = s.altKey === undefined || s.altKey === e.altKey

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          e.preventDefault()
          e.stopPropagation()
          s.callback(e)
        }
      })
    },
    [shortcuts, options?.disabled],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown])
}
