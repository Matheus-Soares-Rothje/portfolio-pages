/**
 * avatars.ts
 *
 * Source of truth for character art used throughout the portfolio.
 *
 * HOW TO ADD YOUR OWN CHARACTER:
 *  1. Export the character as PNG with transparent background
 *  2. Recommended size: 600×900px minimum (portrait)
 *  3. Place in: public/assets/characters/<filename>.png
 *  4. Update the `imagePath` below — prefix must match vite.config base: '/persona-portfolio/'
 *
 * IMPORTANT: The BASE_PATH must match `base` in vite.config.ts
 */

import type { Avatar } from '@/types'

const BASE_PATH = '/persona-portfolio/assets/characters'

export const avatars: Record<string, Avatar> = {
  'sobre-mim': {
    id:        'sobre-mim',
    name:      'Personagem Principal',
    imagePath: `${BASE_PATH}/sobre-mim.png`,
    alt:       'Personagem na seção Sobre Mim',
    position: {
      side:    'right',
      offsetX: '0px',
      offsetY: '0px',
      scale:   1,
    },
  },

  'projetos': {
    id:        'projetos',
    name:      'Personagem Projetos',
    imagePath: `${BASE_PATH}/projetos.png`,
    alt:       'Personagem na seção Projetos',
    position: {
      side:    'right',
      offsetX: '0px',
      offsetY: '0px',
      scale:   1,
    },
  },

  'experiencias': {
    id:        'experiencias',
    name:      'Personagem Experiências',
    imagePath: `${BASE_PATH}/experiencias.png`,
    alt:       'Personagem na seção Experiências',
    position: {
      side:    'left',
      offsetX: '0px',
      offsetY: '0px',
      scale:   1,
    },
  },

  'certificados': {
    id:        'certificados',
    name:      'Personagem Certificados',
    imagePath: `${BASE_PATH}/certificados.png`,
    alt:       'Personagem na seção Certificados',
    position: {
      side:    'right',
      offsetX: '0px',
      offsetY: '0px',
      scale:   1,
    },
  },

  'contato': {
    id:        'contato',
    name:      'Personagem Contato',
    imagePath: `${BASE_PATH}/contato.png`,
    alt:       'Personagem na seção Contato',
    position: {
      side:    'left',
      offsetX: '0px',
      offsetY: '0px',
      scale:   1,
    },
  },
}

/** Helper — returns avatar for a given route id, or undefined if not found */
export function getAvatar(sectionId: string): Avatar | undefined {
  return avatars[sectionId]
}
