export const GITHUB_USER = 'Matheus-Soares-Rothje'

const DATA_RAW = `https://raw.githubusercontent.com/${GITHUB_USER}/portfolio-data/main`
export const ABOUT_URL  = `${DATA_RAW}/about.json`
export const SKILLS_URL = `${DATA_RAW}/skills.json`

export const EXPERIENCES_API_URL = `https://api.github.com/repos/${GITHUB_USER}/portfolio-experiencias/contents/?ref=main`
export const EXPERIENCES_RAW     = `https://raw.githubusercontent.com/${GITHUB_USER}/portfolio-experiencias/main`

export const CERTS_API_URL = `https://api.github.com/repos/${GITHUB_USER}/portfolio-certificados/contents/?ref=main`
export const CERTS_RAW     = `https://raw.githubusercontent.com/${GITHUB_USER}/portfolio-certificados/main`

export const REPOS_CACHE_KEY = 'biblioteca_repos_v1'
export const REPOS_CACHE_TTL = 30 * 60 * 1000
export const LANG_CACHE_KEY  = 'biblioteca_langs_v1'
export const LANG_CACHE_TTL  = 60 * 60 * 1000
