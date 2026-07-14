import { useState, useEffect, useCallback } from 'react'
import { EXPERIENCES_API_URL, EXPERIENCES_RAW } from '@/data/githubConfig'
import type { Experience } from '@/types'

interface GithubItem { name: string; type: string }
interface InfoRaw { role?: string; cargo?: string; company?: string; empresa?: string; period?: string; periodo?: string; description?: string; descricao?: string; isCurrent?: boolean; atual?: boolean }

async function fetchInfo(folder: string): Promise<Experience | null> {
  try {
    const r = await fetch(`${EXPERIENCES_RAW}/${encodeURIComponent(folder)}/info.json`)
    if (!r.ok) return null
    const info: InfoRaw = await r.json()
    return { id: folder, role: info.role ?? info.cargo ?? folder.replace(/[-_]/g, ' '), company: info.company ?? info.empresa ?? '', period: info.period ?? info.periodo ?? '', description: info.description ?? info.descricao ?? '', isCurrent: Boolean(info.isCurrent ?? info.atual ?? false) }
  } catch { return null }
}

export function useGithubExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [key, setKey]                 = useState(0)
  const retry = useCallback(() => setKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetch(EXPERIENCES_API_URL)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(async (items: GithubItem[]) => {
        const list = await Promise.all(items.filter(i => i.type === 'dir').map(f => fetchInfo(f.name)))
        if (cancelled) return
        setExperiences(list.filter((e): e is Experience => e !== null))
        setLoading(false)
      })
      .catch(e => { if (!cancelled) { console.warn(e); setError('Não foi possível consultar o registro de experiências.'); setLoading(false) } })
    return () => { cancelled = true }
  }, [key])

  return { experiences, loading, error, retry }
}
