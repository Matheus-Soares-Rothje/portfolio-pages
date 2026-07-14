import { useState, useEffect, useCallback } from 'react'
import { ABOUT_URL, SKILLS_URL, GITHUB_USER } from '@/data/githubConfig'
import { paragraphs as fallbackParagraphs, hardSkills as fallbackSkills, stats as fallbackStats } from '@/data/about'
import type { HardSkill, Stat } from '@/types'

interface AboutJson { paragraphs?: string[]; anos?: number }
interface SkillsJson { hard?: Array<string | { name: string; level?: number }> }
interface GithubUser { public_repos: number }
interface GithubEvent { type: string }

function normalizeSkills(list?: Array<string | { name: string; level?: number }>): HardSkill[] {
  if (!Array.isArray(list)) return []
  return list.map(i => typeof i === 'string' ? { name: i, level: 80 } : { name: i.name, level: i.level ?? 80 })
}

function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
  let result = ''
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i] }
  }
  return result
}

async function fetchTotalCommits(user: string): Promise<number | null> {
  try {
    // Use the GitHub search API to count commits by the user
    const r = await fetch(`https://api.github.com/search/commits?q=author:${user}&per_page=1`, {
      headers: { Accept: 'application/vnd.github.cloak-preview' }
    })
    if (!r.ok) return null
    const d = await r.json()
    return typeof d.total_count === 'number' ? d.total_count : null
  } catch { return null }
}

async function fetchPublicRepos(user: string): Promise<number | null> {
  try {
    const r = await fetch(`https://api.github.com/users/${user}`)
    if (!r.ok) return null
    const d: GithubUser = await r.json()
    return d.public_repos ?? null
  } catch { return null }
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

    // Anos de ofício contando a partir de 2024
    const startYear = 2024
    const currentYear = new Date().getFullYear()
    const anos = Math.max(1, currentYear - startYear + 1)
    const anosValue = toRoman(anos) + '+'

    Promise.all([
      fetch(ABOUT_URL).then(r => r.ok ? r.json() : {}).catch(() => ({})) as Promise<AboutJson>,
      fetch(SKILLS_URL).then(r => r.ok ? r.json() : {}).catch(() => ({})) as Promise<SkillsJson>,
      fetchPublicRepos(GITHUB_USER),
      fetchTotalCommits(GITHUB_USER),
    ]).then(([about, skills, repoCount, commitCount]) => {
      if (cancelled) return
      const paragraphs = Array.isArray(about.paragraphs) && about.paragraphs.length ? about.paragraphs : fallbackParagraphs
      const hardSkills = normalizeSkills(skills.hard).length ? normalizeSkills(skills.hard) : fallbackSkills

      const repoValue = repoCount != null ? toRoman(repoCount) : fallbackStats[1].value
      const commitValue = commitCount != null
        ? commitCount >= 1000
          ? `${(commitCount / 1000).toFixed(1).replace('.0', '')}k+`
          : `${commitCount}+`
        : fallbackStats[2].value

      const stats: Stat[] = [
        { label: 'Anos de Ofício', value: anosValue },
        { label: 'Repositórios', value: repoValue },
        { label: 'Commits na Conta', value: commitValue },
        fallbackStats[3], // Xícaras de Café
      ]

      setData({ paragraphs, hardSkills, stats })
      setLoading(false)
    }).catch(e => { if (!cancelled) { console.warn(e); setError('Não foi possível carregar o perfil.'); setLoading(false) } })
    return () => { cancelled = true }
  }, [key])

  return { data, loading, error, retry }
}
