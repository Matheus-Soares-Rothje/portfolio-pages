import type { Experience } from '@/types'
import s from './TimelineEntry.module.scss'

interface TimelineEntryProps {
  experience: Experience
  index:      number
  visible:    boolean
}

/**
 * TimelineEntry — item animado da timeline de experiências.
 *
 * Quando `visible` muda para true, as animações disparam em sequência:
 *   0ms   → entry slide-in (translateX + fade)
 *   150ms → marker stamp (scale + rotate)
 *   100ms → card wipe (clip-path da esquerda)
 *            + sweep vermelho passa pelo card
 *   350ms → conteúdo interno fade-in
 *   100ms → linha vertical cresce até o próximo item (CSS transition)
 *
 * O marcador e a linha são elementos separados do card para que
 * o clip-path do card não corte o marcador.
 */
export function TimelineEntry({ experience: exp, index, visible }: TimelineEntryProps) {
  const isCurrent = exp.isCurrent

  const cls = [
    s.entry,
    isCurrent    ? s['entry--current'] : s['entry--past'],
    visible      ? s['entry--visible'] : '',
  ].filter(Boolean).join(' ')

  return (
    <li className={cls} aria-label={`${exp.role} na ${exp.company}`}>

      {/* Segmento da linha vertical (cresce via CSS transition) */}
      <div className={s.line} aria-hidden="true" />

      {/* Marcador losango */}
      <div className={s.markerWrap} aria-hidden="true">
        <div className={s.marker} />
        <div className={s.markerRing} />
      </div>

      {/* Card de conteúdo */}
      <div className={s.card}>
        {/* Sweep vermelho que cruza o card na entrada */}
        <div className={s.cardSweep} aria-hidden="true" />

        <div className={s.cardInner}>

          {/* Status + período */}
          <div className={s.entryTop}>
            <span className={s.entryStatus}>
              {isCurrent ? '● Ativo' : '✓ Concluído'}
            </span>
            <span className={s.entryPeriod}>{exp.period}</span>
          </div>

          {/* Cargo e empresa */}
          <div className={s.entryRole}>
            <h2 className={s.entryRoleTitle}>{exp.role}</h2>
            <span className={s.entryCompany}>{exp.company}</span>
          </div>

          {/* Descrição */}
          <p className={s.entryDesc}>{exp.description}</p>

        </div>
      </div>
    </li>
  )
}
