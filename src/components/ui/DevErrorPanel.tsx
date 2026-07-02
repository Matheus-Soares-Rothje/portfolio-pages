import { useState } from 'react'
import { useLoadSummary } from '@hooks/useLoadSummary'
import { formatValidationError } from '@/types/project'

/**
 * DevErrorPanel — painel de erros de carregamento de projetos.
 *
 * Renderiza APENAS em desenvolvimento (import.meta.env.DEV).
 * Em produção, retorna null sem custo.
 *
 * Mostrar na página Projetos:
 * ```tsx
 * import { DevErrorPanel } from '@components/ui/DevErrorPanel'
 * // dentro do JSX:
 * <DevErrorPanel />
 * ```
 */
export function DevErrorPanel() {
  const [open, setOpen] = useState(true)
  const { failed, errors, total, loaded } = useLoadSummary()

  // Sem custo em produção
  if (!import.meta.env.DEV || failed === 0) return null

  return (
    <aside
      role="alert"
      aria-label="Erros de carregamento de projetos"
      style={{
        position:        'fixed',
        bottom:          '1rem',
        right:           '1rem',
        zIndex:          9999,
        maxWidth:        '480px',
        width:           'calc(100vw - 2rem)',
        fontFamily:      'monospace',
        fontSize:        '12px',
        background:      '#0a0000',
        border:          '2px solid #e2001a',
        boxShadow:       '0 0 24px rgba(226,0,26,0.4)',
      }}
    >
      {/* Header */}
      <div style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         '8px 12px',
        background:      '#e2001a',
        cursor:          'pointer',
      }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: '#fff', fontWeight: 700, letterSpacing: '0.1em' }}>
          ◆ [projectLoader] {failed}/{total} JSON{failed > 1 ? 's' : ''} com erro
        </span>
        <span style={{ color: '#fff', opacity: 0.8 }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Sumário */}
          <div style={{ color: '#888', borderBottom: '1px solid #2a0000', paddingBottom: '8px' }}>
            {loaded} projeto{loaded !== 1 ? 's' : ''} carregado{loaded !== 1 ? 's' : ''} com sucesso
          </div>

          {/* Lista de erros */}
          {errors.map((err, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ color: '#ff6b6b', wordBreak: 'break-all' }}>
                ✗ <strong>{err.path.replace('../content/projects/', '')}</strong>
              </div>
              <div style={{
                color:        '#ffaaaa',
                paddingLeft:  '14px',
                borderLeft:   '2px solid #e2001a',
                marginLeft:   '2px',
              }}>
                [{err.reason.code}] {formatValidationError(err.reason)}
              </div>
            </div>
          ))}

          {/* Dica */}
          <div style={{
            color:       '#555',
            borderTop:   '1px solid #2a0000',
            paddingTop:  '8px',
            lineHeight:  1.5,
          }}>
            Corrija os arquivos em <code style={{ color: '#e2001a' }}>src/content/projects/</code>.
            Este painel não aparece em produção.
          </div>
        </div>
      )}
    </aside>
  )
}
