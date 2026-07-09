# AERA.DEV — Aira Ynte Portfolio

An immersive, scrollytelling developer portfolio for **Aira Ynte** ([@Aera0908](https://github.com/Aera0908)) — a Computer Engineer working across full-stack systems, embedded hardware, and Web3.

White editorial panels scroll over a persistent WebGL "moon world" while a single scrubbed timeline drives the camera, particles, and section reveals. Built in a cyberpunk white / black / yellow palette.

🌐 **Live:** https://aera0908.github.io

## Highlights

- **Boot loader** — terminal boot log, scramble-decoded `AERA` wordmark, a 2.5D moon orbiting the logo, and a sci-fi reticle cursor during the intro.
- **Hero** — pinned card that morphs to fullscreen and back, revealing a one-screen operator-profile collage.
- **Journey** — horizontally-scrolling experience cards that flip in as they cross the viewport.
- **Vault** — fanned collectible project folders; hold one to open the folder (black interior, cover flap swings away) and fly into its case file.
- **Credentials** — a terminal-dashboard of certifications with in-page preview + download.
- **Contact** — links, plus a sticky Résumé / CV download.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties |
| 3D / WebGL | three.js, @react-three/fiber, @react-three/drei |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Deploy | Static export → GitHub Pages via GitHub Actions |

## Routing

The whole experience is one page served from an optional catch-all route (`src/app/[[...section]]`):

- `/` — plays the intro, then the full scroll experience.
- `/journey`, `/vault`, `/credentials`, `/contact` — deep-link straight to a section (skips the intro). The URL also updates as you scroll.
- `/vault/archive` — full project archive (systems + arts).
- `/vault/archive/[slug]` — individual project case files (statically generated for every project).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # static export → ./out
npm run lint
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs `next build` (static export to `out/`) and publishes it to GitHub Pages.

> **One-time repo setting:** in **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. (The workflow deploys via the Pages artifact API, not a `gh-pages` branch.)

Static-export notes:
- `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `images.unoptimized: true`.
- `public/.nojekyll` keeps GitHub Pages from stripping the `_next/` asset folder.
- This is a **user site** (`aera0908.github.io`) served at the domain root, so no `basePath` is required. If this is ever moved to a **project** repo (`/<repo>` subpath), add a matching `basePath` / `assetPrefix` in `next.config.ts`.

## Project structure

```
src/
  app/
    [[...section]]/      # the one-page experience (optional catch-all)
    vault/archive/       # project archive + [slug] case files
    layout.tsx           # fonts, metadata, OG card, providers
    globals.css          # design tokens + shape families
  components/
    chrome/              # Loader, Navbar, Cursor, FrameBorder, sticky download
    sections/            # Hero, Experience (Journey), Projects (Vault), Credentials, Contact
    ui/                  # VaultCard, CyberLines, case-study pieces
    webgl/               # SceneCanvas, CameraRig, MoonScene, ParticleField
    providers/           # SmoothScrollProvider, HudAudioProvider
  lib/                   # gsap, scene math, hud-state bridge, case-study data
public/                  # portrait, project thumbnails, certificates, résumé/CV, OG_card.png
```

## Credits

Design & build by Aira Ynte. Inspired by the KPR (Resn) aesthetic; adapted into an original cyberpunk system.
