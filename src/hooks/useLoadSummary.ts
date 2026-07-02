import { loadSummary } from '@data/projectLoader'
import type { LoadSummary } from '@/types/project'

/**
 * useLoadSummary — retorna o sumário de carregamento dos projetos.
 *
 * Útil para mostrar avisos na UI durante desenvolvimento:
 * ```tsx
 * const { failed, errors } = useLoadSummary()
 * if (failed > 0) // renderizar painel de erros
 * ```
 *
 * Em produção, `errors` sempre é [] — os logs são suprimidos em build.
 */
export function useLoadSummary(): LoadSummary {
  return loadSummary
}
