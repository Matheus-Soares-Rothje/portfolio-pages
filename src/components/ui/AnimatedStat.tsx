import { useCountUp } from '@hooks/useCountUp'
import s from './AnimatedStat.module.scss'

interface AnimatedStatProps {
  /** Valor numérico final. Se string pura (ex: "BR"), renderiza sem animação. */
  value: string
  label: string
  /** Delay de entrada do card em ms */
  delay?: number
  /** Duração da contagem em ms. Default: 1400 */
  duration?: number
}

/**
 * Detecta se o valor é numérico (com sufixo opcional como "+" ou "%").
 * Ex: "3+"  → numericPart=3, suffix="+"
 *     "12"  → numericPart=12, suffix=""
 *     "100%"→ numericPart=100, suffix="%"
 *     "BR"  → isNumeric=false
 */
function parseValue(value: string): { isNumeric: boolean; num: number; suffix: string } {
  const match = value.match(/^(\d+)([^0-9]*)$/)
  if (match) {
    return { isNumeric: true, num: parseInt(match[1], 10), suffix: match[2] }
  }
  return { isNumeric: false, num: 0, suffix: '' }
}

/**
 * AnimatedStat — card de atributo com contagem numérica animada.
 *
 * Valores numéricos (ex: "12", "3+", "100%") animam de 0 até o alvo
 * quando entram na viewport. Valores textuais (ex: "BR", "TS") são
 * exibidos diretamente com stamp animation.
 */
export function AnimatedStat({ value, label, delay = 0, duration = 1400 }: AnimatedStatProps) {
  const parsed = parseValue(value)

  const { value: count, ref, done } = useCountUp({
    target:   parsed.isNumeric ? parsed.num : 0,
    duration,
    delay,
    easing:   'easeOutExpo',
    triggerOnView: true,
  })

  return (
    <div
      className={`${s.card} ${s['card--entering']}`}
      style={{ animationDelay: `${delay}ms` }}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      {parsed.isNumeric ? (
        <div className={s.value}>
          <span className={s.number} aria-live="polite" aria-atomic="true">
            {count}
          </span>
          {parsed.suffix && (
            <span className={s.suffix} aria-hidden="true">{parsed.suffix}</span>
          )}
        </div>
      ) : (
        <div className={s.textValue} aria-label={value}>
          {value}
        </div>
      )}

      <span className={s.label}>{label}</span>

      {/* Losango pulsante aparece quando a contagem termina */}
      {(done || !parsed.isNumeric) && (
        <span className={s.donePulse} aria-hidden="true" />
      )}
    </div>
  )
}
