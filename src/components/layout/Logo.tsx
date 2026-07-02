import { NavLink } from 'react-router-dom'
import s from './Logo.module.scss'

/**
 * Logo — identidade visual da navbar.
 * Símbolo geométrico + iniciais em vez de "Portfolio" genérico.
 */
export function Logo() {
  return (
    <NavLink to="/" className={s.logo} aria-label="Ir para página inicial">
      {/* Marca — símbolo losango + iniciais */}
      <div className={s.mark} aria-hidden="true">
        <svg className={s.diamond} viewBox="0 0 32 32" fill="none">
          {/* Losango externo */}
          <path d="M16 2 L30 16 L16 30 L2 16 Z"
            stroke="currentColor" strokeWidth="1.5" fill="none" />
          {/* Losango interno preenchido */}
          <path d="M16 8 L24 16 L16 24 L8 16 Z" fill="currentColor" />
          {/* Cruz central */}
          <line x1="16" y1="2"  x2="16" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
          <line x1="2"  y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
        </svg>
        <div className={s.markGlow} />
      </div>

      {/* Texto */}
      <div className={s.text}>
        {/* Iniciais em display font — substitua pelas suas */}
        <span className={s.initials}>JS</span>
        <span className={s.sub}>Front&thinsp;·&thinsp;End</span>
      </div>

      {/* Linha decorativa lateral */}
      <span className={s.accent} aria-hidden="true" />
    </NavLink>
  )
}
