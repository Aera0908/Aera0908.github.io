# Graph Report - web-resume-v2  (2026-07-09)

## Corpus Check
- 45 files · ~2,925,242 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 192 nodes · 297 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68caa1e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Loader.tsx|Loader.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_AERA.DEV — Asset Image Sizing Guide|AERA.DEV — Asset Image Sizing Guide]]

## God Nodes (most connected - your core abstractions)
1. `useHudAudio()` - 23 edges
2. `compilerOptions` - 16 edges
3. `HudAudio` - 13 edges
4. `KPR Portfolio Design Spec — Project Playbook` - 10 edges
5. `hudState` - 9 edges
6. `CyberLines()` - 7 edges
7. `expDampAlpha()` - 7 edges
8. `AERA.DEV — Asset Image Sizing Guide` - 6 edges
9. `scripts` - 5 edges
10. `CameraRig()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `SmoothScrollProvider()` --references--> `lenis`  [EXTRACTED]
  src/components/providers/SmoothScrollProvider.tsx → package.json
- `generateMetadata()` --calls--> `getCaseStudy()`  [EXTRACTED]
  src/app/archive/[slug]/page.tsx → src/lib/case-studies.ts
- `CaseStudyPage()` --calls--> `getCaseStudy()`  [EXTRACTED]
  src/app/archive/[slug]/page.tsx → src/lib/case-studies.ts
- `ProjectArchivePage()` --calls--> `useHudAudio()`  [EXTRACTED]
  src/app/vault/archive/page.tsx → src/components/providers/HudAudioProvider.tsx
- `Navbar()` --calls--> `useHudAudio()`  [EXTRACTED]
  src/components/chrome/Navbar.tsx → src/components/providers/HudAudioProvider.tsx

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, canvas-confetti, gsap, lucide-react, next, react, react-dom, @react-three/drei (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react (+11 more)

### Community 3 - "KPRVerse Design Spec — Project Playbook"
Cohesion: 0.18
Nodes (10): 0. Design DNA (from the KPR reference), 1. Design Tokens (CSS custom properties in `globals.css`), 2. Typography, 3. Scene & Camera (R3F), 4. GSAP Presets, 5. GLSL Helpers, 6. Sound, 7. Performance Budget (+2 more)

### Community 4 - "package.json"
Cohesion: 0.17
Nodes (9): lenis, archivo, jetbrainsMono, metadata, AJLogo(), FrameBorder(), LINKS, Navbar() (+1 more)

### Community 5 - "layout.tsx"
Cohesion: 0.12
Nodes (23): ArchiveItem, ARTS_PENDING, ProjectArchivePage(), SYSTEMS, ResumePreviewModal(), StickyDownloadButton(), SceneCanvas, HudAudioContext (+15 more)

### Community 6 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 7 - "tsconfig.json"
Cohesion: 0.14
Nodes (7): BOOT_LINES, FINAL_LETTERS, Loader(), ORBIT, Phase, HudAudioProvider(), HudAudio

### Community 13 - "SceneCanvas.tsx"
Cohesion: 0.16
Nodes (12): Cursor(), ENTRIES, Experience(), CameraRig(), MoonScene(), VAULT_PANELS, hudState, CAMERA_PATH (+4 more)

### Community 14 - "Loader.tsx"
Cohesion: 0.40
Nodes (4): Page(), SECTIONS, Home(), SECTION_IDS

### Community 15 - "page.tsx"
Cohesion: 0.43
Nodes (5): CaseStudyPage(), generateMetadata(), CASE_STUDIES, CaseStudy, getCaseStudy()

### Community 16 - "AERA.DEV — Asset Image Sizing Guide"
Cohesion: 0.29
Nodes (6): 1. Notable Projects (The Vault), 2. Project Archive (The Gallery), 3. Case Study Banners, 4. Operator Portrait (Hero Profile), 5. Certification Previews, AERA.DEV — Asset Image Sizing Guide

## Knowledge Gaps
- **86 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+81 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`, `package.json`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Why does `gsap` connect `dependencies` to `layout.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _86 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11948790896159317 - nodes in this community are weakly interconnected._
- **Should `tsconfig.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._