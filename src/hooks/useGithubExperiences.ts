// ═══════════════════════════════════════════════════════════════════════════════
// src/hooks/useGithubExperiences.ts
// Busca a lista de experiências do repositório `portfolio-experiencias`
// (cada pasta = uma experiência, com um info.json dentro) e expõe como
// Experience[] (mesmo tipo já usado em Experiencias.tsx / TimelineEntry).
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import {
  GITHUB_USER,
  EXPERIENCES_REPO,
  EXPERIENCES_BRANCH,
  EXPERIENCES_API_URL,
} from '@data/githubConfig'
import type { Experience } from '@/types'

interface GithubContentItem {
  name: string
  type: 'file' | 'dir'
}

interface ExperienceInfoRaw {
  role?:        string
  cargo?:       string
  company?:     string
  empresa?:     string
  period?:      string
  periodo?:     string
  description?: string
  descricao?:   string
  isCurrent?:   boolean
  atual?:       boolean
}

async function fetchInfoJson(folderName: string): Promise<Experience | null> {
  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${EXPERIENCES_REPO}/${EXPERIENCES_BRANCH}/${encodeURIComponent(folderName)}/info.json`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const info: ExperienceInfoRaw = await res.json()
    return {
      id:          folderName,
      role:        info.role ?? info.cargo ?? folderName,
      company:     info.company ?? info.empresa ?? '',
      period:      info.period ?? info.periodo ?? '',
      description: info.description ?? info.descricao ?? '',
      isCurrent:   Boolean(info.isCurrent ?? info.atual ?? false),
    }
  } catch {
    return null
  }
}

interface UseGithubExperiencesReturn {
  experiences: Experience[]
  loading:     boolean
  error:       string | null
  retry:       () => void
}

/**
 * useGithubExperiences — substituto dinâmico do antigo
 * `import { experiences } from '@data/experiences'`.
 *
 * Estrutura esperada no repositório `portfolio-experiencias`:
 * ```
 * portfolio-experiencias/
 * ├── empresa-x/
 * │   └── info.json   { "role", "company", "period", "description", "isCurrent" }
 * └── projeto-y/
 *     └── info.json
 * ```
 */
export function useGithubExperiences(): UseGithubExperiencesReturn {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [reloadKey, setReloadKey]     = useState(0)

  const retry = useCallback(() => setReloadKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(EXPERIENCES_API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API respondeu ${res.status}`)
        return res.json()
      })
      .then(async (items: GithubContentItem[]) => {
        const folders = Array.isArray(items) ? items.filter(it => it.type === 'dir') : []
        const list = await Promise.all(folders.map(f => fetchInfoJson(f.name)))
        if (cancelled) return
        setExperiences(list.filter((e): e is Experience => e !== null))
        setLoading(false)
      })
      .catch(e => {
        if (cancelled) return
        console.warn('useGithubExperiences: falha ao buscar experiências', e)
        setError('Não foi possível carregar as experiências agora.')
        setExperiences([])
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  return { experiences, loading, error, retry }
}
