import { useState, useEffect, useCallback } from 'react'
import { CERTS_API_URL, CERTS_RAW } from '@/data/githubConfig'
import type { Certificate, CertificateIcon } from '@/types'

interface GithubItem { name: string; type: string }
interface InfoRaw { name?: string; titulo?: string; platform?: string; plataforma?: string; year?: number | string; ano?: number | string; icon?: string; icone?: string; url?: string; link?: string }

const VALID: CertificateIcon[] = ['html5','css3','js','react','node','python','atom','default']
function toIcon(raw?: string): CertificateIcon {
  const n = (raw ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if ((VALID as string[]).includes(n)) return n as CertificateIcon
  if (n.includes('python')) return 'python'; if (n.includes('react')) return 'react'
  if (n.includes('node')) return 'node'; if (n.includes('css')) return 'css3'
  if (n.includes('html')) return 'html5'; if (n.includes('js')) return 'js'
  return 'default'
}

async function findImage(folder: string): Promise<string | undefined> {
  for (const name of ['cert.png','certificado.png','thumb.png','cert.jpg']) {
    const url = `${CERTS_RAW}/${encodeURIComponent(folder)}/${name}`
    try { if ((await fetch(url, { method: 'HEAD' })).ok) return url } catch { /* noop */ }
  }
}

async function fetchCert(folder: string): Promise<Certificate | null> {
  try {
    const r = await fetch(`${CERTS_RAW}/${encodeURIComponent(folder)}/info.json`)
    if (!r.ok) return null
    const info: InfoRaw = await r.json()
    const year = Number(info.year ?? info.ano ?? new Date().getFullYear())
    const imageUrl = await findImage(folder)
    return { id: folder, name: info.name ?? info.titulo ?? folder.replace(/[-_]/g, ' '), platform: info.platform ?? info.plataforma ?? '', year: isNaN(year) ? new Date().getFullYear() : year, icon: toIcon(info.icon ?? info.icone), url: info.url ?? info.link, imageUrl }
  } catch { return null }
}

export function useGithubCerts() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [key, setKey]                   = useState(0)
  const retry = useCallback(() => setKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetch(CERTS_API_URL)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(async (items: GithubItem[]) => {
        const list = await Promise.all(items.filter(i => i.type === 'dir').map(f => fetchCert(f.name)))
        if (cancelled) return
        setCertificates(list.filter((c): c is Certificate => c !== null).sort((a, b) => b.year - a.year))
        setLoading(false)
      })
      .catch(e => { if (!cancelled) { console.warn(e); setError('Não foi possível consultar o catálogo de certificados.'); setLoading(false) } })
    return () => { cancelled = true }
  }, [key])

  return { certificates, loading, error, retry }
}
