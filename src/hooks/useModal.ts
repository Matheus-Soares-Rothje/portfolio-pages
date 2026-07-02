import { useState, useCallback, useEffect } from 'react'
import type { Project } from '@/types/project'

interface UseModalReturn {
  activeProject: Project | null
  isOpen:        boolean
  open:          (project: Project) => void
  close:         () => void
}

/**
 * useModal — gerencia estado do modal de projeto.
 *
 * - Trava o scroll do body enquanto o modal estiver aberto
 * - Fecha com a tecla Escape
 * - `activeProject` é mantido durante o fade-out para não piscar
 */
export function useModal(): UseModalReturn {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [isOpen,        setIsOpen        ] = useState(false)

  const open = useCallback((project: Project) => {
    setActiveProject(project)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Limpa o projeto após a animação de saída (300ms)
    setTimeout(() => setActiveProject(null), 350)
  }, [])

  // Trava/destrava scroll do body
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [isOpen])

  // Fecha com Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return { activeProject, isOpen, open, close }
}
