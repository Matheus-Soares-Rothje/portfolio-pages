import { useMemo } from 'react'
import s from './PersonaTitle.module.scss'

interface PersonaTitleProps {
  /** Texto do título — cada letra recebe delay escalonado */
  text: string
  /** Cor base da linha decorativa e dos caracteres (padrão: vermelho P5) */
  accentColor?: string
  /** Tamanho da fonte (padrão: clamp(2.8rem, 6vw, 5rem)) */
  fontSize?: string
  /** Delay inicial antes de começar a animar (ms) */
  startDelay?: number
  /** Delay entre cada letra (ms) */
  stagger?: number
  className?: string
}

/**
 * PersonaTitle — título animado no estilo do Persona 5.
 *
 * Usa a fonte original UXFont.ttf extraída do persona-menu (ant-8/persona-menu).
 * Cada letra é um `<span>` independente que cai de cima com um pequeno delay
 * escalonado, replicando o efeito "stamp" característico do jogo.
 */
export function PersonaTitle({
  text,
  accentColor = 'var(--p5-red)',
  fontSize,
  startDelay = 0,
  stagger = 55,
  className = '',
}: PersonaTitleProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <span
      className={`${s.root} ${className}`}
      aria-label={text}
      style={{ fontSize: fontSize ?? undefined }}
    >
      {/* linha decorativa diagonal antes do texto */}
      <span
        className={s.accent}
        style={{ background: accentColor }}
        aria-hidden="true"
      />

      {letters.map((char, i) => (
        <span
          key={i}
          className={s.letter}
          aria-hidden="true"
          style={{
            animationDelay: `${startDelay + i * stagger}ms`,
            color: char === ' ' ? 'transparent' : undefined,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
