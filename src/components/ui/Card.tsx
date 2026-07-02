import React from 'react'
import styles from './Card.module.scss'

export type CardVariant = 'default' | 'project' | 'certificate' | 'contact' | 'stat'

export interface CardProps {
  variant?: CardVariant
  className?: string
  children: React.ReactNode
  /** Glows red on hover */
  hoverable?: boolean
  /** Red left border accent */
  accented?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className = '',
  children,
  hoverable = false,
  accented = false,
  onClick,
  style,
}) => {
  const classes = [
    styles.card,
    styles[`card--${variant}`],
    hoverable && styles['card--hoverable'],
    accented  && styles['card--accented'],
    onClick   && styles['card--clickable'],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick
        ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }
        : undefined
      }
    >
      {/* Top-right corner cut decoration */}
      <span className={styles.card__corner} aria-hidden />
      <div className={styles.card__inner}>
        {children}
      </div>
    </div>
  )
}

// ── Sub-components for composition ──────────────────────────────────────────

export const CardImage: React.FC<{ src: string; alt: string; className?: string }> = ({
  src, alt, className = '',
}) => (
  <div className={[styles.card__image, className].join(' ')}>
    <img src={src} alt={alt} loading="lazy" />
  </div>
)

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => <div className={[styles.card__body, className].join(' ')}>{children}</div>

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => <h3 className={[styles.card__title, className].join(' ')}>{children}</h3>

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => <p className={[styles.card__description, className].join(' ')}>{children}</p>

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => <div className={[styles.card__footer, className].join(' ')}>{children}</div>

export const CardTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={styles.card__tag}>{children}</span>
)
