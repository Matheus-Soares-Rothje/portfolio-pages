import React from 'react'
import styles from './DiagonalShape.module.scss'

export type ShapeVariant =
  | 'banner-left'      // clips right edge diagonally
  | 'banner-right'     // clips left edge diagonally
  | 'slash'            // both edges diagonal (parallelogram)
  | 'tag'              // small tag shape
  | 'corner-cut'       // single corner clipped

export interface DiagonalShapeProps {
  variant?: ShapeVariant
  color?: 'red' | 'black' | 'white' | 'dark'
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const DiagonalShape: React.FC<DiagonalShapeProps> = ({
  variant = 'banner-left',
  color = 'red',
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={[styles.shape, styles[variant], styles[`color-${color}`], className].join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}
