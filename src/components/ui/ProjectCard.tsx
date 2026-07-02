import { useRef, useCallback } from 'react'
import { TagBadge } from '@components/ui/TagBadge'
import type { Project } from '@/types/project'
import s from './ProjectCard.module.scss'

interface ProjectCardProps {
  project:     Project
  index:       number
  enterDelay?: number
  onClick?:    () => void
}

const MAX_ROTATE = 10
const EASE_OUT   = 0.65

export function ProjectCard({ project, index, enterDelay = 0, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number>(0)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
      const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1)
      const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1)
      card.style.transform  = `rotateX(${-ny * MAX_ROTATE}deg) rotateY(${nx * MAX_ROTATE}deg)`
      card.style.transition = 'transform 0.1s linear'
      card.style.setProperty('--mx', `${mx}%`)
      card.style.setProperty('--my', `${my}%`)
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const card = cardRef.current
    if (!card) return
    card.style.transform  = 'rotateX(0deg) rotateY(0deg)'
    card.style.transition = `transform ${EASE_OUT}s var(--ease-out-expo)`
    card.style.setProperty('--mx', '50%')
    card.style.setProperty('--my', '50%')
  }, [])

  const indexStr = String(index + 1).padStart(2, '0')

  return (
    <div
      className={s.scene}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        className={s.card}
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ animationDelay: `${enterDelay}ms` }}
      >
        {/* Sombra vermelha 3D no chão */}
        <div className={s.shadow} aria-hidden="true" />

        <div className={s.face}>
          {/* Reflexo de luz */}
          <div className={s.glowLayer} aria-hidden="true" />

          {/* Cantos */}
          <span className={s.cornerTR} aria-hidden="true" />
          <span className={s.cornerBL} aria-hidden="true" />

          {/* ── HUD superior: número + tipo + status ── */}
          <div className={s.hudTop}>
            <span className={s.hudIndex}>{indexStr}</span>
            <span className={s.hudType}>Projeto</span>
            <span className={s.hudStatus} aria-hidden="true">Ativo</span>
          </div>

          {/* ── Imagem com camadas de overlay ── */}
          <div className={s.image}>
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                onError={e => {
                  const wrap = e.currentTarget.closest(`.${s.image}`) as HTMLElement | null
                  if (!wrap) return
                  e.currentTarget.remove()
                  const ph = document.createElement('div')
                  ph.className = s.imagePlaceholder
                  ph.innerHTML = `<span class="${s.placeholderIndex}">${indexStr}</span>`
                  wrap.appendChild(ph)
                }}
              />
            ) : (
              <div className={s.imagePlaceholder}>
                <span className={s.placeholderIndex}>{indexStr}</span>
              </div>
            )}
            <div className={s.imageScanlines} aria-hidden="true" />
            <div className={s.imageFooter}    aria-hidden="true" />
          </div>

          {/* ── Ficha de dados ── */}
          <div className={s.body}>
            <h2 className={s.title}>{project.title}</h2>
            <p  className={s.desc}>{project.description}</p>
            <div className={s.tags}>
              {project.tags.map(tag => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
          </div>

          {/* ── Rodapé: prompt + links externos ── */}
          <div className={s.footer}>
            <span className={s.footerPrompt} aria-hidden="true">▶ Selecionar</span>
            {(project.liveUrl || project.repoUrl) && (
              <div className={s.links}>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className={s.link} onClick={e => e.stopPropagation()}>
                    Live
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                    className={s.link} onClick={e => e.stopPropagation()}>
                    Git
                  </a>
                )}
              </div>
            )}
          </div>

        </div>{/* /face */}
      </div>{/* /card */}
    </div>
  )
}
