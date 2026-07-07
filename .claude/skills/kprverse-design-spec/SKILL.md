---
name: kprverse-design-spec
description: Design playbook for the KPR-inspired scrollytelling portfolio. Use whenever you build, design, style, or animate anything in this project — UI sections, canvas/WebGL scenes, shaders, GSAP/scroll animation, sound, cursor, or loader. Contains the design tokens, typography scale, camera path curves, GSAP timeline presets, and GLSL helpers that ALL code must follow.
---

# KPR Portfolio Design Spec — Project Playbook

Single source of truth for visual/motion decisions in `web-resume-v2`.
Reference: KPR by Resn (Awwwards SOTD Dec 26 2022) — PDF study in owner's Downloads.
Never hardcode ad-hoc colors, easings, or camera values — pull them from here.

## 0. Design DNA (from the KPR reference)

- Immersive violet 3D "world" behind everything; **white editorial panels scroll over it**.
- Giant stacked bold uppercase display type with staggered indentation: `FULL-STACK.` `EMBEDDED.` `AI.`
- Numbered index markers `● 001` before every section heading; tiny mono caption text.
- Cards have **one notched (clipped) corner**, radius otherwise small.
- Thin inset frame border around the viewport with mono readouts.
- Crosshair cursor with elongated vertical strokes + lag dot.
- Loader: `→ LOADING - 0%` on a thin rule + circular "TAP TO ENABLE SOUND" button.
- Essentially one-color palette + ink/paper; our adaptation adds one electric accent.

## 1. Design Tokens (CSS custom properties in `globals.css`)

```css
:root {
  /* Brand core — user-specified primary #6064A3 */
  --iris: #6064a3;         /* primary accent, links, markers, progress */
  --iris-bright: #8b90d9;  /* hover states, particle highlights */
  --periwinkle: #c7caf0;   /* light text/tints on dark world */

  /* World (dark immersive layers, WebGL clear color) */
  --world: #141630;        /* deep indigo night */
  --world-2: #23264d;      /* elevated dark surface / dark cards */

  /* Editorial (light layers) */
  --paper: #f4f3ee;        /* editorial panel background */
  --ink: #131318;          /* text on paper */
  --ink-soft: #55555f;     /* secondary text on paper */

  /* Signal */
  --signal: #d9ff3f;       /* electric lime — CTAs, hold-progress, one per view max */
  --alert: #ff5470;        /* errors only */
}
```

Rules:
- Dark sections: bg `--world`, text `--periwinkle`/white, accents `--iris-bright`.
- Light sections: bg `--paper`, text `--ink`, accents `--iris`.
- `--signal` is loud: max one signal element visible per viewport.
- No glows/scanlines/CRT — this design is flat, editorial, printed-poster feel.
  Depth comes from parallax and the 3D world, not from blur/glow.

## 2. Typography

- **Display**: `Archivo` (variable) at weight 800–900, uppercase, `letter-spacing: -0.02em`,
  `line-height: 0.92`. Hero words stack with staggered left indents (0 / 8% / 16%).
- **Body**: `Archivo` 400–500, normal case.
- **Labels/data**: `JetBrains Mono` — index markers, captions, nav, readouts.
- Expose as `--font-display` (Archivo) and `--font-mono` (JetBrains Mono).

Scale:
| Token | Size | Use |
|---|---|---|
| `t-hero` | `clamp(3rem, 11vw, 9.5rem)` | stacked hero words |
| `t-h2` | `clamp(2rem, 5.5vw, 4.5rem)` | section headings |
| `t-body` | `1rem / 1.7` | paragraphs |
| `t-label` | `0.6875rem`, tracking `0.16em`, uppercase | nav, captions |
| `t-micro` | `0.5625rem`, tracking `0.14em` | frame readouts, indices |

Index marker convention: `<span class="index-marker">● 001</span>` in `--iris`, mono.

## 3. Scene & Camera (R3F)

- Single persistent `<Canvas>` fixed at z-0; `dpr={[1, 1.75]}`,
  `gl={{ antialias: false, powerPreference: 'high-performance' }}`.
