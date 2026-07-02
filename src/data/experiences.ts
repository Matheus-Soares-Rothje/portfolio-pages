import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    id:          'exp-1',
    role:        'Desenvolvedor Front-end',
    company:     'Empresa Exemplo',
    period:      '2023 - Atual',
    description: 'Desenvolvimento de interfaces modernas e responsivas com foco em performance e experiência do usuário.',
    isCurrent:   true,
  },
  {
    id:          'exp-2',
    role:        'Estagiário de Desenvolvimento',
    company:     'Empresa Exemplo',
    period:      '2021 - 2023',
    description: 'Apoio no desenvolvimento de sistemas internos e manutenção de aplicações web.',
    isCurrent:   false,
  },
]
