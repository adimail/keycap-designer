import { useEffect } from 'react'

export function useBeforeUnload(
  enabled: boolean,
  message?: string,
) {
  useEffect(() => {
    if (!enabled) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // @ts-ignore Required for legacy browser beforeunload prompts.
      e.returnValue = message || ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, message])
}
