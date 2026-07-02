// ═══════════════════════════════════════════════════════════════════════════════
// src/types/project.ts — tipagens completas do sistema de projetos
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Tipo público (consumido pelos componentes) ───────────────────────────────

export interface Project {
  /** Slug único derivado do nome do arquivo JSON (sem extensão) */
  id:          string
  title:       string
  description: string
  /** Caminho para a imagem. Opcional — componentes devem lidar com ausência. */
  imageUrl?:   string
  /** Array de strings não-vazias */
  tags:        string[]
  liveUrl?:    string
  repoUrl?:    string
  /** Controla a ordem dos cards. Menor = primeiro. Default: Infinity */
  order:       number
}

// ─── Formato raw do JSON (entrada desconhecida do glob) ───────────────────────

/**
 * ProjectRaw — representa exatamente o que pode vir do JSON.
 * Todos os campos são `unknown` porque o JSON não tem garantia de tipo.
 * O validador é responsável por estreitar para `ProjectInput`.
 */
export type ProjectRaw = Record<string, unknown>

/**
 * ProjectInput — JSON já validado, antes de normalizar `order`.
 * Espelha os campos do JSON com os tipos exatos esperados.
 */
export interface ProjectInput {
  id:          string
  title:       string
  description: string
  imageUrl?:   string
  tags:        string[]
  liveUrl?:    string
  repoUrl?:    string
  order?:      number
}

// ─── Sistema de Result para erros de carregamento ────────────────────────────

/** Sucesso: carregou e validou o projeto. */
export interface LoadOk {
  type:    'ok'
  project: Project
  path:    string
}

/** Falha: JSON inválido ou campo com tipo errado. */
export interface LoadErr {
  type:   'err'
  path:   string
  reason: ValidationError
}

export type LoadResult = LoadOk | LoadErr

// ─── Erros de validação estruturados ─────────────────────────────────────────

export type ValidationError =
  | { code: 'NOT_OBJECT';        path: string }
  | { code: 'MISSING_FIELD';     path: string; field: string; expected: string }
  | { code: 'WRONG_TYPE';        path: string; field: string; expected: string; received: string }
  | { code: 'EMPTY_STRING';      path: string; field: string }
  | { code: 'EMPTY_ARRAY';       path: string; field: string }
  | { code: 'INVALID_TAG';       path: string; index: number; received: unknown }
  | { code: 'INVALID_URL';       path: string; field: string; value: string }
  | { code: 'DUPLICATE_ID';      path: string; id: string; conflictPath: string }
  | { code: 'INVALID_ORDER';     path: string; received: unknown }

/**
 * Formata um ValidationError em mensagem legível para logs.
 */
export function formatValidationError(err: ValidationError): string {
  switch (err.code) {
    case 'NOT_OBJECT':
      return `${err.path}: o JSON não é um objeto`
    case 'MISSING_FIELD':
      return `${err.path}: campo obrigatório ausente "${err.field}" (esperado: ${err.expected})`
    case 'WRONG_TYPE':
      return `${err.path}: "${err.field}" deveria ser ${err.expected}, recebeu ${err.received}`
    case 'EMPTY_STRING':
      return `${err.path}: "${err.field}" não pode ser string vazia`
    case 'EMPTY_ARRAY':
      return `${err.path}: "${err.field}" não pode ser array vazio`
    case 'INVALID_TAG':
      return `${err.path}: tags[${err.index}] não é uma string válida (recebeu: ${JSON.stringify(err.received)})`
    case 'INVALID_URL':
      return `${err.path}: "${err.field}" não é uma URL válida ("${err.value}")`
    case 'DUPLICATE_ID':
      return `${err.path}: id "${err.id}" já existe em ${err.conflictPath}`
    case 'INVALID_ORDER':
      return `${err.path}: "order" deve ser number, recebeu ${JSON.stringify(err.received)}`
  }
}

// ─── Sumário de carregamento (para debug / DevTools) ─────────────────────────

export interface LoadSummary {
  total:    number
  loaded:   number
  failed:   number
  errors:   LoadErr[]
  projects: Project[]
}
