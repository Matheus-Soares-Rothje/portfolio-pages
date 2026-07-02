// ═══════════════════════════════════════════════════════════════════════════════
// src/hooks/useGithubProjects.ts
// Busca os repositórios públicos do GitHub do usuário configurado em
// @data/githubConfig e expõe como Project[] (mesmo tipo usado pelos
// componentes ProjectCard / ProjectModal já existentes no projeto).
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  GITHUB_USER,
  REPOS_CACHE_KEY, REPOS_CACHE_TTL,
  LANG_CACHE_KEY, LANG_CACHE_TTL,
} from '@data/githubConfig'
import type { Project } from '@/types'

interface GithubRepo {
  name:             string
  description:      string | null
  html_url:         string
  homepage:          string | null
  language:          string | null
  stargazers_count:  number
  forks_count:       number
  fork:              boolean
  updated_at:        string
}

function readCache<T>(key: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts: number; data: T }
    if (Date.now() - parsed.ts > ttl) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }))
  } catch {
    /* localStorage indisponível — ignora silenciosamente */
  }
}

async function fetchRepos(): Promise<GithubRepo[]> {
  const cached = readCache<GithubRepo[]>(REPOS_CACHE_KEY, REPOS_CACHE_TTL)
  if (cached) return cached

  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`)
  if (!res.ok) throw new Error(`GitHub API respondeu ${res.status}`)
  const data: GithubRepo[] = await res.json()
  const repos = Array.isArray(data) ? data.filter(r => !r.fork) : []
  writeCache(REPOS_CACHE_KEY, repos)
  return repos
}

async function fetchLanguagesFor(repoName: string): Promise<string[]> {
  const cache = readCache<Record<string, string[]>>(LANG_CACHE_KEY, LANG_CACHE_TTL) ?? {}
  if (cache[repoName]) return cache[repoName]

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repoName}/languages`)
    if (!res.ok) return []
    const data: Record<string, number> = await res.json()
    const langs = Object.keys(data).sort((a, b) => data[b] - data[a])
    cache[repoName] = langs
    writeCache(LANG_CACHE_KEY, cache)
    return langs
  } catch {
    return []
  }
}

function repoToProject(
  repo: GithubRepo,
  order: number,
  tags: string[],
  description?: string,
  imageUrl?: string,
): Project {
  return {
    id:          repo.name,
    title:       repo.name.replace(/[-_]/g, ' '),
    description: description ?? repo.description ?? 'Sem descrição.',
    imageUrl,
    tags:        tags.length > 0 ? tags : (repo.language ? [repo.language] : []),
    liveUrl:     repo.homepage || undefined,
    repoUrl:     repo.html_url,
    order,
  }
}

/**
 * Verifica se uma URL de imagem existe de fato (responde 200), sem
 * disparar o download completo — útil pra não exibir imageUrl quebrada
 * quando o repositório não tem um thumb.png.
 */
async function imageExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Busca o README.md de um repositório e retorna um resumo em texto puro
 * (sem markdown), truncado, para usar como descrição quando o GitHub não
 * tiver uma descrição cadastrada no próprio repositório.
 */
async function fetchReadmeSummary(repoName: string): Promise<string | null> {
  const branches = ['main', 'master']
  for (const branch of branches) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${repoName}/${branch}/README.md`)
      if (!res.ok) continue
      const raw = await res.text()
      const plain = raw
        .replace(/```[\s\S]*?```/g, ' ')          // blocos de código
        .replace(/!\[.*?\]\(.*?\)/g, ' ')          // imagens markdown
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')        // links → mantém só o texto
        .replace(/^#+\s*/gm, '')                   // cabeçalhos
        .replace(/[*_`>#-]/g, ' ')                 // demais símbolos markdown
        .replace(/\s+/g, ' ')
        .trim()
      if (!plain) continue
      return plain.length > 180 ? plain.slice(0, 180).trim() + '…' : plain
    } catch {
      continue
    }
  }
  return null
}

/** Tenta achar uma imagem de capa do repositório (thumb.png, em main ou master) */
async function findRepoThumb(repoName: string): Promise<string | undefined> {
  const branches = ['main', 'master']
  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${repoName}/${branch}/thumb.png`
    if (await imageExists(url)) return url
  }
  return undefined
}

interface UseGithubProjectsOptions {
  initialTag?: string
}

interface UseGithubProjectsReturn {
  projects:    Project[]
  tags:        string[]
  activeTag:   string
  setActiveTag: (tag: string) => void
  total:       number
  loading:     boolean
  error:       string | null
  retry:       () => void
}

/**
 * useGithubProjects — busca repositórios reais do GitHub (com cache local)
 * e expõe a mesma interface do antigo `useProjects`, então pode ser usado
 * como substituto direto na página Projetos.tsx.
 */
export function useGithubProjects(
  { initialTag = 'Todos' }: UseGithubProjectsOptions = {}
): UseGithubProjectsReturn {
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [activeTag, setActiveTag]     = useState(initialTag)
  const [reloadKey, setReloadKey]     = useState(0)

  const retry = useCallback(() => {
    try { localStorage.removeItem(REPOS_CACHE_KEY) } catch { /* ignora */ }
    setReloadKey(k => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchRepos()
      .then(async repos => {
        if (cancelled) return
        // Lista os projetos imediatamente (sem esperar detalhes extras),
        // depois enriquece com tags/descrição/thumb conforme cada busca termina.
        const initial = repos.map((r, i) => repoToProject(r, i, r.language ? [r.language] : []))
        setAllProjects(initial)
        setLoading(false)

        for (let i = 0; i < repos.length; i++) {
          if (cancelled) return
          const repo = repos[i]

          const [langs, readme, thumb] = await Promise.all([
            fetchLanguagesFor(repo.name),
            repo.description ? Promise.resolve(null) : fetchReadmeSummary(repo.name),
            findRepoThumb(repo.name),
          ])

          if (cancelled) return
          setAllProjects(prev => {
            const next = [...prev]
            next[i] = repoToProject(
              repo,
              i,
              langs.length > 0 ? langs : (repo.language ? [repo.language] : []),
              readme ?? undefined,
              thumb,
            )
            return next
          })

          // pequeno intervalo entre repositórios pra não estourar o rate limit
          await new Promise(r => setTimeout(r, 120))
        }
      })
      .catch(e => {
        if (cancelled) return
        console.warn('useGithubProjects: falha ao buscar repositórios', e)
        setError('Não foi possível carregar os projetos do GitHub agora.')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  const tags = useMemo(() => {
    const set = new Set<string>()
    allProjects.forEach(p => p.tags.forEach(t => set.add(t)))
    return ['Todos', ...Array.from(set).sort()]
  }, [allProjects])

  const projects = useMemo(() => {
    if (activeTag === 'Todos') return allProjects
    return allProjects.filter(p => p.tags.includes(activeTag))
  }, [allProjects, activeTag])

  return {
    projects,
    tags,
    activeTag,
    setActiveTag,
    total: allProjects.length,
    loading,
    error,
    retry,
  }
}
