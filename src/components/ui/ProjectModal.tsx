import { useEffect, useRef } from 'react'
import { createPortal }  from 'react-dom'
import { TagBadge }      from '@components/ui/TagBadge'
import type { Project }  from '@/types/project'
import s from './ProjectModal.module.scss'

interface ProjectModalProps {
  project: Project | null
  isOpen:  boolean
  onClose: () => void
}

/**
 * ProjectModal — modal premium de projeto estilo Persona 5.
 *
 * Renderizado via portal em document.body (acima do nav/layout).
 *
 * Animações:
 * - Backdrop: fade in/out
 * - Painel:   scale + translateY (stamp suave)
 * - Sweep:    wipe diagonal vermelho que revela e depois some
 * - Imagem:   clip-path reveal da esquerda
 * - Ficha:    slide from right
 *
 * Acessibilidade:
 * - role="dialog" + aria-modal + aria-labelledby
 * - Focus trap: foco vai para o painel ao abrir, volta ao trigger ao fechar
 * - Fecha com Escape (gerenciado pelo useModal)
 * - Fecha ao clicar no backdrop
 */
export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const panelRef    = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Foco no botão de fechar ao abrir
  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus()
    }
  }, [isOpen])

  // Focus trap: Tab dentro do modal
  useEffect(() => {
    if (!isOpen) return

    const panel = panelRef.current
    if (!panel) return

    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  // Não renderiza nada se não houver projeto (nem durante o fade-out)
  if (!project) return null

  const closing = !isOpen

  return createPortal(
    <div
      className={[s.backdrop, closing ? s['backdrop--closing'] : ''].join(' ')}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={[s.panel, closing ? s['panel--closing'] : ''].join(' ')}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        {/* Sweep diagonal de entrada */}
        <div className={s.sweep} aria-hidden="true" />

        {/* Decoração de fundo */}
        <div className={s.bg} aria-hidden="true" />

        {/* Corte do canto inferior direito */}
        <div className={s.cornerAccent} aria-hidden="true" />

        {/* ── Header ───────────────────────────────────────────────── */}
        <header className={s.header}>
          <div className={s.headerLeft}>
            <span className={s.headerEyebrow}>Projeto</span>
            <h2 id="modal-title" className={s.headerTitle}>
              {project.title}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            className={s.closeBtn}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </header>

        {/* ── Body: imagem + ficha ─────────────────────────────────── */}
        <div className={s.body}>

          {/* Imagem */}
          <div className={s.imageCol}>
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className={s.image}
              />
            ) : (
              <div className={s.imagePlaceholder}>
                <span className={s.placeholderIndex}>
                  {project.id.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div className={s.imageOverlay}  aria-hidden="true" />
            <div className={s.imageDivider}  aria-hidden="true" />
          </div>

          {/* Ficha de detalhes */}
          <div className={s.detailCol}>

            {/* Descrição */}
            <div className={s.section}>
              <span className={s.sectionLabel}>Descrição</span>
              <p className={s.description}>{project.description}</p>
            </div>

            {/* Stack */}
            <div className={s.section}>
              <span className={s.sectionLabel}>Stack</span>
              <div className={s.tags}>
                {project.tags.map(tag => (
                  <TagBadge key={tag}>{tag}</TagBadge>
                ))}
              </div>
            </div>

            {/* Links */}
            {(project.liveUrl || project.repoUrl) && (
              <div className={s.links}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${s.link} ${s['link--live']}`}
                  >
                    <span className={s.linkIcon} aria-hidden="true">◆</span>
                    Ver projeto ao vivo
                    <span className={s.linkArrow} aria-hidden="true">▶</span>
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${s.link} ${s['link--repo']}`}
                  >
                    <span className={s.linkIcon} aria-hidden="true">◇</span>
                    Ver código no GitHub
                    <span className={s.linkArrow} aria-hidden="true">▶</span>
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
