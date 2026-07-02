import React from 'react'
import styles from './TagBadge.module.scss'

export type TagBadgeColor = 'default' | 'red' | 'white' | 'outline'

export interface TagBadgeProps {
  children: React.ReactNode
  color?: TagBadgeColor
  className?: string
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  children,
  color = 'default',
  className = '',
}) => (
  <span className={[styles.tag, styles[`tag--${color}`], className].join(' ')}>
    {children}
  </span>
)
