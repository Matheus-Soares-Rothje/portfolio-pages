import { useState, useEffect, useRef } from 'react'

interface UseSkillRevealOptions {
  /** Delay base antes da primeira barra em ms. Default: 0 */
  baseDelay?: number
  /** Delay escalonado entre cada barra em ms. Default: 80 */
  stagger?: number
  /** Threshold de visibilidade para disparar. Default: 0.2 */
  threshold?: number
}

interface UseSkillRevealReturn {
  /** Ref para anexar ao container das barras */
  containerRef: React.RefObject<HTMLElement | null>
  /** true quando o container entrou na viewport */
  visible: boolean
  /** Retorna o delay calculado para o item de índice i */
  getDelay: (index: number) => number
}

/**
 * useSkillReveal — observa o container de skills e retorna `visible: true`
 * quando ele entra na viewport, além de um helper `getDelay(i)` para
 * escalonar a animação de cada barra.
 */
export function useSkillReveal({
  baseDelay = 0,
  stagger   = 80,
  threshold = 0.2,
}: UseSkillRevealOptions = {}): UseSkillRevealReturn {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const getDelay = (index: number) => baseDelay + index * stagger

  return { containerRef, visible, getDelay }
}
