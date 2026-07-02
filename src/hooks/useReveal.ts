import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT_EXPO, DUR_REVEAL } from '@lib/gsap'

interface RevealOptions {
  /**
   * Seletor dos elementos a revelar dentro do container.
   * Default: '[data-reveal]'
   */
  selector?:  string
  /**
   * Stagger entre elementos em segundos. Default: 0.08
   */
  stagger?:   number
  /**
   * Distância do slide em px. Default: 40
   */
  distance?:  number
  /**
   * Direção do slide. Default: 'up'
   */
  from?:      'up' | 'left' | 'right'
  /**
   * Threshold de visibilidade para disparar. Default: 'top 85%'
   */
  trigger?:   string
  /**
   * Duração de cada elemento. Default: DUR_REVEAL
   */
  duration?:  number
  /**
   * Se true, anima apenas uma vez. Default: true
   */
  once?:      boolean
}

/**
 * useReveal — revela elementos com ScrollTrigger quando entram na viewport.
 *
 * Uso:
 * ```tsx
 * const ref = useReveal<HTMLDivElement>()
 * return (
 *   <div ref={ref}>
 *     <h1 data-reveal>Título</h1>
 *     <p  data-reveal>Parágrafo</p>
 *   </div>
 * )
 * ```
 *
 * Respeita prefers-reduced-motion: salta diretamente para o estado final.
 */
export function useReveal<T extends HTMLElement = HTMLElement>({
  selector = '[data-reveal]',
  stagger  = 0.08,
  distance = 40,
  from     = 'up',
  trigger  = 'top 88%',
  duration = DUR_REVEAL,
  once     = true,
}: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = container.querySelectorAll<HTMLElement>(selector)
    if (!elements.length) return

    // Estado inicial: invisible + offset
    const fromVars: gsap.TweenVars = { opacity: 0, immediateRender: true }
    if (!reduced) {
      if (from === 'up')    fromVars.y = distance
      if (from === 'left')  fromVars.x = -distance
      if (from === 'right') fromVars.x = distance
    }

    gsap.set(elements, fromVars)

    const toVars: gsap.TweenVars = {
      opacity:  1,
      y:        0,
      x:        0,
      duration: reduced ? 0 : duration,
      ease:     EASE_OUT_EXPO,
      stagger:  reduced ? 0 : stagger,
    }

    const st = ScrollTrigger.create({
      trigger:  container,
      start:    trigger,
      once,
      onEnter: () => gsap.to(elements, toVars),
    })

    return () => {
      st.kill()
      gsap.set(elements, { clearProps: 'all' })
    }
  }, [selector, stagger, distance, from, trigger, duration, once])

  return ref
}
