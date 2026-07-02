import { navItems } from '@data/navigation'
import { useActiveSection } from '@hooks/useActiveSection'
import { Logo } from './Logo'
import { NavItem } from './NavItem'
import s from './Navbar.module.scss'

/**
 * Navbar — coluna lateral fixa de navegação estilo Persona 5.
 *
 * Desktop: aside vertical à esquerda (220px).
 * Mobile:  barra horizontal no topo (scroll horizontal).
 *
 * Lê `navItems` de @data/navigation e determina o item ativo
 * via `useActiveSection()` (pathname atual do HashRouter).
 */
export function Navbar() {
  const activePath = useActiveSection()

  /**
   * Compara o pathname atual com o path do item.
   * '/' usa comparação exata para não ficar sempre ativo.
   */
  const isActive = (path: string) =>
    path === '/' ? activePath === '/' : activePath.startsWith(path)

  return (
    <nav className={s.nav} aria-label="Navegação principal">
      {/* Logo / link para home */}
      <div className={s.logoArea}>
        <Logo />
      </div>

      {/* Itens de menu */}
      <ul className={s.list} role="list">
        {navItems.map((item, i) => (
          <li key={item.path} className={s.listItem}>
            <NavItem
              item={item}
              index={i}
              isActive={isActive(item.path)}
            />
          </li>
        ))}
      </ul>

      {/* Rodapé — stack de tecnologias */}
      <footer className={s.footer} aria-hidden="true">
        <div className={s.footerStack}>
          {['React', 'TS', 'GSAP', 'SCSS'].map(t => (
            <span key={t} className={s.footerTag}>{t}</span>
          ))}
        </div>
        <span className={s.footerCopy}>© {new Date().getFullYear()}</span>
      </footer>
    </nav>
  )
}
