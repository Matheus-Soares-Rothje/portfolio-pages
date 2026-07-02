import { useState } from 'react'
import { NavLink }      from 'react-router-dom'
import { Button }       from '@components/ui/Button'
import { PersonaTitle } from '@components/ui/PersonaTitle'
import { useReveal }    from '@hooks/useReveal'
import { contactItems } from '@data/contact'
import { shareSite }    from '@lib/share'
import type { ContactType } from '@/types'
import s from './Contato.module.scss'

const CHARACTER_IMG = '/persona-portfolio/assets/characters/contato.png'

const ICONS: Record<ContactType, string> = {
  email:     '✉',
  phone:     '☎',
  github:    '⌬',
  linkedin:  'in',
  twitter:   '𝕏',
  instagram: '◎',
}

const CHANNEL_DELAYS = [0.18, 0.26, 0.34, 0.42, 0.50, 0.58]

const Contato = () => {
  const [shareLabel, setShareLabel] = useState('Compartilhar portfólio')

  const handleShare = async () => {
    const result = await shareSite()
    if (result.status === 'copied') {
      setShareLabel('Link copiado!')
      setTimeout(() => setShareLabel('Compartilhar portfólio'), 2000)
    }
  }

  const panelRef = useReveal<HTMLDivElement>({
    selector: '[data-reveal]',
    from:     'left',
    stagger:  0.09,
    trigger:  'top 95%',
  })

  return (
    <div className={s.screen}>

      <div className={s.bg} aria-hidden="true" />

      <div className={s.panel} ref={panelRef}>

        {/* HUD superior */}
        <div className={s.panelHud} data-reveal>
          <div className={s.hudLeft}>
            <span className={s.hudLabel}>Canal ativo</span>
            <span className={s.hudTitle}>COMM</span>
          </div>
          <div className={s.signalWrap} aria-label="Sinal forte">
            <span className={s.signalLabel}>Sinal</span>
            <div className={s.signalBars} aria-hidden="true">
              <span className={s.signalBar} />
              <span className={s.signalBar} />
              <span className={s.signalBar} />
              <span className={s.signalBar} />
            </div>
          </div>
        </div>

        {/* Cabeçalho */}
        <header className={s.panelHeader} data-reveal>
          <span className={s.headerEyebrow}>Canal&nbsp;05</span>
          <h1 className={s.headerTitle}><PersonaTitle text="Contato" startDelay={200} /></h1>
          <p className={s.headerDesc}>
            Disponível para projetos freelance, oportunidades e colaborações.
            Escolha um canal de comunicação abaixo.
          </p>
        </header>

        {/* Lista de canais */}
        <nav className={s.channelList} aria-label="Canais de contato" data-reveal>
          <span className={s.channelLabel}>Canais disponíveis</span>

          {contactItems.map((item, i) => (
            <a
              key={item.type}
              href={item.url}
              className={s.channel}
              target={item.url.startsWith('http') ? '_blank' : undefined}
              rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ animationDelay: `${CHANNEL_DELAYS[i] ?? 0.6}s` }}
              aria-label={`${item.label}: ${item.value}`}
            >
              <span className={s.channelIcon} aria-hidden="true">
                {ICONS[item.type] ?? '◆'}
              </span>
              <div className={s.channelBody}>
                <span className={s.channelName}>{item.label}</span>
                <span className={s.channelValue}>{item.value}</span>
              </div>
              <span className={s.channelArrow} aria-hidden="true">▶</span>
            </a>
          ))}
        </nav>

        {/* Rodapé */}
        <footer className={s.panelFooter} data-reveal>
          <span className={s.footerHint}>Resposta em até 48h</span>
          <div className={s.footerActions}>
            <NavLink to="/">
              <Button variant="outline" size="md">Voltar ao início</Button>
            </NavLink>
            <NavLink to="/projetos">
              <Button variant="primary" size="md" glowing>Ver projetos</Button>
            </NavLink>
            <Button variant="outline" size="md" onClick={handleShare}>
              {shareLabel}
            </Button>
          </div>
        </footer>

      </div>

      {/* Coluna direita — personagem */}
      <div className={s.characterCol}>
        <div className={s.characterBg}   aria-hidden="true" />
        <div className={s.characterEdge} aria-hidden="true" />
        <span className={s.bgNumber}     aria-hidden="true">05</span>
        <img src={CHARACTER_IMG} alt="" className={s.character} draggable={false} />
        <div className={s.characterGlow} aria-hidden="true" />
      </div>

    </div>
  )
}

export default Contato
