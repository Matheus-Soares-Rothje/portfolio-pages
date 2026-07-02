import { useRef, useCallback, useState } from 'react'
import { TechIcon } from '@components/ui/TechIcon'
import type { Certificate } from '@/types'
import s from './CollectibleCard.module.scss'

interface CollectibleCardProps {
  cert:       Certificate
  index:      number
  enterDelay?: number
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const MAX_TILT  = 14    // graus máximos de tilt
const TILT_EASE = '0.1s linear'
const REST_EASE = '0.7s var(--ease-out-expo)'

/**
 * Raridade baseada no ano (quanto mais recente, mais raro).
 * Retorna 1–3 para exibir estrelas no cabeçalho.
 */
function getRarity(year: number): number {
  const current = new Date().getFullYear()
  const age = current - year
  if (age <= 1) return 3
  if (age <= 2) return 2
  return 1
}

/**
 * CollectibleCard — carta colecionável 3D.
 *
 * Estado de repouso: frente visível, tilt via mousemove.
 * Clique: flip para o verso (rotateY 180°), mantendo o tilt.
 * Clique no verso: flip de volta.
 *
 * O transform composto é calculado manualmente para combinar
 * tilt (rotateX/Y pelo mouse) + flip (rotateY ±180°):
 *   transform = `rotateX(${rx}deg) rotateY(${ry + flip}deg)`
 *
 * O holograma iridescente usa --mx/--my para posicionar o gradiente
 * E --angle para rotacionar o espectro de cores conforme o mouse se move.
 */
export function CollectibleCard({ cert, index, enterDelay = 0 }: CollectibleCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const rafRef   = useRef<number>(0)
  const tiltRef  = useRef({ rx: 0, ry: 0 })
  const [flipped, setFlipped] = useState(false)
  const rarity = getRarity(cert.year)

  // ── Tilt via mousemove ────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      const nx   = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2
      const ny   = ((e.clientY - rect.top)   / rect.height - 0.5) * 2

      const rx   = -ny * MAX_TILT
      const ry   =  nx * MAX_TILT
      tiltRef.current = { rx, ry }

      const flipDeg = flipped ? 180 : 0
      const mx = ((e.clientX - rect.left)  / rect.width  * 100).toFixed(1)
      const my = ((e.clientY - rect.top)   / rect.height * 100).toFixed(1)
      // Ângulo do espectro iridescente: muda com a posição horizontal
      const angle = (135 + nx * 40).toFixed(1)

      card.style.transform  = `rotateX(${rx}deg) rotateY(${ry + flipDeg}deg)`
      card.style.transition = `transform ${TILT_EASE}`
      card.style.setProperty('--mx',    `${mx}%`)
      card.style.setProperty('--my',    `${my}%`)
      card.style.setProperty('--angle', `${angle}deg`)
    })
  }, [flipped])

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const card = cardRef.current
    if (!card) return
    tiltRef.current = { rx: 0, ry: 0 }
    const flipDeg = flipped ? 180 : 0
    card.style.transform  = `rotateX(0deg) rotateY(${flipDeg}deg)`
    card.style.transition = `transform ${REST_EASE}`
    card.style.setProperty('--mx',    '50%')
    card.style.setProperty('--my',    '50%')
    card.style.setProperty('--angle', '135deg')
  }, [flipped])

  // ── Flip no clique ────────────────────────────────────────────────────────
  const onFlip = useCallback((e: React.MouseEvent) => {
    // Não propaga para links dentro do verso
    if ((e.target as HTMLElement).tagName === 'A') return
    const card = cardRef.current
    if (!card) return

    const next    = !flipped
    const { rx, ry } = tiltRef.current
    const flipDeg = next ? 180 : 0

    card.style.transform  = `rotateX(${rx}deg) rotateY(${ry + flipDeg}deg)`
    card.style.transition = `transform ${REST_EASE}`
    setFlipped(next)
  }, [flipped])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={s.scene}>
      <div
        className={s.card}
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onFlip}
        style={{ animationDelay: `${enterDelay}ms` }}
        role="button"
        tabIndex={0}
        aria-label={`Certificado ${cert.name} — clique para virar`}
        aria-pressed={flipped}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onFlip(e as unknown as React.MouseEvent) }}
      >
        {/* ── FRENTE ─────────────────────────────────────────────── */}
        <div className={s.front} aria-hidden={flipped}>

          {/* Holograma iridescente */}
          <div className={s.holo} aria-hidden="true" />

          {/* Triângulo de canto */}
          <span className={s.cornerTR} aria-hidden="true" />

          {/* Cabeçalho: tipo + raridade */}
          <div className={s.cardHeader}>
            <span className={s.cardType}>Certificado</span>
            <span className={s.cardRarity} data-rarity={rarity} aria-label={`Raridade: ${rarity} estrela${rarity > 1 ? 's' : ''}`} />
          </div>

          {/* Área do ícone */}
          <div className={s.iconArea}>
            <div className={s.iconHex}>
              <div className={s.iconGlow} aria-hidden="true" />
              <TechIcon icon={cert.icon} size={44} />
            </div>
            <span className={s.iconYear}>{cert.year}</span>
          </div>

          {/* Divisor holográfico */}
          <div className={s.holoDivider} aria-hidden="true" />

          {/* Info */}
          <div className={s.cardInfo}>
            <h2 className={s.cardName}>{cert.name}</h2>
            <span className={s.cardPlatform}>{cert.platform}</span>
          </div>

          {/* Rodapé */}
          <div className={s.cardFooter}>
            <span className={s.unlockedBadge}>Desbloqueado</span>
            <span className={s.flipHint} aria-hidden="true">Virar</span>
          </div>
        </div>

        {/* ── VERSO ──────────────────────────────────────────────── */}
        <div className={s.back} aria-hidden={!flipped}>
          <div className={s.backPattern} aria-hidden="true" />

          {/* Marca d'água / logo */}
          <div className={s.backLogo}>
            <div className={s.backLogoMark}>PORT</div>
            <div className={s.backLogoSub}>Folio</div>
          </div>

          {/* Info do certificado */}
          <div className={s.backCertInfo}>
            <p className={s.backCertName}>{cert.name}</p>
            <span className={s.backCertMeta}>{cert.platform} · {cert.year}</span>
          </div>

          {/* Link (se disponível) */}
          {cert.url
            ? <a href={cert.url} target="_blank" rel="noopener noreferrer" className={s.backLink}>
                Ver certificado
              </a>
            : null
          }

          <span className={s.backHint} aria-hidden="true">Virar de volta</span>
        </div>

      </div>

      {/* Sombra dinâmica */}
      <div className={s.shadow} aria-hidden="true" />
    </div>
  )
}
