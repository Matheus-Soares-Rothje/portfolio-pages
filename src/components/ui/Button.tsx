import React from 'react'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'nav'
export type ButtonSize    = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  as?: 'button' | 'a'
  href?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  glowing?: boolean
  diagonal?: boolean          // apply diagonal clip on right edge
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  href,
  iconLeft,
  iconRight,
  glowing = false,
  diagonal = true,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    diagonal && styles['btn--diagonal'],
    glowing   && styles['btn--glow'],
    className,
  ].filter(Boolean).join(' ')

  if (Tag === 'a') {
    return (
      <a href={href} className={classes} role="button">
        {iconLeft  && <span className={styles.btn__icon}>{iconLeft}</span>}
        <span className={styles.btn__label}>{children}</span>
        {iconRight && <span className={styles.btn__icon}>{iconRight}</span>}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {iconLeft  && <span className={styles.btn__icon}>{iconLeft}</span>}
      <span className={styles.btn__label}>{children}</span>
      {iconRight && <span className={styles.btn__icon}>{iconRight}</span>}
    </button>
  )
}
