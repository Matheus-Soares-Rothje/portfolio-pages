// ═══════════════════════════════════════════════════════════════════════════════
// src/components/ui/TechIcon.tsx
// Ícones SVG inline para as tecnologias dos certificados.
// SVGs simplificados (não logos oficiais — sem copyright).
// ═══════════════════════════════════════════════════════════════════════════════

import type { CertificateIcon } from '@/types'
import type { JSX } from 'react'

interface TechIconProps {
  icon:      CertificateIcon
  size?:     number
  className?: string
}

const icons: Record<CertificateIcon, JSX.Element> = {
  html5: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4l3.2 35.2L20 42l10.8-2.8L34 4H6z" fill="#E34F26"/>
      <path d="M20 38.4l8.7-2.4 2.7-30.4H20v32.8z" fill="#EF652A"/>
      <path d="M20 16.8h-5.2l-.4-4H20V9H10l1 11h9v-3.2zM20 28l-.1.1-4.3-1.1-.3-3.2H12l.6 6 7.4 2 .1-.1V28z" fill="white"/>
      <path d="M20 16.8v3.2h4.8l-.5 5-4.3 1.1V29l7.3-2 .1-.8.9-9.4H20z" fill="#EBEBEB"/>
    </svg>
  ),
  css3: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4l3.2 35.2L20 42l10.8-2.8L34 4H6z" fill="#264DE4"/>
      <path d="M20 38.4l8.7-2.4 2.7-30.4H20v32.8z" fill="#2965F1"/>
      <path d="M20 16.8h-5l.4 4H20V16.8zM20 9H10l.3 3.2h9.7V9zM20 28l-.1.1-4.3-1.1-.3-3.2H12l.6 6 7.4 2 .1-.1V28z" fill="white"/>
      <path d="M15.4 20.8l.5 4.1 4.1 1.1V22l-4.6-1.2zM20 12.2v3.4l4.8.1.4-4-.5-.1-4.7-.4v1z" fill="#EBEBEB"/>
      <path d="M20 22v4.1l4-1.1.5-4.6H20V22z" fill="#EBEBEB"/>
    </svg>
  ),
  js: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="#F7DF1E"/>
      <path d="M22.8 27.6c.6 1 1.4 1.8 2.8 1.8 1.2 0 1.9-.6 1.9-1.4 0-1-.8-1.3-2-1.8l-.7-.3c-2-.8-3.3-1.9-3.3-4.1 0-2 1.5-3.6 4-3.6 1.7 0 3 .6 3.9 2.2l-2.1 1.4c-.5-.9-1-1.2-1.8-1.2-.8 0-1.3.5-1.3 1.2 0 .9.5 1.2 1.7 1.7l.7.3c2.3 1 3.7 2.1 3.7 4.4 0 2.5-2 3.8-4.6 3.8-2.6 0-4.2-1.2-5-2.9l2.1-1.5zM12.6 27.8c.4.8.8 1.4 1.7 1.4.9 0 1.4-.3 1.4-1.7V18h2.7v9.5c0 2.8-1.6 4-4 4-2.1 0-3.3-1.1-4-2.4l2.2-1.3z" fill="#323330"/>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="3.5" fill="#61DAFB"/>
      <ellipse cx="20" cy="20" rx="18" ry="6.5" stroke="#61DAFB" strokeWidth="2" fill="none"/>
      <ellipse cx="20" cy="20" rx="18" ry="6.5" stroke="#61DAFB" strokeWidth="2" fill="none" transform="rotate(60 20 20)"/>
      <ellipse cx="20" cy="20" rx="18" ry="6.5" stroke="#61DAFB" strokeWidth="2" fill="none" transform="rotate(120 20 20)"/>
    </svg>
  ),
  node: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 3L4 12v16l16 9 16-9V12L20 3z" fill="#539E43"/>
      <path d="M20 7.5l11.5 6.6V28L20 34.5 8.5 28V14.1L20 7.5z" fill="#333"/>
      <path d="M20 13c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 11.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" fill="#539E43"/>
    </svg>
  ),
  atom: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="3" fill="#66DBFB"/>
      <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#66DBFB" strokeWidth="1.5" fill="none"/>
      <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#66DBFB" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)"/>
      <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#66DBFB" strokeWidth="1.5" fill="none" transform="rotate(-60 20 20)"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,4 36,36 4,36" fill="none" stroke="#E2001A" strokeWidth="2"/>
      <polygon points="20,12 29,30 11,30" fill="#E2001A" opacity="0.3"/>
      <circle cx="20" cy="22" r="2" fill="#E2001A"/>
    </svg>
  ),
}

export function TechIcon({ icon, size = 40, className }: TechIconProps) {
  const svg = icons[icon] ?? icons.default
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0 }}
      aria-hidden="true"
    >
      {svg}
    </span>
  )
}
