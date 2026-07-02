import { FormField }       from '@components/ui/FormField'
import { useContactForm }  from '@hooks/useContactForm'
import s from './ContactForm.module.scss'

/**
 * ContactForm — formulário de contato com campos animados.
 *
 * Todos os inputs são gerenciados por `FormField` que encapsula
 * as animações de foco premium (label flutuante, bordas 4-sided,
 * scanline CRT, triângulo de canto, cursor piscante).
 *
 * Adaptar o envio em `useContactForm.handleSubmit` para
 * sua API preferida (EmailJS, Formspree, endpoint próprio, etc).
 */
export function ContactForm() {
  const { nome, email, assunto, mensagem, status, handleSubmit } = useContactForm()

  const isSending = status === 'sending'
  const isSuccess = status === 'success'
  const isError   = status === 'error'

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulário de contato"
    >
      {/* Nome + E-mail em linha */}
      <div className={s.row}>
        <FormField
          id="nome"
          label="Nome"
          field={nome}
          required
          validator={v => v.trim().length < 2 ? 'Nome muito curto' : null}
        />
        <FormField
          id="email"
          label="E-mail"
          field={email}
          type="email"
          required
          validator={v => {
            if (!v.trim()) return 'E-mail obrigatório'
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'E-mail inválido'
          }}
        />
      </div>

      {/* Assunto */}
      <FormField
        id="assunto"
        label="Assunto"
        field={assunto}
        required
        validator={v => v.trim().length < 3 ? 'Assunto obrigatório' : null}
      />

      {/* Mensagem */}
      <FormField
        id="mensagem"
        label="Mensagem"
        field={mensagem}
        multiline
        required
        maxLength={500}
        rows={5}
        validator={v => v.trim().length < 10 ? 'Mensagem muito curta (mín. 10 caracteres)' : null}
      />

      {/* Submit + feedback */}
      <div className={s.submitWrap}>
        <button
          type="submit"
          className={[s.submitBtn, isSending ? s['submitBtn--sending'] : ''].join(' ')}
          disabled={isSending || isSuccess}
          aria-busy={isSending}
        >
          {isSending ? 'Enviando' : isSuccess ? 'Enviado ✓' : 'Transmitir'}
        </button>

        {isSuccess && (
          <span className={`${s.statusMsg} ${s['statusMsg--success']}`} role="status">
            Mensagem enviada
          </span>
        )}
        {isError && (
          <span className={`${s.statusMsg} ${s['statusMsg--error']}`} role="alert">
            Falha no envio — tente novamente
          </span>
        )}
      </div>
    </form>
  )
}
