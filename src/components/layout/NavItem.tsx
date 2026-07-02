import { NavLink } from 'react-router-dom'
import type { NavItem as NavItemType } from '@/types'
import s from './NavItem.module.scss'

interface NavItemProps {
  item: NavItemType
  index: number
  isActive: boolean
}

/**
 * NavItem — item de menu estilo Persona 5.
 *
 * Renderiza um <NavLink> com faixa diagonal, número de índice e barra lateral.
 * O estado active é derivado do `isActive` prop (calculado pelo pai via useActiveSection).
 */
export function NavItem({ item, index, isActive }: NavItemProps) {
  const indexStr = String(index + 1).padStart(2, '0')

  return (
    <NavLink
      to={item.path}
      className={[s.item, isActive ? s['item--active'] : ''].filter(Boolean).join(' ')}
      aria-current={isActive ? 'page' : undefined}
      end={item.path === '/'}   // evita que '/' fique sempre ativo
    >
      {/* barra lateral esquerda — aparece no hover e active */}
      <span className={s.leftBar} aria-hidden="true" />

      <span className={s.label}>
        <span className={s.index} aria-hidden="true">{indexStr}</span>
        {item.label}
      </span>
    </NavLink>
  )
}
