import React from 'react'
import styles from './GlowDivider.module.scss'

export interface GlowDividerProps {
  className?: string
  vertical?: boolean
}

export const GlowDivider: React.FC<GlowDividerProps> = ({
  className = '',
  vertical = false,
}) => (
  <span
    className={[styles.divider, vertical && styles['divider--vertical'], className].join(' ')}
    aria-hidden
  />
)
