// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  label:          string
  path:           string
  characterImage: string   // path relative to public/, e.g. "/persona-portfolio/assets/characters/sobre-mim.png"
}

// ─── Projects ─────────────────────────────────────────────────────────────────
// Tipo canônico definido em @/types/project.ts — re-exportado aqui
// para que `import type { Project } from '@/types'` continue funcionando.
export type { Project, ProjectInput, ProjectRaw, LoadResult, LoadSummary, ValidationError } from './project'
export { formatValidationError } from './project'

// ─── Experience ───────────────────────────────────────────────────────────────
export interface Experience {
  id:          string
  role:        string
  company:     string
  period:      string
  description: string
  isCurrent:   boolean
}

// ─── Certificate ──────────────────────────────────────────────────────────────
export type CertificateIcon = 'html5' | 'js' | 'react' | 'atom' | 'css3' | 'node' | 'python' | 'default'

export interface Certificate {
  id:        string
  name:      string
  platform:  string
  year:      number
  icon:      CertificateIcon
  /** URL do certificado online (opcional) */
  url?:      string
  /** URL da imagem do certificado (opcional) */
  imageUrl?: string
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export type ContactType = 'email' | 'phone' | 'github' | 'linkedin' | 'twitter' | 'instagram'

export interface ContactItem {
  type:    ContactType
  label:   string
  value:   string
  url:     string
}

// ─── Avatar / Character ───────────────────────────────────────────────────────
export interface Avatar {
  id:       string          // matches route slug, e.g. "sobre-mim"
  name:     string          // display name of the character
  imagePath: string         // full resolved path, e.g. "/persona-portfolio/assets/characters/sobre-mim.png"
  alt:      string          // accessible alt text
  position: AvatarPosition  // CSS positioning hints
}

export interface AvatarPosition {
  side:        'left' | 'right'    // which side of the layout
  offsetX?:    string              // e.g. "-20px" — fine-tune per character
  offsetY?:    string              // e.g. "40px"
  scale?:      number              // e.g. 1.1 for slightly larger
}
