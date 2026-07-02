import { ProjectCard }   from '@components/ui/ProjectCard'
import { ProjectModal }  from '@components/ui/ProjectModal'
import { DevErrorPanel } from '@components/ui/DevErrorPanel'
import { PersonaTitle }  from '@components/ui/PersonaTitle'
import { useGithubProjects } from '@hooks/useGithubProjects'
import { useModal }      from '@hooks/useModal'
import { useReveal }     from '@hooks/useReveal'
import s from './Projetos.module.scss'
import type { Project }  from '@/types/project'

const Projetos = () => {
  const { projects, tags, activeTag, setActiveTag, total, loading, error, retry } = useGithubProjects()
  const { activeProject, isOpen, open, close } = useModal()
  const pageRef = useReveal<HTMLDivElement>({
    selector: '[data-reveal]',
    from:     'up',
    stagger:  0.08,
    trigger:  'top 95%',
  })

  return (
    <div className={s.page} ref={pageRef}>
      <div className={s.bg} aria-hidden="true" />

      <header className={s.header} data-reveal>
        <span className={s.eyebrow}>Trabalhos&nbsp;·&nbsp;02</span>
        <h1 className={s.title}><PersonaTitle text="Projetos" startDelay={200} /></h1>
        <p className={s.meta}>
          <span>{projects.length}</span> de <span>{total}</span> projetos
          {activeTag !== 'Todos' && <> · filtrado por <span>{activeTag}</span></>}
        </p>
      </header>

      <nav className={s.filterBar} aria-label="Filtrar por tecnologia" data-reveal>
        <span className={s.filterLabel}>Filtrar</span>
        {tags.map(tag => (
          <button key={tag}
            className={[s.filterTag, activeTag === tag ? s['filterTag--active'] : ''].join(' ')}
            onClick={() => setActiveTag(tag)} aria-pressed={activeTag === tag}>
            {tag}
          </button>
        ))}
      </nav>

      <ul className={s.grid} role="list" aria-live="polite">
        {error ? (
          <li className={s.empty}>
            <span className={s.emptyIcon}>⚠</span>
            <span className={s.emptyText}>{error}</span>
            <button onClick={retry} style={{
              marginTop:     12,
              cursor:        'pointer',
              color:         'white',
              background:    'transparent',
              border:        '1px solid var(--p5-red)',
              padding:       '8px 16px',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.85rem',
              letterSpacing: '0.05em',
            }}>
              Tentar novamente
            </button>
          </li>
        ) : loading ? (
          <li className={s.empty}>
            <span className={s.emptyIcon}>◆</span>
            <span className={s.emptyText}>Carregando projetos do GitHub...</span>
          </li>
        ) : projects.length === 0 ? (
          <li className={s.empty}>
            <span className={s.emptyIcon}>◆</span>
            <span className={s.emptyText}>Nenhum projeto encontrado</span>
          </li>
        ) : (
          projects.map((project: Project, i: number) => (
            <li key={project.id}>
              <ProjectCard project={project} index={i}
                enterDelay={i * 60} onClick={() => open(project)} />
            </li>
          ))
        )}
      </ul>

      <ProjectModal project={activeProject} isOpen={isOpen} onClose={close} />
      <DevErrorPanel />
    </div>
  )
}

export default Projetos
