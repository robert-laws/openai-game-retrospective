# 1990s Gaming Retrospective

A single-page React + Vite site that blends pixel nostalgia with modern web design.

## Features

- Hero section with parallax and neon retro styling.
- In-page Canvas side-scrolling mini game (keyboard + touch controls).
- Curated 12-game retrospective cards (top 3 with embedded trailers).
- Horizontal 1990s timeline carousel with keyboard support.
- Reduced-effects toggle and muted-by-default audio toggle.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

This repo includes `.github/workflows/deploy.yml`.

- Push to `main` to trigger build and deploy.
- Vite `base` is configured automatically in GitHub Actions using the repository name.
- Site artifact is published from `dist/` via `actions/deploy-pages`.

## Assets

Placeholder thumbnails live in `public/assets/thumbnails`.
See `public/assets/README.md` for attribution notes and free-source suggestions.
