// ═══════════════════════════════════════════════════════════════════════════════
// src/data/projectValidator.ts
// Valida um JSON bruto contra o schema ProjectInput.
// Retorna erros estruturados — nunca lança exceção.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  ProjectRaw,
  ProjectInput,
  ValidationError,
} from '@/types/project'

// ─── Helpers internos ─────────────────────────────────────────────────────────

const URL_PATTERN = /^https?:\/\/.+/

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return URL_PATTERN.test(value)
  } catch {
    return false
  }
}

function isValidImagePath(value: string): boolean {
  // Aceita paths absolutos (/...) ou URLs (https://...)
  return value.startsWith('/') || isValidUrl(value)
}

// ─── Tipo de retorno do validador ─────────────────────────────────────────────

export type ValidateResult =
  | { ok: true;  value: ProjectInput }
  | { ok: false; error: ValidationError }

// ─── Validador principal ──────────────────────────────────────────────────────

/**
 * validateProject — valida um valor desconhecido contra ProjectInput.
 *
 * Retorna o primeiro erro encontrado (fail-fast) com código estruturado.
 * Nunca lança — todos os casos de erro são valores tipados.
 *
 * @param raw   - valor bruto do import.meta.glob (unknown)
 * @param path  - caminho do arquivo para incluir nos erros
 */
export function validateProject(raw: unknown, path: string): ValidateResult {

  // ── 1. Deve ser objeto não-nulo ──────────────────────────────────────────
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: { code: 'NOT_OBJECT', path } }
  }

  const o = raw as ProjectRaw

  // ── 2. Campos obrigatórios de string ────────────────────────────────────
  const requiredStrings = ['id', 'title', 'description'] as const

  for (const field of requiredStrings) {
    const v = o[field]

    if (v === undefined || v === null) {
      return { ok: false, error: { code: 'MISSING_FIELD', path, field, expected: 'string' } }
    }
    if (typeof v !== 'string') {
      return { ok: false, error: {
        code: 'WRONG_TYPE', path, field,
        expected: 'string',
        received: typeof v,
      }}
    }
    if (v.trim() === '') {
      return { ok: false, error: { code: 'EMPTY_STRING', path, field } }
    }
  }

  // ── 3. tags: string[] não-vazia ──────────────────────────────────────────
  const tags = o['tags']

  if (tags === undefined || tags === null) {
    return { ok: false, error: { code: 'MISSING_FIELD', path, field: 'tags', expected: 'string[]' } }
  }
  if (!Array.isArray(tags)) {
    return { ok: false, error: {
      code: 'WRONG_TYPE', path, field: 'tags',
      expected: 'string[]',
      received: typeof tags,
    }}
  }
  if (tags.length === 0) {
    return { ok: false, error: { code: 'EMPTY_ARRAY', path, field: 'tags' } }
  }

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    if (typeof tag !== 'string' || tag.trim() === '') {
      return { ok: false, error: { code: 'INVALID_TAG', path, index: i, received: tag } }
    }
  }

  // ── 4. imageUrl: opcional, mas se presente deve ser path ou URL válida ──
  const imageUrl = o['imageUrl']

  if (imageUrl !== undefined && imageUrl !== null) {
    if (typeof imageUrl !== 'string') {
      return { ok: false, error: {
        code: 'WRONG_TYPE', path, field: 'imageUrl',
        expected: 'string',
        received: typeof imageUrl,
      }}
    }
    if (!isValidImagePath(imageUrl)) {
      return { ok: false, error: { code: 'INVALID_URL', path, field: 'imageUrl', value: imageUrl } }
    }
  }

  // ── 5. liveUrl / repoUrl: opcionais, mas se presentes devem ser URLs ────
  for (const field of ['liveUrl', 'repoUrl'] as const) {
    const v = o[field]
    if (v === undefined || v === null) continue

    if (typeof v !== 'string') {
      return { ok: false, error: {
        code: 'WRONG_TYPE', path, field,
        expected: 'string',
        received: typeof v,
      }}
    }
    if (!isValidUrl(v)) {
      return { ok: false, error: { code: 'INVALID_URL', path, field, value: v } }
    }
  }

  // ── 6. order: opcional, mas se presente deve ser number finito ──────────
  const order = o['order']

  if (order !== undefined && order !== null) {
    if (typeof order !== 'number' || !Number.isFinite(order)) {
      return { ok: false, error: { code: 'INVALID_ORDER', path, received: order } }
    }
  }

  // ── Todos os checks passaram ─────────────────────────────────────────────
  return {
    ok: true,
    value: {
      id:          (o['id']          as string).trim(),
      title:       (o['title']       as string).trim(),
      description: (o['description'] as string).trim(),
      imageUrl:    typeof imageUrl === 'string' ? imageUrl : undefined,
      tags:        (tags as string[]).map(t => t.trim()),
      liveUrl:     typeof o['liveUrl']  === 'string' ? (o['liveUrl']  as string) : undefined,
      repoUrl:     typeof o['repoUrl']  === 'string' ? (o['repoUrl']  as string) : undefined,
      order:       typeof order       === 'number' ? order            : undefined,
    },
  }
}
