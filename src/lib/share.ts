// ═══════════════════════════════════════════════════════════════════════════════
// src/lib/share.ts
// Compartilha a URL atual do site usando a Web Share API nativa
// (em celulares) ou copiando o link para a área de transferência
// (em desktop, onde normalmente não há share nativo).
// ═══════════════════════════════════════════════════════════════════════════════

export interface ShareResult {
  /** 'shared' = abriu o menu nativo · 'copied' = copiou pro clipboard · 'failed' = nenhum dos dois funcionou */
  status: 'shared' | 'copied' | 'failed'
}

export async function shareSite(title = document.title): Promise<ShareResult> {
  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      return { status: 'shared' }
    } catch {
      // usuário cancelou o share nativo — não trata como erro
      return { status: 'shared' }
    }
  }

  try {
    await navigator.clipboard.writeText(url)
    return { status: 'copied' }
  } catch {
    return { status: 'failed' }
  }
}
