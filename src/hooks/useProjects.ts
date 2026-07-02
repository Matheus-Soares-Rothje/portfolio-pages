import { useState, useMemo } from 'react'
import { projects as allProjects } from '@data/projectLoader'
import type { Project } from '@/types'

interface UseProjectsOptions {
  /** Tag inicial selecionada. Default: 'Todos' */
  initialTag?: string
}

interface UseProjectsReturn {
  /** Lista de projetos filtrada e ordenada */
  projects: Project[]
  /** Todas as tags únicas extraídas dos projetos, com 'Todos' na frente */
  tags: string[]
  /** Tag atualmente ativa */
  activeTag: string
  /** Muda o filtro ativo */
  setActiveTag: (tag: string) => void
  /** Total de projetos sem filtro */
  total: number
}

/**
 * useProjects — gerencia filtro por tag dos projetos carregados via glob.
 *
 * Uso:
 * ```tsx
 * const { projects, tags, activeTag, setActiveTag } = useProjects()
 * ```
 */
export function useProjects({ initialTag = 'Todos' }: UseProjectsOptions = {}): UseProjectsReturn {
  const [activeTag, setActiveTag] = useState(initialTag)

  // Extrai tags únicas de todos os projetos
  const tags = useMemo(() => {
    const set = new Set<string>()
    allProjects.forEach(p => p.tags.forEach(t => set.add(t)))
    return ['Todos', ...Array.from(set).sort()]
  }, [])

  // Filtra por tag ativa
  const projects = useMemo(() => {
    if (activeTag === 'Todos') return allProjects
    return allProjects.filter(p => p.tags.includes(activeTag))
  }, [activeTag])

  return {
    projects,
    tags,
    activeTag,
    setActiveTag,
    total: allProjects.length,
  }
}
