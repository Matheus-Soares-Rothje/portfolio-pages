// ═══════════════════════════════════════════════════════════════════════════════
// src/hooks/useGithubCerts.ts
// Busca a lista de certificados do repositório `portfolio-certificados`
// (cada pasta = um certificado, com um info.json dentro) e expõe como
// Certificate[] (mesmo tipo já usado em Certificados.tsx / CollectibleCard).
//
// Estrutura esperada no repositório:
// ```
// portfolio-certificados/
// ├── html-css-curso-em-video/
// │   ├── info.json
// │   └── cert.png          ← imagem do certificado (opcional)
// └── react-udemy/
//     └── info.json
// ```
//
// Formato do info.json:
// {
//   "name":     "HTML5 e CSS3",
//   "platform": "Curso em Vídeo",
//   "year":     2023,
//   "icon":     "html5",          ← html5 | js | react | css3 | node | python | atom | default
//   "url":      "https://..."     ← link do certificado (opcional)
// }
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import {
  GITHUB_USER,
  CERTS_REPO,
  CERTS_BRANCH,
  CERTS_API_URL,
  CERTS_RAW_BASE,
} from '@data/githubConfig'
import type { Certificate, CertificateIcon } from '@/types'

interface GithubContentItem {
  name: string
  type: 'file' | 'dir'
}

interface CertInfoRaw {
  name?:        string
  titulo?:      string
  platform?:    string
  plataforma?:  string
  year?:        number | string
  ano?:         number | string
  icon?:        string
  icone?:       string
  url?:         string
  link?:        string
}

const VALID_ICONS: CertificateIcon[] = ['html5', 'js', 'react', 'atom', 'css3', 'node', 'python', 'default']

function toIcon(raw?: string): CertificateIcon {
  const normalized = (raw ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if ((VALID_ICONS as string[]).includes(normalized)) return normalized as CertificateIcon
  if (normalized.includes('python')) return 'python'
  if (normalized.includes('react'))  return 'react'
  if (normalized.includes('node'))   return 'node'
  if (normalized.includes('css'))    return 'css3'
  if (normalized.includes('html'))   return 'html5'
  if (normalized.includes('js') || normalized.includes('javascript')) return 'js'
  return 'default'
}

async function imageExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

async function findCertImage(folderName: string): Promise<string | undefined> {
  const names = ['cert.png', 'certificado.png', 'thumb.png', 'cert.jpg', 'certificado.jpg']
  for (const name of names) {
    const url = `${CERTS_RAW_BASE}/${encodeURIComponent(folderName)}/${name}`
    if (await imageExists(url)) return url
  }
  return undefined
}

async function fetchCertInfoJson(folderName: string): Promise<Certificate | null> {
  const url = `${CERTS_RAW_BASE}/${encodeURIComponent(folderName)}/info.json`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const info: CertInfoRaw = await res.json()

    const rawYear = info.year ?? info.ano
    const year    = rawYear ? Number(rawYear) : new Date().getFullYear()
    const imageUrl = await findCertImage(folderName)

    return {
      id:        folderName,
      name:      info.name ?? info.titulo ?? folderName.replace(/[-_]/g, ' '),
      platform:  info.platform ?? info.plataforma ?? '',
      year:      isNaN(year) ? new Date().getFullYear() : year,
      icon:      toIcon(info.icon ?? info.icone),
      url:       info.url ?? info.link,
      imageUrl,
    }
  } catch {
    return null
  }
}

interface UseGithubCertsReturn {
  certificates: Certificate[]
  loading:      boolean
  error:        string | null
  retry:        () => void
}

/**
 * useGithubCerts — substituto dinâmico do antigo
 * `import { certificates } from '@data/certificates'`.
 */
export function useGithubCerts(): UseGithubCertsReturn {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [reloadKey, setReloadKey]       = useState(0)

  const retry = useCallback(() => setReloadKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(CERTS_API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API respondeu ${res.status}`)
        return res.json()
      })
      .then(async (items: GithubContentItem[]) => {
        const folders = Array.isArray(items) ? items.filter(it => it.type === 'dir') : []
        const list    = await Promise.all(folders.map(f => fetchCertInfoJson(f.name)))
        if (cancelled) return
        const valid = list
          .filter((c): c is Certificate => c !== null)
          .sort((a, b) => b.year - a.year) // mais recentes primeiro
        setCertificates(valid)
        setLoading(false)
      })
      .catch(e => {
        if (cancelled) return
        console.warn('useGithubCerts: falha ao buscar certificados', e)
        setError('Não foi possível carregar os certificados agora.')
        setCertificates([])
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  return { certificates, loading, error, retry }
}
