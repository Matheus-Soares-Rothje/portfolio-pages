// ═══════════════════════════════════════════════════════════════════════════════
// usePageTransition — versão simplificada e segura
//
// A versão anterior criava elementos via document.createElement direto no
// <body> (fora do controle do React) para fazer uma transição cinematográfica
// com faixas vermelhas diagonais. Essa abordagem se mostrou frágil: em certas
// condições (recarregamento de código durante o desenvolvimento, navegação
// rápida entre páginas, etc.) a animação podia ser interrompida no meio do
// caminho, deixando as faixas vermelhas travadas cobrindo a tela permanente-
// mente — sem nenhuma forma de removê-las a não ser recarregar a página.
//
// Esta versão faz um fade simples (opacidade) usando apenas classes CSS
// controladas pelo React, sem nenhuma manipulação direta do DOM. Não há
// elementos "soltos" que possam sobreviver além do tempo esperado, então
// não existe risco de tela travada.
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react'

const FADE_DURATION_MS = 180

/**
 * usePageTransition — aplica um fade suave de opacidade no conteúdo
 * principal a cada troca de rota.
 *
 * Uso: chame no componente que envolve o <Outlet/> (ex.: Layout) e aplique
 * a classe retornada no elemento que envolve o conteúdo da página.
 *
 * ```tsx
 * const transitionClass = usePageTransition(pathname)
 * <main className={transitionClass}>...</main>
 * ```
 */
export function usePageTransition(pathname: string): string {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), FADE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  return isTransitioning ? 'page-transition-fade-out' : 'page-transition-fade-in'
}
