/**
 * Case-study content for /projects/[slug] — sourced from the resume
 * (web_resume/src/data/projects.json). NDA engagements carry
 * architecture-level information only; no client visuals or copy.
 */
export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  role: string;
  duration: string;
  status: string;
  img?: string;
  nda?: boolean;
  summary: string;
  highlights: string[];
  architecture: string[];
  stack: { label: string; items: string[] }[];
  links?: { label: string; href: string }[];
  badge?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "fehuvia",
    name: "FEHUVIA",
    category: "WEB3 / AI / FULL-STACK",
    role: "Lead Web3 & Full-Stack Developer",
    duration: "2026",
    status: "LIVE",
    img: "/projects/fehuvia.png",
    summary:
      "Open-finance Web3 B2B treasury workstation for Southeast Asian SMEs — marrying relational database state tracking with smart-contract execution rails on Morph L2 to cut settlement from a 3-day banking standard to under 2 seconds (T+0), at a fraction of a cent per transaction.",
    highlights: [
      "Atomic sub-2-second payment clearance on Morph L2 via custom Solidity contracts",
      "EVM listener daemon: real-time log syncing into PostgreSQL for dual-state financial auditing",
      "AI financial co-pilot: GPT-4o RAG pipeline for structured cashflow analytics and runway forecasting",
      "AI OCR scan auto-parses uploaded invoice sheets and fills workstation drawers",
      "Self-healing background gas faucet dispenses L2 gas asynchronously to MetaMask operators",
      "Zero-custody: client-side signing via MetaMask (EIP-1193) — no private keys near the server",
    ],
    architecture: [
      "B2BSettlement.sol — mUSDC ERC-20 clearance mapped to invoice UUIDs, strict checks-effects-interactions, PaymentSettled event telemetry",
      "Express backend orchestrates AI pipelines and PostgreSQL persistence (pg-pool)",
      "Listener daemon reconciles on-chain events into the relational ledger (dual-state)",
      "Faucet: < 0.005 ETH balance trigger → 0.002 ETH async dispense from a vault key",
      "GPT-4o context-aware RAG prompting with runway JSON structuring",
    ],
    stack: [
      { label: "UI", items: ["React 19", "Vite", "Tailwind CSS", "Recharts"] },
      { label: "Web3", items: ["Solidity ^0.8.24", "Hardhat", "Morph L2", "Ethers.js", "MetaMask"] },
      { label: "Backend", items: ["Node.js", "Express", "PostgreSQL", "OCR engine"] },
      { label: "AI", items: ["OpenAI GPT-4o", "Context-aware RAG"] },
    ],
    links: [
      { label: "FEHUVIA.APP", href: "https://www.fehuvia.app/" },
      { label: "GITHUB", href: "https://github.com/Aera0908/Project_Fehuvia" },
    ],
  },
  {
    slug: "aerovit",
    name: "AEROVIT",
    badge: "Awarded Best Thesis",
    category: "IOT / AI / MOBILE",
    role: "Lead Developer & Embedded Systems Architect",
    duration: "SEP 2024 — APR 2026",
    status: "COMPLETE — PROTOTYPE",
    img: "/projects/aerovit.png",
    summary:
      "Hybrid fitness ecosystem pairing a Flutter app with a custom ESP32-S3 smartwatch, MediaPipe BlazePose tracking, adaptive AI coaching, and an ERC-20 reward token on Ethereum Sepolia — complete at demonstration depth as a fully walkable prototype.",
    highlights: [
      "Custom smartwatch hardware: ESP32-S3, 1.69\" touch LCD, MAX30102 HR/SpO2, QMI8658 IMU, BLE 5.0",
      "33-landmark BlazePose pipeline with EMA smoothing, joint-angle scoring, and rep/form state machines",
      "Gamification: Hunter ranks (E → National), XP, quests, leaderboards, and a 20-floor turn-based dungeon RPG",
      "Web3 rewards: AERO ERC-20 on Sepolia — off-chain accrual, 100 AERO minimum, 24h cooldown, 5% burn",
      "AI coaching: RAG (ChromaDB), STT/TTS, low-latency audio, RL-style intensity adaptation",
    ],
    architecture: [
      "Biometrics stream from the watch as 28-byte BLE packets into the Flutter app",
      "Camera frames feed the pose pipeline in parallel; the AI coach consumes both signals",
      "Firebase Auth, Firestore, and Cloud Functions form the backend plane",
      "Earnings accrue off-chain; withdrawal gates enforce minimum, cooldown, and burn before Sepolia transfer",
    ],
    stack: [
      { label: "Mobile", items: ["Flutter", "Dart", "Flame 2D"] },
      { label: "Hardware", items: ["ESP32-S3", "MAX30102", "QMI8658", "BLE 5.0"] },
      { label: "AI/ML", items: ["MediaPipe BlazePose", "ChromaDB RAG", "PPO coaching"] },
      { label: "Backend / Web3", items: ["Firebase", "Cloud Functions", "Ethereum Sepolia", "ERC-20"] },
    ],
    links: [{ label: "AEROVIT.DEV", href: "https://aerovit.dev" }],
  },
  {
    slug: "stickout",
    name: "STICKOUT",
    category: "EDA / VLSI / WEB",
    role: "Creator & Lead Frontend Engineer",
    duration: "MAY — JUN 2026",
    status: "COMPLETE — PRODUCTION DEPTH",
    img: "/projects/stickout.png",
    summary:
      "Open-source, browser-based EDA tool for creating, editing, and validating VLSI stick diagrams — a custom 2D math viewport on raw HTML5 Canvas with infinite pan/zoom, a Photoshop-style layer stack, and automated design-rule assistants.",
    highlights: [
      "Infinite 2D viewport: screen↔world coordinate transforms, 0.1×–5× zoom, grid snapping at 60fps",
      "Same-layer wire crossovers auto-bridge with arc loops; right-click overrides register solid junctions",
      "Custom double-pass canvas renderer for LaTeX-style subscripts (V_DD, V_SS)",
      "50-level undo/redo, copy/paste clipboards, auto-save, .stk JSON project files",
      "High-resolution export: offscreen canvas at 2× mapping the absolute layout bounding box",
    ],
    architecture: [
      "Front-end MVC: React owns the document model (elements, layers, undo/redo, selection)",
      "CanvasArea routes user input through viewport transforms into world coordinates",
      "Raw Canvas 2D render functions paint world → screen at up to 60fps",
      "Hotkeys: V select, W wire, P via, L label, B brush, E eraser, Ctrl+Z/Y history",
    ],
    stack: [
      { label: "App", items: ["React 19", "Vite 8", "HTML5 Canvas", "CSS3"] },
      { label: "Domain", items: ["VLSI stick layout", "EDA tooling", "LaTeX label rendering"] },
    ],
    links: [
      { label: "STICKOUT.VERCEL.APP", href: "https://stickout.vercel.app" },
      { label: "GITHUB", href: "https://github.com/Aera0908/stickOut" },
    ],
  },
  {
    slug: "emg-controller",
    name: "EMG INTERFACE CONTROLLER",
    category: "EMBEDDED / HARDWARE",
    role: "Embedded Systems Developer & Hardware Designer",
    duration: "ACADEMIC PROJECT",
    status: "COMPLETED",
    img: "/projects/emg.png",
    summary:
      "Real-time electromyography signal processing and visualization on the ESP32-S3 — 500 Hz acquisition through a multi-stage DSP pipeline, streamed over UART to a Python GUI, with a game-controller bridge and custom PCB + enclosure.",
    highlights: [
      "500 Hz EMG sampling on the ESP32-S3 (XIAO), EMG Candy analog front-end",
      "Adaptive threshold calibration per user and muscle group",
      "Real-time Python GUI (pyserial + matplotlib) and Arduino Serial Plotter support",
      "pynput game bridge — muscle activations drive game input (Roblox tested)",
      "Custom KiCad PCB and Fusion 360 3D-printed enclosure",
    ],
    architecture: [
      "Electrodes → EMG Candy front-end (0–3.3V pre-amped) → ESP32-S3 ADC",
      "On-device DSP: rectification, 20-sample RMS window, adaptive thresholding",
      "Clean envelope emitted over UART @ 115200 to PC consumers",
    ],
    stack: [
      { label: "Firmware", items: ["ESP32-S3", "Arduino framework", "C/C++"] },
      { label: "PC", items: ["Python", "pyserial", "matplotlib", "NumPy", "pynput"] },
      { label: "Design", items: ["KiCad", "Fusion 360"] },
    ],
    links: [
      { label: "GITHUB", href: "https://github.com/Aera0908/emg-game-controller" },
    ],
  },
  {
    slug: "safehouse",
    name: "THE SAFEHOUSE",
    category: "3D WEB / SHOWCASE",
    role: "Frontend & 3D Web Developer",
    duration: "2025 — PRESENT",
    status: "WORK IN PROGRESS",
    img: "/projects/safehouse.png",
    summary:
      "Showcase and pitch site for The Safehouse community, delivered as a guided 3D scroll journey — campfire gathering, forest path, signposts, and a gate — rendered in real-time WebGL with scroll-driven choreography.",
    highlights: [
      "Interactive 3D journey scene in React Three Fiber with procedural terrain and ember particles",
      "GSAP timelines + ScrollTrigger wired to Lenis smooth scroll via a shared Tempus clock",
      "13 scroll-driven narrative sections tied to waypoints and scroll stages",
      "Rive vector animations + SplitHeading / Reveal / Parallax motion primitives",
      "Accessibility-first: MotionModeContext honors prefers-reduced-motion; JourneyCanvas is lazy-loaded",
    ],
    architecture: [
      "CampfireCanvas anchors the hero; JourneyCanvas takes over with CurvedGround + pathCurve math",
      "JourneyCamera rig follows the path driven by scroll progress, not time",
      "Scene entities (Tent, Tree, Birds, Gate, Embers) and deterministic RNG modules keep scenes reproducible",
    ],
    stack: [
      { label: "App", items: ["React 19", "Vite 8", "Tailwind CSS 4", "React Router 7"] },
      { label: "Motion", items: ["GSAP 3.15", "Framer Motion 12", "Lenis", "Tempus"] },
      { label: "3D", items: ["Three.js", "@react-three/fiber 9", "drei", "postprocessing"] },
    ],
    links: [
      { label: "LIVE SITE", href: "https://safehouse-inky.vercel.app/" },
      { label: "GITHUB", href: "https://github.com/Aera0908/safe-house" },
    ],
  },
  {
    slug: "plantio",
    name: "PLANT.IO",
    category: "MOBILE / IOT — FREELANCE",
    role: "Full-Stack Mobile & IoT Developer",
    duration: "2025",
    status: "DELIVERED",
    img: "/projects/plantio.png",
    nda: true,
    summary:
      "Flutter IoT monitoring dashboard for nurseries and garden beds — ESP32 devices stream soil moisture, temperature, humidity, EC, and pH in real time, with remote actuator control and a plant-health scoring system rendered as an animated avatar. 8-bit retro UI throughout.",
    highlights: [
      "Real-time multi-device telemetry over Firebase Realtime Database",
      "Remote actuation: pump, fans, and fertilizer dispensing per bed",
      "Plant-mood scoring drives an animated avatar (thirsty / hot / critical / thriving)",
      "Historical analytics with fl_chart; Open-Meteo weather integration",
      "Offline caching, connectivity monitoring, and local push alerts",
    ],
    architecture: [
      "Layered architecture: presentation → Provider state → services → data (Firebase, SharedPreferences)",
      "Singleton services (Firebase, notifications, sound, connectivity); Factory + Strategy patterns on models and data modes",
      "ESP32 firmware pushes per-device streams and subscribes to a command channel",
    ],
    stack: [
      { label: "App", items: ["Flutter", "Dart", "Provider"] },
      { label: "Data", items: ["Firebase RTDB", "Cloud Firestore", "fl_chart"] },
      { label: "Device", items: ["ESP32", "Open-Meteo API"] },
    ],
  },
  {
    slug: "manhwa-reader",
    name: "MANHWA READER",
    category: "WEB / FRONTEND",
    role: "Frontend Developer",
    duration: "2026",
    status: "COMPLETE",
    img: "/projects/manhwa.png",
    summary:
      "Single-page app for discovering titles and reading chapters end-to-end via the MangaDex API — home with search and feeds, detail pages, and a dedicated reader with chapter navigation and persistent themes.",
    highlights: [
      "Discovery: hero search, popular & recently-updated grids, category chips",
      "Reader: full chapter images, chapter dropdown, prev/next, toggleable controls",
      "Light/dark theme with localStorage persistence",
      "Defensive handling of duplicate chapters and inconsistent API payloads",
    ],
    architecture: [
      "mangaService.ts centralizes API calls and data shaping; typed models throughout",
      "Chapter lists merge paginated results and prefer entries with better page coverage",
      "Page URLs resolved from MangaDex base URL + chapter hash + filenames",
    ],
    stack: [
      { label: "App", items: ["React 19", "TypeScript", "Vite 7", "React Router 7", "Tailwind CSS 3"] },
      { label: "Data", items: ["MangaDex REST API"] },
    ],
  },
  {
    slug: "student-consultation",
    name: "STUDENT CONSULTATION SYSTEM",
    category: "WEB / FULL-STACK — FREELANCE",
    role: "Full-Stack Developer",
    duration: "2025",
    status: "DELIVERED",
    nda: true,
    summary:
      "Full-stack platform turning ad-hoc student–professor consultations into a structured, trackable workflow — role-based dashboards, realtime messaging with attachments, an interactive scheduling calendar, and a clear consultation status lifecycle.",
    highlights: [
      "Role-based interfaces for students, professors, and admins",
      "Realtime messaging and calendar scheduling with status lifecycle (pending → approved → ongoing → completed)",
      "Profile management with photo cropping; dashboard analytics; announcements",
    ],
    architecture: [
      "Three-tier: React frontend, Express API, PostgreSQL database",
      "JWT auth with refresh tokens; bcrypt hashing; parameterized queries",
      "Sharp-based image pipeline; response-level caching on hot read endpoints",
    ],
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Vite", "Tailwind CSS"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT", "PostgreSQL"] },
      { label: "Assets", items: ["Multer", "Sharp"] },
    ],
  },
  {
    slug: "walang-basagan",
    name: "WALANG BASAGAN NG THRIFT",
    category: "WEB / E-COMMERCE — FREELANCE",
    role: "Full-Stack Web Developer",
    duration: "2025",
    status: "DELIVERED",
    nda: true,
    summary:
      "Y2K-inspired thrift store platform — storefront, role-based authentication, full shopping flow, threaded customer-support inbox, and an admin dashboard for users, products, orders, homepage content, and tickets.",
    highlights: [
      "Full storefront: catalog, detail pages, cart, checkout, order history",
      "Three-tier role model (admin / moderator / buyer) with protected routes; first admin locked from demotion",
      "In-app support inbox with thread assignment and moderator tools",
      "SQLite-first storage with a JSON fallback mode for portable Windows dev",
    ],
    architecture: [
      "Vite + React + TypeScript SPA over a single Express process",
      "better-sqlite3 default store, environment-flag JSON fallback",
      "bcryptjs password hashing; role checks on privileged routes; image uploads via multer",
    ],
    stack: [
      { label: "Frontend", items: ["React 19", "TypeScript", "Vite", "Tailwind CSS"] },
      { label: "Backend", items: ["Node.js", "Express", "better-sqlite3", "bcryptjs"] },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
