import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from '@data/navigation'
import { useReveal } from '@hooks/useReveal'
import { PersonaTitle } from '@components/ui/PersonaTitle'
import s from './SobreMim.module.scss'

const CHARACTER_IMG = '/persona-portfolio/assets/characters/sobre-mim.png'

const OWNER = {
  firstName: 'Matheus',
  lastName:  'Rothje',
  role:      'Full Stack Dev',
}

const STATS = [
  { label: 'Anos XP',   value: '2+'  },
  { label: 'Projetos',  value: '5+'  },
  { label: 'Stack',     value: 'PY'  },
]

/**
 * SobreMim — tela inicial estilo videogame.
 *
 * Personagem ocupa a tela inteira.
 * Painéis de HUD ficam sobrepostos: nome (canto inferior esquerdo),
 * menu de seções (direita) e prompt de ação (rodapé).
 */
const SobreMim = () => {
  const [blink, setBlink] = useState(true)
  const screenRef = useReveal<HTMLDivElement>({
    selector: '[data-reveal]',
    from:     'left',
    stagger:  0.07,
    trigger:  'top 100%',
  })

  // cursor piscante no prompt
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={s.screen} ref={screenRef}>

      {/* ── Camadas de fundo ─────────────────────────────────────── */}
      <div className={s.scanline}  aria-hidden="true" />
      <div className={s.vignette} aria-hidden="true" />
      <div className={s.stripes}  aria-hidden="true" />

      {/* ── Personagem — full screen ─────────────────────────────── */}
      <div className={s.characterWrap} aria-hidden="true">
        <div className={s.characterShadow} />
        <img
          src={CHARACTER_IMG}
          alt=""
          className={s.character}
          draggable={false}
          fetchPriority="high"
          decoding="async"
        />
        {/* glow de chão */}
        <div className={s.groundGlow} />
      </div>

      {/* ── HUD: faixa superior ──────────────────────────────────── */}
      <div className={s.hudTop} aria-hidden="true" data-reveal>
        <span className={s.hudTopLabel}>PORTFOLIO&nbsp;&nbsp;·&nbsp;&nbsp;v1.0</span>
        <span className={s.hudTopRight}>
          <span className={s.liveIndicator} />
          ONLINE
        </span>
      </div>

      {/* ── HUD: painel de nome (inferior esquerdo) ──────────────── */}
      <div className={s.namePanel} data-reveal>
        <div className={s.namePanelInner}>
          <span className={s.namePanelEyebrow}>{OWNER.role}</span>
          <div className={s.namePanelName}>
            <PersonaTitle text={OWNER.firstName} startDelay={100} stagger={60} fontSize="clamp(2.4rem,5vw,4.2rem)" />
            <PersonaTitle text={OWNER.lastName}  startDelay={400} stagger={60} fontSize="clamp(2.4rem,5vw,4.2rem)" accentColor="var(--p5-red)" />
          </div>
          <div className={s.stats}>
            {STATS.map(st => (
              <div key={st.label} className={s.stat}>
                <span className={s.statValue}>{st.value}</span>
                <span className={s.statLabel}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* linha de corte diagonal */}
        <div className={s.namePanelCut} aria-hidden="true" />
      </div>

      {/* ── HUD: menu de seções (direita) ────────────────────────── */}
      <nav className={s.sectionMenu} aria-label="Seções" data-reveal>
        <span className={s.sectionMenuLabel}>SELECIONAR</span>
        <ul className={s.sectionList} role="list">
          {navItems.map((item, i) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  [s.sectionItem, isActive ? s['sectionItem--active'] : ''].join(' ')
                }
              >
                <span className={s.sectionItemIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={s.sectionItemLabel}>{item.label}</span>
                <span className={s.sectionItemArrow} aria-hidden="true">▶</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── HUD: prompt de rodapé ────────────────────────────────── */}
      <div className={s.prompt} aria-label="Pressione Enter para continuar">
        <span className={s.promptIcon} aria-hidden="true">●</span>
        <span className={s.promptText}>PRESSIONE</span>
        <span className={s.promptKey}>ENTER</span>
        <span className={s.promptText}>PARA CONTINUAR</span>
        <span className={s.promptCursor} aria-hidden="true"
          style={{ opacity: blink ? 1 : 0 }}>▮</span>
      </div>

      {/* ── Número de seção fantasma ─────────────────────────────── */}
      <span className={s.bgNumber} aria-hidden="true">01</span>

    </div>
  )
}

export default SobreMim
