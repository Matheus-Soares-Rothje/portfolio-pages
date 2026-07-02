import React from 'react'
import styles from './SectionContainer.module.scss'

export interface SectionContainerProps {
  id?: string
  className?: string
  children: React.ReactNode
  /** Adds a large diagonal red sweep decorative element in the background */
  withSweep?: boolean
  /** Constrains content to max-width and centers it */
  contained?: boolean
  style?: React.CSSProperties
}

/**
 * Full-viewport section wrapper used as the root of each page.
 * Provides the base background, spacing, and optional decorative sweeps.
 */
export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  className = '',
  children,
  withSweep = false,
  contained = true,
  style,
}) => {
  return (
    <section
      id={id}
      className={[styles.section, className].join(' ')}
      style={style}
    >
      {/* Decorative sweep */}
      {withSweep && (
        <>
          <span className={styles.section__sweep}     aria-hidden />
          <span className={styles.section__sweep_accent} aria-hidden />
        </>
      )}

      {/* Content wrapper */}
      <div className={[styles.section__body, contained && styles['section__body--contained']].filter(Boolean).join(' ')}>
        {children}
      </div>
    </section>
  )
}

// ── SectionTitle — the big P5-style stamped heading ─────────────────────────
export type SectionTitleSize = 'sm' | 'md' | 'lg' | 'xl'

export interface SectionTitleProps {
  children: React.ReactNode
  accent?: string          // small red word before main title (e.g. "MEUS")
  size?: SectionTitleSize
  className?: string
  align?: 'left' | 'center'
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  accent,
  size = 'lg',
  className = '',
  align = 'left',
}) => (
  <div className={[styles.title, styles[`title--${size}`], styles[`title--${align}`], className].join(' ')}>
    {accent && <span className={styles.title__accent}>{accent}</span>}
    <h2 className={styles.title__text}>{children}</h2>
    <span className={styles.title__line} aria-hidden />
  </div>
)
