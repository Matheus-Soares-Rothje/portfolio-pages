import { NavLink }          from 'react-router-dom'
import { Button }           from '@components/ui/Button'
import { TimelineEntry }    from '@components/ui/TimelineEntry'
import { PersonaTitle }     from '@components/ui/PersonaTitle'
import { useTimelineReveal } from '@hooks/useTimelineReveal'
import { useReveal }         from '@hooks/useReveal'
import { useGithubExperiences } from '@hooks/useGithubExperiences'
import s from './Experiencias.module.scss'

const CHARACTER_IMG = '/persona-portfolio/assets/characters/experiencias.png'

const Experiencias = () => {
  const { experiences, loading, error, retry } = useGithubExperiences()
  const current = experiences.filter(e => e.isCurrent)
  const past    = experiences.filter(e => !e.isCurrent)
  const ordered = [...current, ...past]

  const { containerRef, isVisible } = useTimelineReveal({
    count:     ordered.length,
    baseDelay: 100,
    stagger:   200,
  })

  const logRef = useReveal<HTMLDivElement>({
    selector: '[data-reveal]',
    from:     'left',
    stagger:  0.1,
    trigger:  'top 90%',
  })

  return (
    <div className={s.screen}>

      {/* ── Fundo ────────────────────────────────────────────────── */}
      <div className={s.bg} aria-hidden="true" />

      {/* ── Coluna esquerda: personagem ──────────────────────────── */}
      <div className={s.characterCol}>
        <div className={s.characterBg}    aria-hidden="true" />
        <div className={s.characterEdge}  aria-hidden="true" />

        <div className={s.characterBadge}>
          <span className={s.badgeSection}>Histórico</span>
          <div  className={s.badgeName}>Carreira</div>
          <div  className={s.badgeCounter}>
            <span className={s.badgeCounterValue}>{experiences.length}</span>
            <span className={s.badgeCounterLabel}>
              {experiences.length === 1 ? 'Missão' : 'Missões'}
            </span>
          </div>
        </div>

        <img
          src={CHARACTER_IMG}
          alt="Personagem da seção Experiências"
          className={s.character}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
        <div className={s.characterGlow} aria-hidden="true" />
      </div>

      {/* ── Coluna direita: log de missões ───────────────────────── */}
      <div className={s.logCol} ref={logRef}>

        {/* Cabeçalho */}
        <header className={s.logHeader} data-reveal>
          <span className={s.logEyebrow}>Histórico&nbsp;·&nbsp;03</span>
          <h1 className={s.logTitle}><PersonaTitle text="Experiências" startDelay={200} /></h1>
          <div className={s.logDivider}>
            <span>
              {current.length > 0
                ? `${current.length} ativa · ${past.length} concluída${past.length !== 1 ? 's' : ''}`
                : `${experiences.length} entrada${experiences.length !== 1 ? 's' : ''}`
              }
            </span>
          </div>
        </header>

        {/* Timeline */}
        {error ? (
          <div className={s.logHeader}>
            <p>{error}</p>
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
          </div>
        ) : loading ? (
          <div className={s.logHeader}><p>Carregando experiências...</p></div>
        ) : (
          <ol
            className={s.timeline}
            ref={containerRef}
            aria-label="Histórico de experiências"
          >
            {ordered.map((exp, i) => (
              <TimelineEntry
                key={exp.id}
                experience={exp}
                index={i}
                visible={isVisible(i)}
              />
            ))}
          </ol>
        )}

        {/* Rodapé */}
        <footer className={s.logFooter} data-reveal>
          <NavLink to="/certificados">
            <Button variant="primary" size="lg" glowing>
              Certificados
            </Button>
          </NavLink>
          <NavLink to="/contato">
            <Button variant="outline" size="lg">
              Contato
            </Button>
          </NavLink>
          <span className={s.logFooterHint}>Próxima seção</span>
        </footer>

      </div>
    </div>
  )
}

export default Experiencias
