import type { UseFormFieldReturn } from '@hooks/useFormField'
import s from './FormField.module.scss'

// ─── Props compartilhadas ────────────────────────────────────────────────────
interface BaseFieldProps {
  id:          string
  label:       string
  field:       UseFormFieldReturn
  validator?:  (v: string) => string | null
  required?:   boolean
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputFieldProps extends BaseFieldProps {
  type?:       'text' | 'email' | 'tel'
  multiline?:  false
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaFieldProps extends BaseFieldProps {
  multiline:   true
  maxLength?:  number
  rows?:       number
}

type FormFieldProps = InputFieldProps | TextareaFieldProps

/**
 * FormField — wrapper de input/textarea com animações de foco premium.
 *
 * Animações ao focar:
 *   1. Label flutua para o topo (translateY + scale 0.78)
 *   2. Bordas laterais crescem (scaleY 0→1 com stagger)
 *   3. Bordas sup/inf mudam de cinza para vermelho
 *   4. Scanline CRT desce do topo ao fundo do campo
 *   5. Triângulo de canto sup-dir cresce e acende em vermelho
 *   6. Cursor piscante aparece no canto inf-dir
 *
 * Em erro: bordas ficam vermelhas intensas, label fica vermelha,
 *          triggerando shake via `field.shaking`.
 */
export function FormField(props: FormFieldProps) {
  const { id, label, field, validator, required } = props
  const isTextarea = 'multiline' in props && props.multiline === true
  const maxLength  = isTextarea ? (props as TextareaFieldProps).maxLength ?? 500 : undefined
  const rows       = isTextarea ? (props as TextareaFieldProps).rows       ?? 5   : undefined

  // Classes do wrapper
  const wrapCls = [
    s.wrap,
    isTextarea       ? s['wrap--textarea'] : '',
    field.focused    ? s['wrap--focused']  : '',
    field.filled     ? s['wrap--filled']   : '',
    field.error      ? s['wrap--error']    : '',
    field.shaking    ? s['wrap--shake']    : '',
  ].filter(Boolean).join(' ')

  // Classe do contador de chars
  const charLen    = field.value.length
  const charCls    = [
    s.charCount,
    maxLength && charLen > maxLength * 0.85 ? s['charCount--warn']  : '',
    maxLength && charLen >= maxLength        ? s['charCount--limit'] : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={wrapCls}>

      {/* Label flutuante */}
      <label htmlFor={id} className={s.label}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>

      {/* Container das bordas + input */}
      <div className={s.inputWrap}>
        {/* As 4 bordas animadas individualmente */}
        <span className={s.borderT} aria-hidden="true" />
        <span className={s.borderB} aria-hidden="true" />
        <span className={s.borderL} aria-hidden="true" />
        <span className={s.borderR} aria-hidden="true" />

        {/* Triângulo de canto */}
        <span className={s.corner}   aria-hidden="true" />

        {/* Cursor piscante */}
        <span className={s.cursor}   aria-hidden="true" />

        {/* Scanline CRT */}
        <span
          className={s.scanline}
          aria-hidden="true"
          // Re-trigger da animação: chave muda a cada foco
          key={field.focused ? 'focused' : 'blurred'}
        />

        {/* Input ou Textarea */}
        {isTextarea ? (
          <textarea
            id={id}
            className={s.input}
            value={field.value}
            onChange={field.onChange}
            onFocus={field.onFocus}
            onBlur={() => field.onBlur(validator)}
            rows={rows}
            maxLength={maxLength}
            aria-required={required}
            aria-invalid={!!field.error}
            aria-describedby={field.error ? `${id}-error` : undefined}
          />
        ) : (
          <input
            id={id}
            type={(props as InputFieldProps).type ?? 'text'}
            className={s.input}
            value={field.value}
            onChange={field.onChange}
            onFocus={field.onFocus}
            onBlur={() => field.onBlur(validator)}
            aria-required={required}
            aria-invalid={!!field.error}
            aria-describedby={field.error ? `${id}-error` : undefined}
          />
        )}
      </div>

      {/* Contador de chars (só em textarea) */}
      {isTextarea && maxLength && (
        <span className={charCls} aria-live="polite">
          {charLen}/{maxLength}
        </span>
      )}

      {/* Mensagem de erro */}
      {field.error && (
        <span id={`${id}-error`} className={s.errorMsg} role="alert">
          {field.error}
        </span>
      )}
    </div>
  )
}
