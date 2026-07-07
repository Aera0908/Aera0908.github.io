# Graph Report - web-resume-v2  (2026-07-07)

## Corpus Check
- 32 files · ~9,139 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 143 nodes · 196 edges · 14 communities (9 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_KPRVerse Design Spec — Project Playbook|KPRVerse Design Spec — Project Playbook]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_README|README.md]]
- [[_COMMUNITY_tsconfig.json|tsconfig.json]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]
- [[_COMMUNITY_SceneCanvas.tsx|SceneCanvas.tsx]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `HudAudio` - 13 edges
3. `KPR Portfolio Design Spec — Project Playbook` - 10 edges
4. `useHudAudio()` - 7 edges
5. `expDampAlpha()` - 7 edges
6. `hudState` - 6 edges
7. `scripts` - 5 edges
8. `CameraRig()` - 5 edges
9. `Cursor()` - 3 edges
10. `Loader()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `SmoothScrollProvider()` --references--> `lenis`  [EXTRACTED]
  src/components/providers/SmoothScrollProvider.tsx → package.json
- `HoldToReveal()` --calls--> `useHudAudio()`  [EXTRACTED]
  src/components/ui/HoldToReveal.tsx → src/components/providers/HudAudioProvider.tsx
- `Hero()` --calls--> `expDampAlpha()`  [EXTRACTED]
  src/components/sections/Hero.tsx → src/lib/scene.ts
- `Cursor()` --calls--> `expDampAlpha()`  [EXTRACTED]
  src/components/chrome/Cursor.tsx → src/lib/scene.ts
- `Navbar()` --calls--> `useHudAudio()`  [EXTRACTED]
  src/components/chrome/Navbar.tsx → src/components/providers/HudAudioProvider.tsx

## Import Cycles
- None detected.

## Communities (14 total, 5 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, canvas-confetti, lucide-react, next, react, react-dom, @react-three/drei, @react-three/fiber (+1 more)

### Community 2 - "devDependencies"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react (+11 more)

### Community 3 - "KPRVerse Design Spec — Project Playbook"
Cohesion: 0.18
Nodes (10): 0. Design DNA (from the KPR reference), 1. Design Tokens (CSS custom properties in `globals.css`), 2. Typography, 3. Scene & Camera (R3F), 4. GSAP Presets, 5. GLSL Helpers, 6. Sound, 7. Performance Budget (+2 more)

### Community 4 - "package.json"
Cohesion: 0.14
Nodes (13): lenis, archivo, jetbrainsMono, metadata, FrameBorder(), LINKS, Navbar(), HudAudioContext (+5 more)

### Community 5 - "layout.tsx"
Cohesion: 0.23
Nodes (8): gsap, SceneCanvas, ENTRIES, Experience(), Hero(), Projects, HoldToReveal(), EASE

### Community 6 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 7 - "tsconfig.json"
Cohesion: 0.18
Nodes (4): BOOT_LINES, Loader(), Phase, HudAudio

### Community 13 - "SceneCanvas.tsx"
Cohesion: 0.24
Nodes (10): Cursor(), CameraRig(), ParticleField(), VAULT_PANELS, hudState, CAMERA_PATH, expDampAlpha(), getLookTarget() (+2 more)

## Knowledge Gaps
- **71 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`, `package.json`, `layout.tsx`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Why does `gsap` connect `layout.tsx` to `dependencies`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._