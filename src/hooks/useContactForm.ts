import { useState, useCallback } from 'react'
import { useFormField } from '@hooks/useFormField'

// ─── Validadores ──────────────────────────────────────────────────────────────
const validators = {
  nome: (v: string) =>
    v.trim().length < 2 ? 'Nome muito curto' : null,

  email: (v: string) => {
    if (!v.trim()) return 'E-mail obrigatório'
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    return ok ? null : 'E-mail inválido'
  },

  assunto: (v: string) =>
    v.trim().length < 3 ? 'Assunto obrigatório' : null,

  mensagem: (v: string) =>
    v.trim().length < 10 ? 'Mensagem muito curta (mín. 10 caracteres)' : null,
}

export type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

/**
 * useContactForm — gerencia o estado completo do formulário de contato.
 *
 * Cada campo usa `useFormField` individualmente para que os estados
 * de foco, erro e shake sejam independentes.
 *
 * O submit valida todos os campos, shakes nos inválidos,
 * e simula um envio (adaptar para API real).
 */
export function useContactForm() {
  const nome     = useFormField()
  const email    = useFormField()
  const assunto  = useFormField()
  const mensagem = useFormField()
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Valida todos os campos
    const nomeErr     = validators.nome(nome.value)
    const emailErr    = validators.email(email.value)
    const assuntoErr  = validators.assunto(assunto.value)
    const mensagemErr = validators.mensagem(mensagem.value)

    nome.setError(nomeErr)
    email.setError(emailErr)
    assunto.setError(assuntoErr)
    mensagem.setError(mensagemErr)

    // Shake nos campos inválidos com delay escalonado
    const invalids = [
      { err: nomeErr,     field: nome     },
      { err: emailErr,    field: email    },
      { err: assuntoErr,  field: assunto  },
      { err: mensagemErr, field: mensagem },
    ].filter(f => f.err !== null)

    if (invalids.length > 0) {
      invalids.forEach(({ field }, i) => {
        setTimeout(() => field.shake(), i * 80)
      })
      return
    }

    // Envio simulado (adaptar para sua API / EmailJS / Formspree)
    setStatus('sending')
    try {
      await new Promise(res => setTimeout(res, 1500)) // simula latência
      setStatus('success')
      nome.reset()
      email.reset()
      assunto.reset()
      mensagem.reset()
    } catch {
      setStatus('error')
    }
  }, [nome, email, assunto, mensagem])

  const resetStatus = useCallback(() => setStatus('idle'), [])

  return { nome, email, assunto, mensagem, status, handleSubmit, resetStatus }
}
