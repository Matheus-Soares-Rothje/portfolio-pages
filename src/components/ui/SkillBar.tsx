import { useState, useEffect, useRef } from 'react'
import s from './SkillBar.module.scss'

interface SkillBarProps {
  name: string
  /** Nível de 0–100 */
  level: number
  /** Se true, anima a barra (controlado pelo pai via useSkillReveal) */
  visible: boolean
  /** Delay de animação em ms */
  delay?: number
}

/**
 * SkillBar — barra de habilidade estilo RPG com:
 * - Reveal (fade + slide) quando `visible` muda para true
 * - Fill animado de 0% → level% com shimmer sobre a barra
 * - Partícula de impacto losango quando a barra termina
 * - Número do nível em vermelho ao concluir
 */
export function SkillBar({ name, level, visible, delay = 0 }: SkillBarProps) {
  const [filled,   setFilled  ] = useState(false)
  const [done,     setDone    ] = useState(false)
  const [showImpact, setShowImpact] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  useEffect(() => {
    if (!visible) return

    // Aguarda o delay de stagger antes de preencher
    timerRef.current = setTimeout(() => {
      setFilled(true)

      // duração do fill CSS (ver transition no SCSS)
      const fillDuration = prefersReduced ? 0 : 400

      timerRef.current = setTimeout(() => {
        setDone(true)
        setShowImpact(true)

        // Remove a partícula depois da animação
        timerRef.current = setTimeout(() => setShowImpact(false), 600)
      }, fillDuration)

    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, delay, prefersReduced])

  const fillDurationMs = prefersReduced ? 0 : 400

  return (
    <li
      className={[s.row, visible ? s['row--visible'] : ''].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className={s.name}>{name}</span>

      <div
        className={s.track}
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={name}
      >
        <div
          className={[s.fill, filled ? s['fill--animating'] : ''].join(' ')}
          style={{
            width:             filled ? `${level}%` : '0%',
            transitionDuration:`${fillDurationMs}ms`,
            transitionDelay:   `${delay}ms`,
          }}
        />

        {/* Partícula de impacto posicionada na ponta da barra */}
        {showImpact && (
          <span
            className={s.impact}
            aria-hidden="true"
            style={{ left: `${level}%` }}
          />
        )}
      </div>

      <span className={[s.level, done ? s['level--done'] : ''].join(' ')}>
        {level}
      </span>
    </li>
  )
}
