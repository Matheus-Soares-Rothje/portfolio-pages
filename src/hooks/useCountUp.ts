import { useState, useEffect, useRef, useCallback } from 'react'

interface UseCountUpOptions {
  /** Valor final */
  target: number
  /** Duração da contagem em ms. Default: 1200 */
  duration?: number
  /** Delay antes de iniciar em ms. Default: 0 */
  delay?: number
  /** Easing: 'linear' | 'easeOut' | 'easeOutExpo'. Default: 'easeOutExpo' */
  easing?: 'linear' | 'easeOut' | 'easeOutExpo'
  /** Inicia apenas quando o elemento entra na viewport. Default: true */
  triggerOnView?: boolean
}

const easings = {
  linear:      (t: number) => t,
  easeOut:     (t: number) => 1 - Math.pow(1 - t, 2),
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
}

interface UseCountUpReturn {
  value: number
  /** Ref para anexar ao elemento que dispara a animação */
  ref: React.RefObject<HTMLElement | null>
  /** true após a animação terminar */
  done: boolean
}

/**
 * useCountUp — anima um número de 0 até `target` quando o elemento
 * referenciado entra na viewport (IntersectionObserver).
 *
 * Respeita `prefers-reduced-motion`: se ativo, pula direto para o valor final.
 */
export function useCountUp({
  target,
  duration  = 1200,
  delay     = 0,
  easing    = 'easeOutExpo',
  triggerOnView = true,
}: UseCountUpOptions): UseCountUpReturn {
  const [value, setValue] = useState(0)
  const [done,  setDone ] = useState(false)
  const ref      = useRef<HTMLElement>(null)
  const rafRef   = useRef<number>(0)
  const started  = useRef(false)

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const runAnimation = useCallback(() => {
    if (started.current) return
    started.current = true

    if (prefersReduced) {
      setValue(target)
      setDone(true)
      return
    }

    const easeFn   = easings[easing]
    const startTime = performance.now() + delay

    const tick = (now: number) => {
      if (now < startTime) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const elapsed = now - startTime
      const t       = Math.min(elapsed / duration, 1)
      const current = Math.round(easeFn(t) * target)

      setValue(current)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
        setDone(true)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [target, duration, delay, easing, prefersReduced])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!triggerOnView) {
      runAnimation()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [runAnimation, triggerOnView])

  return { value, ref, done }
}
