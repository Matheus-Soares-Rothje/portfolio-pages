# Projetos — Como adicionar

Cada arquivo `.json` nesta pasta vira automaticamente um card na página `/projetos`.
**Não é necessário editar nenhum arquivo de código.**

## Campos

```jsonc
{
  "id":          "meu-projeto",          // slug único (usado como key)
  "title":       "Nome do Projeto",      // título exibido no card
  "description": "Descrição curta.",     // texto do card (1–2 frases)
  "imageUrl":    "/persona-portfolio/assets/projects/meu-projeto.jpg",
  "tags":        ["React", "TypeScript"], // array de strings
  "liveUrl":     "https://...",          // opcional — botão "Ver projeto"
  "repoUrl":     "https://github.com/...", // opcional — botão "GitHub"
  "order":       1                       // número inteiro — define a ordem dos cards
}
```

## Passos

1. Crie `src/content/projects/meu-projeto.json` com os campos acima.
2. Adicione a imagem em `public/assets/projects/meu-projeto.jpg`.
3. Salve — o Vite recarrega automaticamente em dev.

## Ordem

Os cards são ordenados pelo campo `order` (crescente).
Projetos sem `order` ficam no final, ordenados pelo nome do arquivo.
