import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { navItems } from '@data/navigation'

const SWIPE_THRESHOLD = 55    // px mínimos para considerar swipe
const SWIPE_MAX_TIME  = 400   // ms máximos (swipes lentos = scroll, não nav)
const SWIPE_MAX_VERT  = 80    // px verticais máximos (não deve ser scroll)

/**
 * useSwipeNav — swipe horizontal entre seções no mobile.
 *
 * Swipe ← avança para a próxima seção.
 * Swipe → volta para a seção anterior.
 *
 * Cancela se: movimento vertical > SWIPE_MAX_VERT (scroll intencional),
 * tempo > SWIPE_MAX_TIME (gesto lento), ou dentro de inputs/textareas.
 */
export function useSwipeNav() {
  const navigate = useNavigate()
  const touchStart  = useRef<{ x: number; y: number; t: number } | null>(null)
  const paths       = navItems.map(i => i.path)

  const getCurrentIndex = useCallback(() => {
    const path = window.location.hash.replace('#', '') || '/'
    const idx  = paths.indexOf(path)
    return idx === -1 ? 0 : idx
  }, [paths])

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      // Não captura em inputs/textareas/selects
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const t = e.touches[0]
      touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return
      const t    = e.changedTouches[0]
      const dx   = t.clientX  - touchStart.current.x
      const dy   = Math.abs(t.clientY - touchStart.current.y)
      const dt   = Date.now()   - touchStart.current.t
      touchStart.current = null

      // Rejeita gestos verticais, lentos, ou curtos
      if (dy > SWIPE_MAX_VERT)      return
      if (dt > SWIPE_MAX_TIME)       return
      if (Math.abs(dx) < SWIPE_THRESHOLD) return

      const idx  = getCurrentIndex()
      if (dx < 0 && idx < paths.length - 1) {
        // Swipe ← → próxima seção
        navigate(paths[idx + 1])
      } else if (dx > 0 && idx > 0) {
        // Swipe → → seção anterior
        navigate(paths[idx - 1])
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend',   onTouchEnd,   { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend',   onTouchEnd)
    }
  }, [navigate, getCurrentIndex, paths])
}
