// ═══════════════════════════════════════════════════════════════════════════════
// src/data/projectLoader.ts
// Carrega projetos via import.meta.glob, valida cada JSON e expõe
// um sumário de erros para inspeção em desenvolvimento.
// ═══════════════════════════════════════════════════════════════════════════════

import { validateProject }                       from '@data/projectValidator'
import { formatValidationError }                 from '@/types/project'
import type { Project, LoadResult, LoadSummary } from '@/types/project'

// ─── Glob síncrono ────────────────────────────────────────────────────────────
// eager: true → Vite resolve em build time, zero async, zero loading state.
// O tipo genérico é `unknown` porque o validador faz a estreitagem.

const modules = import.meta.glob<unknown>(
  '../content/projects/*.json',
  { eager: true }
)

// ─── Processa cada módulo ─────────────────────────────────────────────────────

function processModules(): LoadSummary {
  const results: LoadResult[] = []
  const seenIds = new Map<string, string>() // id → path

  for (const [path, raw] of Object.entries(modules)) {
    const validation = validateProject(raw, path)

    if (!validation.ok) {
      results.push({ type: 'err', path, reason: validation.error })
      continue
    }

    const input = validation.value

    // Checa IDs duplicados entre arquivos
    const existingPath = seenIds.get(input.id)
    if (existingPath) {
      results.push({
        type: 'err',
        path,
        reason: {
          code:         'DUPLICATE_ID',
          path,
          id:           input.id,
          conflictPath: existingPath,
        },
      })
      continue
    }

    seenIds.set(input.id, path)

    const project: Project = {
      id:          input.id,
      title:       input.title,
      description: input.description,
      imageUrl:    input.imageUrl,
      tags:        input.tags,
      liveUrl:     input.liveUrl,
      repoUrl:     input.repoUrl,
      order:       input.order ?? Number.MAX_SAFE_INTEGER,
    }

    results.push({ type: 'ok', project, path })
  }

  // ── Ordena os projetos válidos ────────────────────────────────────────────
  const loaded = results
    .filter((r): r is Extract<LoadResult, { type: 'ok' }> => r.type === 'ok')
    .map(r => r.project)
    .sort((a, b) =>
      a.order !== b.order
        ? a.order - b.order
        : a.id.localeCompare(b.id)
    )

  const errors = results
    .filter((r): r is Extract<LoadResult, { type: 'err' }> => r.type === 'err')

  return {
    total:    results.length,
    loaded:   loaded.length,
    failed:   errors.length,
    errors,
    projects: loaded,
  }
}

// ─── Sumário (singleton, gerado uma vez em boot) ─────────────────────────────

export const loadSummary: LoadSummary = processModules()

// ─── Log de erros em desenvolvimento ─────────────────────────────────────────

if (import.meta.env.DEV && loadSummary.failed > 0) {
  console.group(
    `%c[projectLoader] ${loadSummary.failed} projeto(s) com erro`,
    'color: #e2001a; font-weight: bold;'
  )
  for (const err of loadSummary.errors) {
    console.warn(
      `%c✗ ${err.path}\n  ${formatValidationError(err.reason)}`,
      'color: #ff6b6b;'
    )
  }
  console.groupEnd()
}

// ─── Exports públicos ─────────────────────────────────────────────────────────

/**
 * projects — array de projetos válidos, ordenados por `order`.
 * Drop-in replacement do antigo `import { projects } from '@data/projects'`.
 */
export const projects: Project[] = loadSummary.projects

/**
 * loadProjects — retorna o array de projetos válidos.
 * Mantido para compatibilidade com código existente.
 */
export function loadProjects(): Project[] {
  return loadSummary.projects
}
