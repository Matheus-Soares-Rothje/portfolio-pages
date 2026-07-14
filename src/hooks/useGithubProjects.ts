import { useState, useEffect, useCallback } from 'react'
import { GITHUB_USER, REPOS_CACHE_KEY, REPOS_CACHE_TTL, LANG_CACHE_KEY, LANG_CACHE_TTL } from '@/data/githubConfig'
import type { Project } from '@/types'

interface GithubRepo {
  name: string; description: string | null; html_url: string
  homepage: string | null; language: string | null; fork: boolean
}

function readCache<T>(key: string, ttl: number): T | null {
  try {
    const p = JSON.parse(localStorage.getItem(key) || 'null') as { ts: number; data: T } | null
    return p && Date.now() - p.ts < ttl ? p.data : null
  } catch { return null }
}
function writeCache<T>(key: string, data: T) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })) } catch { /* noop */ }
}

const EXCLUDED_REPOS = new Set([
  'portfolio-certificados',
  'portfolio-data',
  'portfolio-experiencias',
  'Matheus-Soares-Rothje',
])

async function fetchRepos(): Promise<GithubRepo[]> {
  const c = readCache<GithubRepo[]>(REPOS_CACHE_KEY, REPOS_CACHE_TTL)
  if (c) return c
  const r = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`)
  if (!r.ok) throw new Error(`${r.status}`)
  const data: GithubRepo[] = await r.json()
  const repos = data.filter(r => !r.fork && !EXCLUDED_REPOS.has(r.name))
  writeCache(REPOS_CACHE_KEY, repos)
  return repos
}

async function fetchLangs(name: string): Promise<string[]> {
  const cache = readCache<Record<string, string[]>>(LANG_CACHE_KEY, LANG_CACHE_TTL) ?? {}
  if (cache[name]) return cache[name]
  try {
    const r = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${name}/languages`)
    if (!r.ok) return []
    const d: Record<string, number> = await r.json()
    const langs = Object.keys(d).sort((a, b) => d[b] - d[a])
    cache[name] = langs; writeCache(LANG_CACHE_KEY, cache)
    return langs
  } catch { return [] }
}

async function fetchReadme(name: string): Promise<string | null> {
  for (const b of ['main', 'master']) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${name}/${b}/README.md`)
      if (!r.ok) continue
      const plain = (await r.text())
        .replace(/```[\s\S]*?```/g, ' ').replace(/!\[.*?\]\(.*?\)/g, ' ')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/^#+\s*/gm, '')
        .replace(/[*_`>#-]/g, ' ').replace(/\s+/g, ' ').trim()
      if (!plain) continue
      return plain.length > 180 ? plain.slice(0, 180) + '…' : plain
    } catch { continue }
  }
  return null
}

async function findThumb(name: string): Promise<string | undefined> {
  for (const b of ['main', 'master']) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${name}/${b}/thumb.png`
    try { if ((await fetch(url, { method: 'HEAD' })).ok) return url } catch { /* noop */ }
  }
}

function toProject(r: GithubRepo, i: number, tags: string[], desc?: string, img?: string): Project {
  return { id: r.name, title: r.name.replace(/[-_]/g, ' '), description: desc ?? r.description ?? 'Sem descrição.', imageUrl: img, tags: tags.length ? tags : (r.language ? [r.language] : []), liveUrl: r.homepage || undefined, repoUrl: r.html_url, order: i }
}

export function useGithubProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [key, setKey]           = useState(0)
  const retry = useCallback(() => { try { localStorage.removeItem(REPOS_CACHE_KEY) } catch { /* noop */ }; setKey(k => k + 1) }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetchRepos()
      .then(async repos => {
        if (cancelled) return
        setProjects(repos.map((r, i) => toProject(r, i, r.language ? [r.language] : [])))
        setLoading(false)
        for (let i = 0; i < repos.length; i++) {
          if (cancelled) return
          const [langs, readme, thumb] = await Promise.all([fetchLangs(repos[i].name), repos[i].description ? Promise.resolve(null) : fetchReadme(repos[i].name), findThumb(repos[i].name)])
          if (cancelled) return
          setProjects(p => { const n = [...p]; n[i] = toProject(repos[i], i, langs.length ? langs : (repos[i].language ? [repos[i].language!] : []), readme ?? undefined, thumb); return n })
          await new Promise(r => setTimeout(r, 120))
        }
      })
      .catch(e => { if (!cancelled) { console.warn(e); setError('Não foi possível consultar o acervo de projetos.'); setLoading(false) } })
    return () => { cancelled = true }
  }, [key])

  return { projects, loading, error, retry }
}
