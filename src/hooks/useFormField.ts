import { useState, useCallback, useRef } from 'react'

export interface FormFieldState {
  value:    string
  focused:  boolean
  filled:   boolean
  error:    string | null
  shaking:  boolean
}

export interface UseFormFieldReturn extends FormFieldState {
  onChange:  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFocus:   () => void
  onBlur:    (validator?: (v: string) => string | null) => void
  setError:  (msg: string | null) => void
  shake:     () => void
  reset:     () => void
}

/**
 * useFormField — estado completo de um campo de formulário.
 *
 * Gerencia: valor, foco, preenchido, erro e animação de shake.
 * O shake usa um timer para remover a classe após a animação CSS.
 */
export function useFormField(initial = ''): UseFormFieldReturn {
  const [value,   setValue  ] = useState(initial)
  const [focused, setFocused] = useState(false)
  const [error,   setError  ] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (error) setError(null)   // limpa erro ao digitar
  }, [error])

  const onFocus = useCallback(() => setFocused(true), [])

  const onBlur = useCallback((validator?: (v: string) => string | null) => {
    setFocused(false)
    if (validator) setError(validator(value))
  }, [value])

  const shake = useCallback(() => {
    if (shakeTimer.current) clearTimeout(shakeTimer.current)
    setShaking(false)
    // Força reflow para reiniciar a animação
    requestAnimationFrame(() => {
      setShaking(true)
      shakeTimer.current = setTimeout(() => setShaking(false), 500)
    })
  }, [])

  const reset = useCallback(() => {
    setValue('')
    setFocused(false)
    setError(null)
    setShaking(false)
  }, [])

  return {
    value,
    focused,
    filled: value.trim().length > 0,
    error,
    shaking,
    onChange,
    onFocus,
    onBlur,
    setError,
    shake,
    reset,
  }
}
