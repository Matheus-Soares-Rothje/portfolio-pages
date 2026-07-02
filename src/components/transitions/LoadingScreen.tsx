import { useEffect, useState } from 'react'
import s from './LoadingScreen.module.scss'

interface LoadingScreenProps {
  /** Duração total da animação de loading em ms. Default: 1800 */
  duration?: number
  /** Callback chamado quando a tela de loading encerra */
  onComplete?: () => void
}

/**
 * LoadingScreen — tela de introdução estilo Persona 5.
 *
 * Exibe uma animação de progresso falsa que percorre de 0 → 100%
 * durante `duration` ms, depois executa o sweep de saída diagonal
 * e chama `onComplete`.
 *
 * Uso em App.tsx:
 * ```tsx
 * const [loaded, setLoaded] = useState(false)
 * if (!loaded) return <LoadingScreen onComplete={() => setLoaded(true)} />
 * return <AppRouter />
 * ```
 */
export function LoadingScreen({ duration = 1800, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const startTime = performance.now()

    // Curva de progresso não-linear: arranca rápido, desacelera no final
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    let raf: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(t)
      setProgress(Math.round(eased * 100))

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        // Pequena pausa antes do sweep de saída
        setTimeout(() => {
          setExiting(true)
          // Aguarda animação CSS (0.6s) antes de desmontar
          setTimeout(() => onComplete?.(), 620)
        }, 180)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, onComplete])

  return (
    <div
      className={`${s.overlay} ${exiting ? s.exiting : ''}`}
      aria-label="Carregando portfolio"
      role="status"
    >
      {/* Faixas diagonais de fundo */}
      <div className={s.stripes} aria-hidden="true" />

      {/* Barra lateral vermelha */}
      <div className={s.accentBlock} aria-hidden="true" />

      {/* Cantos decorativos */}
      <div className={s.cornerTL} aria-hidden="true" />
      <div className={s.cornerBR} aria-hidden="true" />

      {/* Conteúdo central */}
      <div className={s.content}>
        {/* Título */}
        <div className={s.logoWrap}>
          <h1 className={s.logoTitle}>Portfolio</h1>
          <p className={s.logoSub}>Loading&nbsp;assets</p>
        </div>

        {/* Barra de progresso */}
        <div className={s.progressWrap}>
          <div className={s.progressLabel}>
            <span>SISTEMA</span>
            <span>{progress}%</span>
          </div>
          <div className={s.progressTrack}>
            <div
              className={s.progressBar}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Pontos pulsantes */}
        <div className={s.dots} aria-hidden="true">
          <span className={s.dot} />
          <span className={s.dot} />
          <span className={s.dot} />
        </div>
      </div>
    </div>
  )
}
