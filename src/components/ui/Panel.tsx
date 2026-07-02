import React from 'react'
import styles from './Panel.module.scss'

export type PanelVariant = 'default' | 'inset' | 'glass' | 'bordered' | 'spotlight'

export interface PanelProps {
  variant?: PanelVariant
  className?: string
  children: React.ReactNode
  /** Red ambient glow */
  glowing?: boolean
  /** Scanline overlay effect */
  scanlines?: boolean
  style?: React.CSSProperties
}

export const Panel: React.FC<PanelProps> = ({
  variant = 'default',
  className = '',
  children,
  glowing = false,
  scanlines = false,
  style,
}) => {
  const classes = [
    styles.panel,
    styles[`panel--${variant}`],
    glowing    && styles['panel--glowing'],
    scanlines  && styles['panel--scanlines'],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} style={style}>
      {/* Diagonal corner accent top-left */}
      <span className={styles.panel__accent} aria-hidden />
      <div className={styles.panel__content}>
        {children}
      </div>
    </div>
  )
}

// ── Panel Header ────────────────────────────────────────────────────────────
export const PanelHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <div className={[styles.panel__header, className].join(' ')}>
    {children}
  </div>
)
