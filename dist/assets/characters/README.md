# Characters / Personagens

Place your character PNGs here. One per section.

## Expected files
- sobre-mim.png
- projetos.png
- experiencias.png
- certificados.png
- contato.png

## Specs
- Format: PNG with transparent background
- Recommended size: 600×900px minimum (portrait orientation)
- Export format: WebP preferred (smaller), PNG acceptable
- Naming: kebab-case, no spaces, no accents

## How paths work
These files are served from `public/` so they are referenced as:
  /persona-portfolio/assets/characters/sobre-mim.png

The base prefix `/persona-portfolio/` matches `base` in vite.config.ts.
If you rename the repo, update both vite.config.ts AND avatars.ts.
