import { NavLink } from 'react-router-dom'
import { navItems } from '@data/navigation'
import { useActiveSection } from '@hooks/useActiveSection'
import s from './BottomNav.module.scss'

// Ícones P5 por rota — símbolos geométricos, não ícones genéricos de app
const NAV_ICONS: Record<string, string> = {
  '/':             '◈',   // Sobre Mim — losango duplo
  '/sobre-mim':   '◈',
  '/projetos':     '▣',   // Projetos — quadrado
  '/experiencias': '▸',   // Experiências — seta de progressão
  '/certificados': '★',   // Certificados — estrela
  '/contato':      '◉',   // Contato — alvo/transmissão
}

// Labels curtas para caber em 44px
const NAV_LABELS: Record<string, string> = {
  '/':             'Início',
  '/sobre-mim':   'Sobre',
  '/projetos':     'Projetos',
  '/experiencias': 'Exp',
  '/certificados': 'Certs',
  '/contato':      'Contato',
}

/**
 * BottomNav — barra de navegação inferior para mobile.
 *
 * Visível apenas em telas < 640px (controlado via CSS display:none).
 * Usa os mesmos `navItems` da Navbar desktop para consistência.
 * Suporta safe-area-inset-bottom (notch do iPhone).
 */
export function BottomNav() {
  const activePath = useActiveSection()

  const isActive = (path: string) =>
    path === '/' ? activePath === '/' : activePath.startsWith(path)

  // Filtra /sobre-mim para não duplicar com / no mobile
  const mobileItems = navItems.filter(i => i.path !== '/sobre-mim')

  return (
    <nav className={s.nav} aria-label="Navegação mobile">
      {mobileItems.map(item => {
        const active = isActive(item.path)
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={[s.item, active ? s['item--active'] : ''].join(' ')}
            end={item.path === '/'}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            <div className={s.icon}>
              <div className={s.iconBg}   aria-hidden="true" />
              <span className={s.iconMark} aria-hidden="true">
                {NAV_ICONS[item.path] ?? '◆'}
              </span>
            </div>
            <span className={s.label}>
              {NAV_LABELS[item.path] ?? item.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
