import { NavLink }        from 'react-router-dom'
import { Button }         from '@components/ui/Button'
import { CollectibleCard } from '@components/ui/CollectibleCard'
import { PersonaTitle }   from '@components/ui/PersonaTitle'
import { useReveal }      from '@hooks/useReveal'
import { useGithubCerts } from '@hooks/useGithubCerts'
import s from './Certificados.module.scss'

const CHARACTER_IMG = '/persona-portfolio/assets/characters/certificados.png'

const Certificados = () => {
  const { certificates, loading, error, retry } = useGithubCerts()
  const years  = [...new Set(certificates.map(c => c.year))].sort((a, b) => b - a)
  const total  = certificates.length

  const contentRef = useReveal<HTMLDivElement>({
    selector: '[data-reveal]',
    from:     'up',
    stagger:  0.09,
    trigger:  'top 95%',
  })

  return (
    <div className={s.screen}>

      <div className={s.bg} aria-hidden="true" />

      <div className={s.characterBg} aria-hidden="true">
        <div className={s.characterHalo} />
        <img
          src={CHARACTER_IMG}
          alt=""
          className={s.character}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={s.content} ref={contentRef}>

        <header className={s.header} data-reveal>
          <span className={s.eyebrow}>Conquistas&nbsp;·&nbsp;04</span>
          <h1 className={s.title}>
            <PersonaTitle text="Certificados" startDelay={200} />
          </h1>
          <div className={s.divider}>
            <span>
              {loading
                ? 'Carregando...'
                : error
                  ? 'Erro ao carregar'
                  : `${total} desbloqueado${total !== 1 ? 's' : ''}${years.length > 1 ? ` · ${years[years.length - 1]}–${years[0]}` : ''}`
              }
            </span>
          </div>
        </header>

        {error ? (
          <div style={{ padding: '2rem 0', color: 'var(--p5-red)' }}>
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
          <div style={{ padding: '2rem 0', color: 'rgba(255,255,255,0.5)' }}>
            Carregando certificados...
          </div>
        ) : (
          <ul className={s.grid} role="list" aria-label="Cartas de certificados">
            {certificates.map((cert, i) => (
              <li key={cert.id}>
                <CollectibleCard
                  cert={cert}
                  index={i}
                  enterDelay={100 + i * 80}
                />
              </li>
            ))}
          </ul>
        )}

        <footer className={s.footer} data-reveal>
          <NavLink to="/contato">
            <Button variant="primary" size="lg" glowing>
              Contato
            </Button>
          </NavLink>
          <NavLink to="/projetos">
            <Button variant="outline" size="lg">
              Projetos
            </Button>
          </NavLink>
          <span className={s.footerHint}>Próxima seção</span>
        </footer>

      </div>
    </div>
  )
}

export default Certificados
