// ═══════════════════════════════════════════════════════════════════════════════
// src/hooks/useAboutData.ts
// Busca about.json e skills.json (repositório configurado em
// @data/githubConfig) para preencher a seção "Sobre Mim".
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { ABOUT_URL, SKILLS_URL } from '@data/githubConfig'

export interface SkillItem {
  name:  string
  level: number
}

interface AboutJsonRaw {
  paragraphs?: string[]
  anos?:       number
}

interface SkillsJsonRaw {
  hard?: Array<string | { name: string; level?: number }>
  soft?: Array<string | { name: string; level?: number }>
}

export interface AboutData {
  paragraphs: string[]
  anos:       number | null
  hardSkills: SkillItem[]
  softSkills: SkillItem[]
}

function normalizeSkillList(list?: Array<string | { name: string; level?: number }>): SkillItem[] {
  if (!Array.isArray(list)) return []
  return list.map(item =>
    typeof item === 'string'
      ? { name: item, level: 80 }            // sem nível informado → usa um valor padrão
      : { name: item.name, level: item.level ?? 80 }
  )
}

interface UseAboutDataReturn {
  data:    AboutData | null
  loading: boolean
  error:   string | null
  retry:   () => void
}

/**
 * useAboutData — busca o texto de bio e as listas de habilidades.
 * Enquanto `loading` for true, ou se `error` vier preenchido,
 * a página deve manter seu conteúdo padrão/placeholder.
 */
export function useAboutData(): UseAboutDataReturn {
  const [data, setData]       = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetch(ABOUT_URL).then(r => (r.ok ? r.json() : {})).catch(() => ({})) as Promise<AboutJsonRaw>,
      fetch(SKILLS_URL).then(r => (r.ok ? r.json() : {})).catch(() => ({})) as Promise<SkillsJsonRaw>,
    ])
      .then(([about, skills]) => {
        if (cancelled) return
        setData({
          paragraphs: Array.isArray(about.paragraphs) ? about.paragraphs : [],
          anos:       typeof about.anos === 'number' ? about.anos : null,
          hardSkills: normalizeSkillList(skills.hard),
          softSkills: normalizeSkillList(skills.soft),
        })
        setLoading(false)
      })
      .catch(e => {
        if (cancelled) return
        console.warn('useAboutData: falha ao buscar dados', e)
        setError('Não foi possível carregar os dados agora.')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  return { data, loading, error, retry }
}