- Clear color `--world` (#141630). Fog: `FogExp2('#141630', 0.045)`.

Camera path — `CatmullRomCurve3` in `src/lib/scene.ts`, sampled by scroll progress p:

| p | Section | Camera | Particles |
|---|---|---|---|
| 0.00–0.25 | Hero | wide at (0, 0.5, 14) | full swarm, slow drift |
| 0.25–0.50 | Experience | dive to (0, 0, 4) | condense into core |
| 0.50–0.80 | Projects | strafe to (-6, 1, 6) | align into panel grid at x≈-8 |
| 0.80–1.00 | Contact | rise to (0, 9, 10) | ascending streams |

Mouse-bound movement (on top of path position, every frame):
- offset target = `(pointer.x * 0.6, pointer.y * 0.35, 0)`, damped with λ = 4.5.
- Damping is ALWAYS `1 - Math.exp(-λ * dt)` — never a raw per-frame lerp constant.
- HTML mouse parallax: `[data-mouse-depth]` elements, translate up to ±12px, inverse sign for depth.
- Scroll parallax: `[data-speed]` decorative layers, scrubbed yPercent ±15.

## 4. GSAP Presets

```ts
export const EASE = {
  hud: 'power2.out',   // panel/heading reveals
  cam: 'none',         // anything scrubbed — scrub does the smoothing
  glitch: 'steps(6)',  // scramble steps
  elastic: 'expo.out', // counters, hold-progress rings
};
export const SCRUB = 0.8;
```

- One master tween scrubs `{ value: 0 → 1 }` over `#scroll-space` and writes
  `hudState.scrollProgress`; the R3F loop reads it. GSAP never touches THREE objects.
- Section reveals: `start: 'top 75%'`, y 24→0, opacity 0→1, dur 0.9, stagger 0.08.
- Lenis bridge (in SmoothScrollProvider): `lenis.on('scroll', ScrollTrigger.update)`,
  `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`.
- Text scramble charset: `'!<>-_\\/[]{}—=+*^?#01'`, resolve left→right, 40ms/frame.
- Click-and-hold: 600ms hold, progress eased `none`, release before complete reverses at 2× speed.

## 5. GLSL Helpers

hash21 / vnoise as before (see ParticleField). Palette ramp is now iris:

```glsl
// iris palette: world -> iris -> periwinkle -> white by intensity
vec3 irisRamp(float x){
  vec3 world = vec3(.078,.086,.188);   // #141630
  vec3 iris  = vec3(.376,.392,.639);   // #6064a3
  vec3 peri  = vec3(.780,.792,.941);   // #c7caf0
  vec3 c = mix(world, iris, smoothstep(0.0, 0.45, x));
  c = mix(c, peri, smoothstep(0.45, 0.8, x));
  return mix(c, vec3(1.0), smoothstep(0.85, 1.0, x));
}
```

Particle rules: additive blending, `depthWrite: false`, size attenuation,
morph weights w0..w3 computed from uProgress with smoothstep bells (see §3 table).

## 6. Sound

- Engine: `src/lib/audio.ts` (WebAudio synth singleton, no files).
- Boot ONLY from the loader's "tap to enable sound" (or its silent-continue link).
- Ambient hum gain 0.05; hover blip 1200Hz/30ms; click 440→880 sweep/80ms;
  confirm double-chirp; deny low saw. Mute toggle in navbar, persisted `hud-audio`.

## 7. Performance Budget

- 60fps desktop / 30fps floor mobile. Particles: desktop 14k, mobile ≤ 3k.
- Mobile (`pointer: coarse` or < 768px): dpr [1, 1.5], no custom cursor,
  static camera (CSS transitions instead), reduced particle count.
- `prefers-reduced-motion`: no Lenis smoothing, no scramble loops, reveals become fades.
- Never allocate in `useFrame`; hoist scratch Vector3s. Dispose geometry/materials on unmount.
- One Canvas, one draw call for the particle system. HTML overlays via DOM, not drei Html.

## 8. Component Map

```
src/components/
  chrome/   Loader, Navbar, Cursor, FrameBorder, ScrollProgress
  sections/ Hero, Experience, Projects, Contact
  ui/       HoldToReveal, IndexMarker, ScrambleText
  webgl/    SceneCanvas, CameraRig, ParticleField
  providers/ SmoothScrollProvider, HudAudioProvider
```

Sections: `#experience`, `#projects`, `#contact` (nav anchors, Lenis `anchors: true`).
Placeholder resume content until the user supplies real copy.
