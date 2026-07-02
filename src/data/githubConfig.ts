// ═══════════════════════════════════════════════════════════════════════════════
// src/data/githubConfig.ts
// Configuração central de onde os dados dinâmicos do portfólio são buscados.
// Edite as constantes abaixo para apontar para os seus próprios repositórios.
// ═══════════════════════════════════════════════════════════════════════════════

/** Usuário do GitHub usado para listar repositórios (seção Projetos) */
export const GITHUB_USER = 'Matheus-Soares-Rothje'

/** Repositório usado como "banco de dados" de about/skills/certificados */
const DATA_REPO   = 'portfolio-data'
const DATA_BRANCH = 'main'
const DATA_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${DATA_REPO}/${DATA_BRANCH}`

export const ABOUT_URL  = `${DATA_RAW_BASE}/about.json`
export const SKILLS_URL = `${DATA_RAW_BASE}/skills.json`

/** Repositório onde cada pasta = uma experiência profissional */
export const EXPERIENCES_REPO    = 'portfolio-experiencias'
export const EXPERIENCES_BRANCH  = 'main'
export const EXPERIENCES_API_URL =
  `https://api.github.com/repos/${GITHUB_USER}/${EXPERIENCES_REPO}/contents/?ref=${EXPERIENCES_BRANCH}`
export const EXPERIENCES_RAW_BASE =
  `https://raw.githubusercontent.com/${GITHUB_USER}/${EXPERIENCES_REPO}/${EXPERIENCES_BRANCH}`

/** Repositório onde cada pasta = um certificado */
export const CERTS_REPO    = 'portfolio-certificados'
export const CERTS_BRANCH  = 'main'
export const CERTS_API_URL =
  `https://api.github.com/repos/${GITHUB_USER}/${CERTS_REPO}/contents/?ref=${CERTS_BRANCH}`
export const CERTS_RAW_BASE =
  `https://raw.githubusercontent.com/${GITHUB_USER}/${CERTS_REPO}/${CERTS_BRANCH}`

export const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i

/** Cache local (localStorage) — evita bater no limite de requisições da API do GitHub */
export const REPOS_CACHE_KEY = 'persona_github_repos_v1'
export const REPOS_CACHE_TTL = 30 * 60 * 1000 // 30 minutos

export const LANG_CACHE_KEY = 'persona_github_langs_v1'
export const LANG_CACHE_TTL = 60 * 60 * 1000 // 1 hora
