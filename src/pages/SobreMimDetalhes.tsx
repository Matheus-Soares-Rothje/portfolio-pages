import { NavLink } from 'react-router-dom'
import { Button }       from '@components/ui/Button'
import { AnimatedStat } from '@components/ui/AnimatedStat'
import { SkillBar }     from '@components/ui/SkillBar'
import { PersonaTitle } from '@components/ui/PersonaTitle'
import { useSkillReveal } from '@hooks/useSkillReveal'
import { useReveal }     from '@hooks/useReveal'
import { useAboutData }  from '@hooks/useAboutData'
import s from './SobreMimDetalhes.module.scss'

const CHARACTER_IMG = '/persona-portfolio/assets/characters/sobre-mim-2.png'

// ─── Conteúdo padrão exibido enquanto os dados reais carregam (ou se falharem) ──
const FALLBACK_BIO =
  'Construo interfaces que habitam o espaço entre design e engenharia. ' +
  'React e TypeScript são minhas ferramentas — obsessão por detalhe é ' +
  'meu método. Cada projeto é um nível a ser completado.'

const FALLBACK_HARD_SKILLS = [
  { name: 'React / TSX',  level: 90 },
  { name: 'TypeScript',   level: 85 },
  { name: 'SCSS / CSS',   level: 88 },
  { name: 'Node.js',      level: 72 },
  { name: 'Vite / Build', level: 80 },
  { name: 'Git / CI',     level: 75 },
]

const TRAITS = [
  { value: '3+',    label: 'Anos de XP'     },
  { value: '12',    label: 'Projetos'        },
  { value: '8',     label: 'Tecnologias'     },
  { value: '100%',  label: 'Comprometimento' },
  { value: 'BR',    label: 'Localização'     },
  { value: 'TS',    label: 'Lang preferida'  },
]

const TIMELINE = [
  { period: '2024 — atual', role: 'Dev Front-End',       place: 'Freelancer · Projetos próprios'     },
  { period: '2023',         role: 'Estudos intensivos',  place: 'React · TypeScript · Design Systems' },
  { period: '2022',         role: 'Início na programação', place: 'HTML · CSS · JavaScript'           },
]

const SobreMimDetalhes = () => {
  const { data, loading, error, retry } = useAboutData()
  const { containerRef, visible, getDelay } = useSkillReveal({ baseDelay: 100, stagger: 100 })
  const sheetRef = useReveal<HTMLDivElement>({
    selector: '[data-reveal]',
    from:     'up',
    stagger:  0.09,
    trigger:  'top 90%',
  })

  // usa dados reais quando disponíveis; mantém o conteúdo padrão enquanto carrega/falha
  const bioParagraphs = !loading && !error && data && data.paragraphs.length > 0
    ? data.paragraphs
    : [FALLBACK_BIO]

  const hardSkills = !loading && !error && data && data.hardSkills.length > 0
    ? data.hardSkills
    : FALLBACK_HARD_SKILLS

  const traits = !loading && !error && data && data.anos !== null
    ? [{ value: `${data.anos}+`, label: 'Anos de XP' }, ...TRAITS.slice(1)]
    : TRAITS

  return (
    <div className={s.screen}>
      <div className={s.bg}      aria-hidden="true" />
      <div className={s.stripes} aria-hidden="true" />

      <div className={s.characterCol}>
        <div className={s.characterBg}     aria-hidden="true" />
        <div className={s.characterBgEdge} aria-hidden="true" />
        <div className={s.characterId}>
          <span className={s.characterIdLabel}>Ficha do Personagem</span>
          <div  className={s.characterIdName}>Matheus Rothje</div>
        </div>
        <img src={CHARACTER_IMG} alt="Personagem da seção Sobre Mim"
          className={s.character} draggable={false} />
        <div className={s.characterGlow} aria-hidden="true" />
      </div>

      <div className={s.sheet} ref={sheetRef}>

        <header className={s.sheetHeader} data-reveal>
          <span className={s.sheetEyebrow}>Ficha&nbsp;·&nbsp;01</span>
          <h1 className={s.sheetTitle}><PersonaTitle text="Sobre Mim" startDelay={200} /></h1>
          <div className={s.sheetDivider}><span>Status · Ativo</span></div>
        </header>

        <section className={s.bioBlock} aria-labelledby="bio-label" data-reveal>
          <div className={s.blockLabel} id="bio-label"><span>01</span>Perfil</div>
          {error && (
            <p className={s.bioText} style={{ opacity: 0.6 }}>
              {error}{' '}
              <button onClick={retry} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Tentar novamente
              </button>
            </p>
          )}
          {bioParagraphs.map((p, i) => (
            <p className={s.bioText} key={i}>{p}</p>
          ))}
        </section>

        <section aria-labelledby="skills-label" data-reveal>
          <div className={s.blockLabel} id="skills-label"><span>02</span>Arsenal técnico</div>
          <ul className={s.skillList} role="list"
            ref={containerRef as React.RefObject<HTMLUListElement>}>
            {hardSkills.map((sk, i) => (
              <SkillBar key={sk.name} name={sk.name} level={sk.level}
                visible={visible} delay={getDelay(i)} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="traits-label" data-reveal>
          <div className={s.blockLabel} id="traits-label"><span>03</span>Stats</div>
          <div className={s.traitGrid}>
            {traits.map((tr, i) => (
              <AnimatedStat key={tr.label} value={tr.value} label={tr.label}
                delay={i * 80} duration={1200 + i * 80} />
            ))}
          </div>
        </section>

        <section className={s.timelineBlock} aria-labelledby="timeline-label" data-reveal>
          <div className={s.blockLabel} id="timeline-label"><span>04</span>Linha do tempo</div>
          <ol className={s.timeline}>
            {TIMELINE.map(ev => (
              <li key={ev.period} className={s.timelineItem}>
                <div className={s.timelinePeriod}>{ev.period}</div>
                <div className={s.timelineRole}>{ev.role}</div>
                <div className={s.timelinePlace}>{ev.place}</div>
              </li>
            ))}
          </ol>
        </section>

        <footer className={s.sheetFooter} data-reveal>
          <NavLink to="/projetos">
            <Button variant="primary" size="lg" glowing>Ver Projetos</Button>
          </NavLink>
          <NavLink to="/contato">
            <Button variant="outline" size="lg">Contato</Button>
          </NavLink>
          <span className={s.footerHint}>Próxima seção</span>
        </footer>

      </div>
    </div>
  )
}

export default SobreMimDetalhes
