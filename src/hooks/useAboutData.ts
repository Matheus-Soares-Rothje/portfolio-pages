import { useState, useEffect, useCallback } from 'react'
import { ABOUT_URL, SKILLS_URL } from '@/data/githubConfig'
import { paragraphs as fallbackParagraphs, hardSkills as fallbackSkills, stats as fallbackStats } from '@/data/about'
import type { HardSkill, Stat } from '@/types'

interface AboutJson { paragraphs?: string[]; anos?: number }
interface SkillsJson { hard?: Array<string | { name: string; level?: number }> }

function normalizeSkills(list?: Array<string | { name: string; level?: number }>): HardSkill[] {
  if (!Array.isArray(list)) return []
  return list.map(i => typeof i === 'string' ? { name: i, level: 80 } : { name: i.name, level: i.level ?? 80 })
}

export interface AboutData { paragraphs: string[]; hardSkills: HardSkill[]; stats: Stat[] }

export function useAboutData() {
  const [data, setData]       = useState<AboutData>({ paragraphs: fallbackParagraphs, hardSkills: fallbackSkills, stats: fallbackStats })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [key, setKey]         = useState(0)
  const retry = useCallback(() => setKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    Promise.all([
      fetch(ABOUT_URL).then(r => r.ok ? r.json() : {}).catch(() => ({})) as Promise<AboutJson>,
      fetch(SKILLS_URL).then(r => r.ok ? r.json() : {}).catch(() => ({})) as Promise<SkillsJson>,
    ]).then(([about, skills]) => {
      if (cancelled) return
      const paragraphs = Array.isArray(about.paragraphs) && about.paragraphs.length ? about.paragraphs : fallbackParagraphs
      const hardSkills = normalizeSkills(skills.hard).length ? normalizeSkills(skills.hard) : fallbackSkills
      const anos = typeof about.anos === 'number' ? about.anos : null
      const stats: Stat[] = anos ? [{ label: 'Anos de Ofício', value: `${anos}+` }, ...fallbackStats.slice(1)] : fallbackStats
      setData({ paragraphs, hardSkills, stats })
      setLoading(false)
    }).catch(e => { if (!cancelled) { console.warn(e); setError('Não foi possível carregar o perfil.'); setLoading(false) } })
    return () => { cancelled = true }
  }, [key])

  return { data, loading, error, retry }
}
