# Persona Portfolio

Portfolio pessoal com visual inspirado no estilo de Persona 5.
Construído com React 19 + TypeScript + GSAP + SCSS Modules.

## Stack

- **React 19** + **TypeScript**
- **Vite 6** (build tool)
- **GSAP 3** (animações + ScrollTrigger + transições de página)
- **SCSS Modules** (design system com tokens CSS)
- **React Router 7** (HashRouter para GitHub Pages)
- **gh-pages** (deploy automatizado)

## Configuração inicial

### 1. Clonar e instalar

```bash
git clone https://github.com/SEU_USUARIO/persona-portfolio.git
cd persona-portfolio
npm install
```

### 2. Configurar o nome do repositório

Edite `vite.config.ts` e altere `REPO_NAME` para o nome exato do seu repositório no GitHub:

```ts
const REPO_NAME = 'persona-portfolio'  // ← nome do seu repo
```

### 3. Personalizar os dados

Edite os arquivos em `src/data/`:

| Arquivo | O que editar |
|---|---|
| `src/pages/SobreMim.tsx` | `OWNER` — nome, cargo |
| `src/pages/SobreMimDetalhes.tsx` | Bio, skills, atributos, timeline |
| `src/data/projects.ts` ou `src/content/projects/*.json` | Projetos |
| `src/data/experiences.ts` | Experiências profissionais |
| `src/data/certificates.ts` | Certificados |
| `src/data/contact.ts` | E-mail, GitHub, LinkedIn etc. |
| `src/components/layout/Logo.tsx` | Iniciais (`JS` → suas iniciais) |

### 4. Adicionar imagens

Coloque os assets em `public/assets/`:

```
public/
  assets/
    characters/
      sobre-mim.png      ← personagem Home (img.png)
      sobre-mim-2.png    ← personagem Sobre Mim (img2.png)
      experiencias.png   ← personagem Experiências (img3.png)
      certificados.png   ← personagem Certificados (img4.png)
      contato.png        ← personagem Contato (img5.png)
    projects/
      projeto-1.jpg      ← imagens dos projetos
```

## Desenvolvimento local

```bash
npm run dev
```

Abre em `http://localhost:5173`

## Deploy no GitHub Pages

### Primeira vez

1. Crie o repositório no GitHub com o nome configurado em `REPO_NAME`
2. Inicialize o git e faça o primeiro push:

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/persona-portfolio.git
git push -u origin main
```

3. Faça o deploy:

```bash
npm run deploy
```

4. No GitHub → Settings → Pages → Source: selecione **gh-pages** branch

### Deploys subsequentes

```bash
npm run deploy
```

O script executa `npm run build && gh-pages -d dist` automaticamente.

## Adicionando projetos

Crie um arquivo JSON em `src/content/projects/`:

```json
{
  "id":          "meu-projeto",
  "title":       "Nome do Projeto",
  "description": "Descrição curta.",
  "imageUrl":    "/persona-portfolio/assets/projects/meu-projeto.jpg",
  "tags":        ["React", "TypeScript"],
  "liveUrl":     "https://...",
  "repoUrl":     "https://github.com/...",
  "order":       1
}
```

Salve — o projeto aparece automaticamente na página de Projetos.

## Estrutura do projeto

```
src/
  components/
    layout/          Navbar, BottomNav, Layout, Logo, NavItem
    ui/              Button, Card, ProjectCard, CollectibleCard,
                     FormField, ContactForm, AnimatedStat, SkillBar,
                     TimelineEntry, TechIcon, DevErrorPanel
    transitions/     LoadingScreen
    shapes/          DiagonalShape
  pages/             SobreMim, SobreMimDetalhes, Projetos,
                     Experiencias, Certificados, Contato
  data/              navigation, projects, experiences,
                     certificates, contact, avatars
  content/
    projects/        *.json — projetos carregados via import.meta.glob
  hooks/             useReveal, usePageTransition, useSwipeNav,
                     useModal, useProjects, useFormField,
                     useContactForm, useCountUp, useSkillReveal,
                     useTimelineReveal, useLoadSummary
  lib/               gsap.ts — configuração global GSAP
  styles/            global.scss, _keyframes, _mixins, _variables
  types/             index.ts, project.ts
```

## Tecnologias e licenças

- Fontes: [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) e [Rajdhani](https://fonts.google.com/specimen/Rajdhani) via Google Fonts (OFL)
- GSAP: licença gratuita para uso pessoal/portfólio ([gsap.com/licensing](https://gsap.com/licensing/))
- Inspiração visual: Atlus / Persona 5 — este projeto não tem afiliação com a Atlus
