import { useRef, useState, useCallback } from 'react'

interface UseTimelineRevealOptions {
  count:       number   // total de itens
  baseDelay?:  number   // ms antes do primeiro item. Default: 0
  stagger?:    number   // ms entre itens. Default: 180
  threshold?:  number   // visibilidade do container. Default: 0.05
}

interface UseTimelineRevealReturn {
  /**
   * Ref callback para passar ao <ol>.
   * Uso: <ol ref={containerRef}>
   */
  containerRef: (el: HTMLOListElement | null) => void
  /** true se o item de índice i já foi revelado */
  isVisible: (index: number) => boolean
}

/**
 * useTimelineReveal — observa o <ol> da timeline e libera cada entry
 * em sequência (stagger) quando o container entra na viewport.
 *
 * Usa ref callback (não useEffect) para garantir que o IntersectionObserver
 * seja registrado exatamente quando o DOM está pronto, sem race conditions.
 *
 * Respeita prefers-reduced-motion: revela todos de uma vez sem delay.
 */
export function useTimelineReveal({
  count,
  baseDelay = 0,
  stagger   = 180,
  threshold = 0.05,
}: UseTimelineRevealOptions): UseTimelineRevealReturn {
  const [visible, setVisible] = useState<boolean[]>(() => Array(count).fill(false))
  const firedRef  = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const containerRef = useCallback((el: HTMLOListElement | null) => {
    if (!el || firedRef.current) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const reveal = () => {
      if (firedRef.current) return
      firedRef.current = true

      if (reduced) {
        setVisible(Array(count).fill(true))
        return
      }

      for (let i = 0; i < count; i++) {
        const t = setTimeout(() => {
          setVisible(prev => {
            const next = [...prev]
            next[i]   = true
            return next
          })
        }, baseDelay + i * stagger)
        timersRef.current.push(t)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          reveal()
        }
      },
      { threshold }
    )

    observer.observe(el)
  }, [count, baseDelay, stagger, threshold])

  return {
    containerRef,
    isVisible: (i: number) => visible[i] ?? false,
  }
}
