import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id:          'projeto-1',
    title:       'Projeto Um',
    description: 'Descrição do projeto. Edite em src/data/projects.ts.',
    imageUrl:    '/persona-portfolio/assets/projects/projeto-1.jpg',
    tags:        ['React', 'TypeScript', 'CSS'],
    liveUrl:     'https://example.com',
    repoUrl:     'https://github.com/usuario/projeto-1',
    order:       1,
  },
  {
    id:          'projeto-2',
    title:       'Projeto Dois',
    description: 'Descrição do projeto. Edite em src/data/projects.ts.',
    imageUrl:    '/persona-portfolio/assets/projects/projeto-2.jpg',
    tags:        ['Node.js', 'API', 'PostgreSQL'],
    repoUrl:     'https://github.com/usuario/projeto-2',
    order:       2,
  },
  {
    id:          'projeto-3',
    title:       'Projeto Três',
    description: 'Descrição do projeto. Edite em src/data/projects.ts.',
    imageUrl:    '/persona-portfolio/assets/projects/projeto-3.jpg',
    tags:        ['HTML', 'CSS', 'GSAP'],
    liveUrl:     'https://example.com',
    repoUrl:     'https://github.com/usuario/projeto-3',
    order:       3,
  },
]