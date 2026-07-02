import React from 'react'
import styles from './RedBullet.module.scss'

export interface RedBulletProps {
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const RedBullet: React.FC<RedBulletProps> = ({
  active = false,
  size = 'md',
  className = '',
}) => (
  <span
    className={[styles.bullet, styles[`bullet--${size}`], active && styles['bullet--active'], className].join(' ')}
    aria-hidden
  />
)
