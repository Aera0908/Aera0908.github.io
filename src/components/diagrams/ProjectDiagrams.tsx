import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'

const palette = {
  stroke: 'rgba(0, 240, 255, 0.25)',
  strokeStrong: 'rgba(0, 240, 255, 0.45)',
  accent: '#00f0ff',
  accentSoft: 'rgba(0, 240, 255, 0.08)',
  emerald: '#00ff66',
  emeraldSoft: 'rgba(0, 255, 102, 0.08)',
  amber: '#fcee0a',
  amberSoft: 'rgba(252, 238, 10, 0.08)',
  violet: '#ff0055',
  violetSoft: 'rgba(255, 0, 85, 0.08)',
  slateText: '#f8fafc',
  slateMuted: '#94a3b8',
  neutralFill: 'rgba(18, 19, 25, 0.85)',
}

interface NodeProps {
  x: number
  y: number
  w: number
  h: number
  label: string
  sublabel?: string
  accent?: 'blue' | 'emerald' | 'amber' | 'violet' | 'neutral'
  variant?: 'solid' | 'dashed'
}

const accentMap = {
  blue: { stroke: palette.accent, fill: palette.accentSoft },
  emerald: { stroke: palette.emerald, fill: palette.emeraldSoft },
  amber: { stroke: palette.amber, fill: palette.amberSoft },
  violet: { stroke: palette.violet, fill: palette.violetSoft },
  neutral: { stroke: palette.strokeStrong, fill: palette.neutralFill },
} as const

const DiagramNode = ({ x, y, w, h, label, sublabel, accent = 'neutral', variant = 'solid' }: NodeProps) => {
  const c = accentMap[accent]
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={0}
        ry={0}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.4}
        strokeDasharray={variant === 'dashed' ? '5 4' : undefined}
      />
      <text
        x={x + w / 2}
        y={sublabel ? y + h / 2 - 4 : y + h / 2 + 5}
        textAnchor="middle"
        fontSize={14}
        fontWeight={600}
        fill={palette.slateText}
        style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.03em' }}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 14}
          textAnchor="middle"
          fontSize={11}
          fill={palette.slateMuted}
          style={{ fontFamily: 'Share Tech Mono, monospace' }}
        >
          {sublabel}
        </text>
      )}
    </g>
  )
}

const RowLabel = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <text
    x={x}
    y={y}
    fontSize={10}
    letterSpacing={1.5}
    fill={palette.violet}
    style={{ fontFamily: 'Share Tech Mono, monospace' }}
  >
    {text}
  </text>
)

const ArrowDef = () => (
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill={palette.accent} />
    </marker>
    <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill={palette.strokeStrong} />
    </marker>
  </defs>
)

const DiagramFrame = ({ viewBox, children, style }: { viewBox: string; children: ReactNode; style?: CSSProperties }) => (
  <svg
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    style={{ display: 'block', maxWidth: '100%', height: 'auto', ...style }}
  >
    <ArrowDef />
    {children}
  </svg>
)

// =====================================================================
// AeroVit — Layered Architecture
// =====================================================================
const AeroVitArchitecture = () => {
  const rowH = 78
  const rowGap = 26
  const padX = 40
  const width = 1200
  const labelCol = 130

  const rows = [
    {
      label: 'CLIENTS',
      accent: 'blue' as const,
      nodes: [
        { label: 'Smartwatch', sub: 'ESP32-S3' },
        { label: 'Mobile App', sub: 'Flutter · Dart' },
        { label: 'Website', sub: 'aerovit.dev' },
        { label: 'Showcase', sub: 'Next.js · 3D' },
      ],
    },
    {
      label: 'SERVICES',
      accent: 'neutral' as const,
      nodes: [
        { label: 'Workouts', sub: 'reps · form' },
        { label: 'Pairing', sub: 'BLE 5.0' },
        { label: 'Quests / XP', sub: 'Hunter ranks' },
        { label: 'Dungeon RPG', sub: '20 floors · Flame' },
        { label: 'Wallet / Token', sub: 'AERO flows' },
      ],
    },
    {
      label: 'AI / ML',
      accent: 'violet' as const,
      nodes: [
        { label: 'BlazePose', sub: '33 landmarks' },
        { label: 'RAG Coach', sub: 'ChromaDB' },
        { label: 'RL Coach', sub: 'PPO · FSM' },
      ],
    },
    {
      label: 'BACKEND',
      accent: 'emerald' as const,
      nodes: [
        { label: 'Firebase Auth', sub: 'email · OAuth' },
        { label: 'Firestore', sub: 'profiles · quests' },
        { label: 'Cloud Functions', sub: 'withdraw · burn' },
      ],
    },
    {
      label: 'CHAIN',
      accent: 'amber' as const,
      nodes: [
        { label: 'AERO Token', sub: 'ERC-20' },
        { label: 'Ethereum Sepolia', sub: 'testnet' },
      ],
    },
  ]

  const height = rows.length * rowH + (rows.length - 1) * rowGap + 40

  return (
    <DiagramFrame viewBox={`0 0 ${width} ${height}`}>
      {rows.map((row, rIdx) => {
        const y = 20 + rIdx * (rowH + rowGap)
        const available = width - padX * 2 - labelCol
        const gap = 18
        const totalGap = gap * (row.nodes.length - 1)
        const boxW = (available - totalGap) / row.nodes.length

        return (
          <g key={rIdx}>
            <RowLabel x={padX} y={y + rowH / 2 + 3} text={`> ${row.label}`} />
            {row.nodes.map((n, i) => (
              <DiagramNode
                key={i}
                x={padX + labelCol + i * (boxW + gap)}
                y={y}
                w={boxW}
                h={rowH}
                label={n.label}
                sublabel={n.sub}
                accent={row.accent}
              />
            ))}
            {rIdx < rows.length - 1 && (
              <line
                x1={width / 2}
                x2={width / 2}
                y1={y + rowH + 2}
                y2={y + rowH + rowGap - 2}
                stroke={palette.strokeStrong}
                strokeWidth={1.4}
                strokeDasharray="3 4"
                markerEnd="url(#arrow-muted)"
              />
            )}
          </g>
        )
      })}
    </DiagramFrame>
  )
}

// =====================================================================
// AeroVit — Data & Reward Flow
// =====================================================================
const AeroVitDataFlow = () => {
  const width = 1200
  const height = 560

  const watchX = 40, watchY = 60, watchW = 240, watchH = 150
  const bleX = 320, bleY = 115, bleW = 110, bleH = 40
  const appX = 470, appY = 40, appW = 280, appH = 190
  const cameraX = 470, cameraY = 270, cameraW = 280, cameraH = 90
  const aiX = 790, aiY = 110, aiW = 170, aiH = 120
  const cloudX = 990, cloudY = 40, cloudW = 170, cloudH = 110
  const chainX = 990, chainY = 180, chainW = 170, chainH = 80
  const ledgerX = 790, ledgerY = 270, ledgerW = 170, ledgerH = 90

  const dungeonX = 40, dungeonY = 380, dungeonW = 220, dungeonH = 90
  const questX = 300, questY = 380, questW = 220, questH = 90
  const userX = 560, userY = 380, userW = 220, userH = 90
  const rewardsX = 820, rewardsY = 380, rewardsW = 340, rewardsH = 90

  const line = (x1: number, y1: number, x2: number, y2: number, color = palette.accent, dashed = false, label?: string) => (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1.6}
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd="url(#arrow)"
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 6}
          fontSize={10}
          fill={palette.slateMuted}
          textAnchor="middle"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {label}
        </text>
      )}
    </g>
  )

  return (
    <DiagramFrame viewBox={`0 0 ${width} ${height}`}>
      <DiagramNode x={watchX} y={watchY} w={watchW} h={watchH} label="AeroVit Watch" sublabel="HR · SpO2 · IMU · Steps" accent="blue" />
      <DiagramNode x={bleX} y={bleY} w={bleW} h={bleH} label="BLE packet" sublabel="28 bytes" accent="neutral" variant="dashed" />
      <DiagramNode x={appX} y={appY} w={appW} h={appH} label="Flutter App" sublabel="sessions · UI · state" accent="blue" />
      <DiagramNode x={cameraX} y={cameraY} w={cameraW} h={cameraH} label="Camera · Pose Pipeline" sublabel="smoothing · angles · reps" accent="violet" />
      <DiagramNode x={aiX} y={aiY} w={aiW} h={aiH} label="AI Coach" sublabel="RAG + RL adaptation" accent="violet" />
      <DiagramNode x={cloudX} y={cloudY} w={cloudW} h={cloudH} label="Firebase + CF" sublabel="auth · data · functions" accent="emerald" />
      <DiagramNode x={chainX} y={chainY} w={chainW} h={chainH} label="Sepolia chain" sublabel="AERO ERC-20" accent="amber" />
      <DiagramNode x={ledgerX} y={ledgerY} w={ledgerW} h={ledgerH} label="Reward Ledger" sublabel="off-chain balance" accent="emerald" />

      <DiagramNode x={dungeonX} y={dungeonY} w={dungeonW} h={dungeonH} label="Dungeon RPG" sublabel="floors · enemies · loot" accent="neutral" />
      <DiagramNode x={questX} y={questY} w={questW} h={questH} label="Quests / XP" sublabel="daily · streaks · ranks" accent="neutral" />
      <DiagramNode x={userX} y={userY} w={userW} h={userH} label="User Profile" sublabel="rank · trophies · friends" accent="neutral" />
      <DiagramNode x={rewardsX} y={rewardsY} w={rewardsW} h={rewardsH} label="Withdrawal Flow" sublabel="≥ 100 AERO · 24h cooldown · 5% burn" accent="amber" />

      {line(watchX + watchW, watchY + 70, bleX, bleY + 20)}
      {line(bleX + bleW, bleY + 20, appX, appY + 40, palette.accent, false, 'stream')}
      {line(cameraX + cameraW / 2, cameraY, appX + appW / 2, appY + appH)}
      {line(appX + appW, appY + 90, aiX, aiY + 60, palette.accent, false, 'signals')}
      {line(aiX + aiW / 2, aiY, cloudX + cloudW / 2, cloudY + cloudH, palette.strokeStrong, true)}
      {line(aiX + aiW / 2, aiY + aiH, ledgerX + ledgerW / 2, ledgerY, palette.strokeStrong, true, 'score')}
      {line(ledgerX + ledgerW, ledgerY + 45, chainX, chainY + chainH - 20, palette.amber, false, 'withdraw')}
      {line(chainX + chainW / 2, chainY + chainH, rewardsX + rewardsW / 2 + 90, rewardsY, palette.amber, true, 'AERO → wallet')}

      {line(appX + 70, appY + appH, questX + 120, questY, palette.strokeStrong, true)}
      {line(appX + 180, appY + appH, dungeonX + 180, dungeonY, palette.strokeStrong, true)}
      {line(appX + appW - 40, appY + appH + 10, userX + 80, userY, palette.strokeStrong, true)}
    </DiagramFrame>
  )
}

// =====================================================================
// EMG Controller — Signal Pipeline
// =====================================================================
const EmgPipeline = () => {
  const width = 1200
  const height = 420

  const node = (x: number, y: number, w: number, h: number, label: string, sub?: string, accent: NodeProps['accent'] = 'neutral') => (
    <DiagramNode x={x} y={y} w={w} h={h} label={label} sublabel={sub} accent={accent} />
  )

  const line = (x1: number, y1: number, x2: number, y2: number, dashed = false, color = palette.accent) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={1.6}
      strokeDasharray={dashed ? '5 4' : undefined}
      markerEnd="url(#arrow)"
    />
  )

  return (
    <DiagramFrame viewBox={`0 0 ${width} ${height}`}>
      {/* Acquisition row */}
      <RowLabel x={40} y={40} text="> ACQUISITION" />
      {node(40, 60, 170, 70, 'Muscle', 'forearm · bicep', 'neutral')}
      {node(240, 60, 170, 70, 'Electrodes', '3-lead surface', 'neutral')}
      {node(440, 60, 170, 70, 'EMG Candy', 'front-end amp', 'blue')}
      {node(640, 60, 210, 70, 'ESP32-S3 ADC', '500 Hz · 12-bit', 'blue')}

      {line(210, 95, 240, 95)}
      {line(410, 95, 440, 95)}
      {line(610, 95, 640, 95)}

      {/* DSP row */}
      <RowLabel x={40} y={170} text="> DSP PIPELINE (ON-DEVICE)" />
      {node(40, 190, 200, 70, 'Moving Average', 'noise floor', 'violet')}
      {node(270, 190, 200, 70, 'RMS', '20-sample window', 'violet')}
      {node(500, 190, 200, 70, 'Smoothing', '2-stage low-pass', 'violet')}
      {node(730, 190, 200, 70, 'Envelope', 'peak detector', 'violet')}
      {node(960, 190, 200, 70, 'Adaptive Threshold', 'per-session calibration', 'amber')}

      {line(240, 225, 270, 225)}
      {line(470, 225, 500, 225)}
      {line(700, 225, 730, 225)}
      {line(930, 225, 960, 225)}

      {/* bridge between rows */}
      {line(745, 130, 140, 190, true, palette.strokeStrong)}

      {/* Output row */}
      <RowLabel x={40} y={310} text="> OUTPUTS" />
      {node(40, 330, 240, 70, 'Serial UART', '115200 baud', 'blue')}
      {node(320, 330, 220, 70, 'Python GUI', 'matplotlib · NumPy', 'emerald')}
      {node(580, 330, 220, 70, 'Serial Plotter', 'Arduino IDE', 'emerald')}
      {node(840, 330, 320, 70, 'Game Controller', 'pynput → Roblox', 'emerald')}

      {line(1060, 260, 160, 330, true, palette.strokeStrong)}
      {line(280, 365, 320, 365)}
      {line(540, 365, 580, 365)}
      {line(800, 365, 840, 365)}
    </DiagramFrame>
  )
}

// =====================================================================
// Fehuvia — Dual-State Treasury Architecture
// =====================================================================
const FehuviaArchitecture = () => {
  const rowH = 78
  const rowGap = 26
  const padX = 40
  const width = 1200
  const labelCol = 130

  const rows = [
    {
      label: 'WORKSTATION',
      accent: 'blue' as const,
      nodes: [
        { label: 'Workstation UI', sub: 'React 19 · glassmorphic' },
        { label: 'AI OCR Scan', sub: 'PDF / Image grid parsing' },
        { label: 'MetaMask Signing', sub: 'EIP-1193 zero-custody' },
      ],
    },
    {
      label: 'API BACKEND',
      accent: 'neutral' as const,
      nodes: [
        { label: 'Express.js Server', sub: 'API broker & faucet route' },
        { label: 'Gas Dispenser', sub: 'Vault faucet dispenser' },
        { label: 'AI Co-Pilot RAG', sub: 'GPT-4o runway prompt assembly' },
      ],
    },
    {
      label: 'PERSISTENCE',
      accent: 'emerald' as const,
      nodes: [
        { label: 'PostgreSQL DB', sub: 'suppliers · users' },
        { label: 'Invoice Ledger', sub: 'ACID transactional directory' },
      ],
    },
    {
      label: 'EVM LEDGER',
      accent: 'amber' as const,
      nodes: [
        { label: 'B2BSettlement.sol', sub: 'atomic transfer pattern' },
        { label: 'MockUSDC.sol', sub: '6-decimal stablecoin' },
        { label: 'Morph Layer 2', sub: 'sub-2 second L2 blocks' },
      ],
    },
    {
      label: 'DAEMON SYNC',
      accent: 'violet' as const,
      nodes: [
        { label: 'Listener Daemon', sub: 'JSON-RPC EVM event stream' },
        { label: 'Log Reconciliation', sub: 'T+0 dual-state sync' },
      ],
    },
  ]

  const height = rows.length * rowH + (rows.length - 1) * rowGap + 40

  return (
    <DiagramFrame viewBox={`0 0 ${width} ${height}`}>
      {rows.map((row, rIdx) => {
        const y = 20 + rIdx * (rowH + rowGap)
        const available = width - padX * 2 - labelCol
        const gap = 18
        const totalGap = gap * (row.nodes.length - 1)
        const boxW = (available - totalGap) / row.nodes.length

        return (
          <g key={rIdx}>
            <RowLabel x={padX} y={y + rowH / 2 + 3} text={`> ${row.label}`} />
            {row.nodes.map((n, i) => (
              <DiagramNode
                key={i}
                x={padX + labelCol + i * (boxW + gap)}
                y={y}
                w={boxW}
                h={rowH}
                label={n.label}
                sublabel={n.sub}
                accent={row.accent}
              />
            ))}
            {rIdx < rows.length - 1 && (
              <line
                x1={width / 2}
                x2={width / 2}
                y1={y + rowH + 2}
                y2={y + rowH + rowGap - 2}
                stroke={palette.strokeStrong}
                strokeWidth={1.4}
                strokeDasharray="3 4"
                markerEnd="url(#arrow-muted)"
              />
            )}
          </g>
        )
      })}
    </DiagramFrame>
  )
}

// =====================================================================
// StickOut — System Architecture
// =====================================================================
const StickOutArchitecture = () => {
  const rowH = 78
  const rowGap = 26
  const padX = 40
  const width = 1200
  const labelCol = 130

  const rows = [
    {
      label: 'APPLICATION ENTRY',
      accent: 'blue' as const,
      nodes: [
        { label: 'Vite / React Application', sub: 'React 19 Frontend SPA' },
      ],
    },
    {
      label: 'STATE ENGINE',
      accent: 'violet' as const,
      nodes: [
        { label: 'App.jsx Coordinator', sub: 'Central state manager' },
      ],
    },
    {
      label: 'VIEWPORTS & UI',
      accent: 'emerald' as const,
      nodes: [
        { label: 'CanvasArea Component', sub: 'HTML5 Canvas 2D View' },
        { label: 'Sidebar Panels', sub: 'Layers panel & Properties panel' },
        { label: 'Toolbar & MenuBar', sub: 'Cursor tools, swatches & File commands' },
      ],
    },
    {
      label: 'CORES & STACKS',
      accent: 'amber' as const,
      nodes: [
        { label: 'helpers.js Math Utilities', sub: 'Coordinates snap, bridges & scale' },
        { label: 'Undo / Redo stack', sub: '50-level state history' },
        { label: 'Auto-save system', sub: 'LocalStorage stk serialization' },
      ],
    },
  ]

  const height = rows.length * rowH + (rows.length - 1) * rowGap + 40

  return (
    <DiagramFrame viewBox={`0 0 ${width} ${height}`}>
      {rows.map((row, rIdx) => {
        const y = 20 + rIdx * (rowH + rowGap)
        const available = width - padX * 2 - labelCol
        const gap = 18
        const totalGap = gap * (row.nodes.length - 1)
        const boxW = (available - totalGap) / row.nodes.length

        return (
          <g key={rIdx}>
            <RowLabel x={padX} y={y + rowH / 2 + 3} text={`> ${row.label}`} />
            {row.nodes.map((n, i) => (
              <DiagramNode
                key={i}
                x={padX + labelCol + i * (boxW + gap)}
                y={y}
                w={boxW}
                h={rowH}
                label={n.label}
                sublabel={n.sub}
                accent={row.accent}
              />
            ))}
            {rIdx < rows.length - 1 && (
              <line
                x1={width / 2}
                x2={width / 2}
                y1={y + rowH + 2}
                y2={y + rowH + rowGap - 2}
                stroke={palette.strokeStrong}
                strokeWidth={1.4}
                strokeDasharray="3 4"
                markerEnd="url(#arrow-muted)"
              />
            )}
          </g>
        )
      })}
    </DiagramFrame>
  )
}

// =====================================================================
// Registry + public component
// =====================================================================
const registry: Record<string, () => JSX.Element> = {
  'aerovit-architecture': AeroVitArchitecture,
  'aerovit-dataflow': AeroVitDataFlow,
  'emg-pipeline': EmgPipeline,
  'fehuvia-architecture': FehuviaArchitecture,
  'stickout-architecture': StickOutArchitecture,
}

const ZOOM_MIN = 0.25
const ZOOM_MAX = 3
const ZOOM_STEP = 0.25
const LIGHTBOX_PAD = 40

type FitLayout = { vbW: number; vbH: number; fit: number }

export const ProjectDiagram = ({ id, caption }: { id: string; caption?: string }) => {
  const Component = registry[id]
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  /** Multiplier on top of viewport “fit” scale (1 = fit to window). */
  const [zoom, setZoom] = useState(1)
  const [fitLayout, setFitLayout] = useState<FitLayout | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, lightboxOpen)

  const openLightbox = () => {
    setLightboxOpen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    })
  }

  const closeLightbox = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setLightboxOpen(false)
    }, 200)
  }

  useEffect(() => {
    if (!lightboxOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) {
      setZoom(1)
      setFitLayout(null)
    }
  }, [lightboxOpen])

  const recalcFit = useCallback(() => {
    const vp = viewportRef.current
    if (!vp || !lightboxOpen) return
    const svg = vp.querySelector('svg')
    if (!svg?.viewBox?.baseVal) return
    const vbW = svg.viewBox.baseVal.width
    const vbH = svg.viewBox.baseVal.height
    if (vbW <= 0 || vbH <= 0) return
    const vw = vp.clientWidth - LIGHTBOX_PAD
    const vh = vp.clientHeight - LIGHTBOX_PAD
    if (vw <= 0 || vh <= 0) return
    const fit = Math.min(vw / vbW, vh / vbH)
    setFitLayout({ vbW, vbH, fit })
  }, [lightboxOpen])

  useLayoutEffect(() => {
    if (!lightboxOpen) return
    recalcFit()
    const rafId = requestAnimationFrame(() => recalcFit())
    return () => cancelAnimationFrame(rafId)
  }, [lightboxOpen, id, recalcFit])

  useLayoutEffect(() => {
    if (!lightboxOpen) return
    const vp = viewportRef.current
    if (!vp) return
    const ro = new ResizeObserver(() => recalcFit())
    ro.observe(vp)
    window.addEventListener('orientationchange', recalcFit)
    window.addEventListener('resize', recalcFit)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', recalcFit)
      window.removeEventListener('resize', recalcFit)
    }
  }, [lightboxOpen, recalcFit])

  if (!Component) {
    return (
      <div className="rounded-none border border-dashed border-cyber-magenta/30 bg-cyber-magenta/5 p-6 text-center font-terminal text-xs text-cyber-magenta">
        Diagram `{id}` not found.
      </div>
    )
  }

  const nudgeZoom = (delta: number) => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) * 100) / 100)))
  }

  const effectiveScale = fitLayout ? fitLayout.fit * zoom : 1

  return (
    <figure className="space-y-3">
      <div className="relative overflow-hidden rounded-none border border-cyber-cyan/35 bg-cyber-dark/45 hover:border-cyber-yellow transition-all duration-300">
        <button
          type="button"
          onClick={openLightbox}
          className="group relative block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-cyber-yellow/40"
          aria-label="Open diagram larger"
        >
          <span className="absolute right-2 top-2 z-10 rounded-none border border-cyber-cyan/30 bg-black/80 px-2 py-1 font-terminal text-[10px] text-cyber-cyan opacity-90 backdrop-blur-sm transition group-hover:border-cyber-yellow group-hover:text-cyber-yellow">
            Tap to enlarge
          </span>
          <div className="overflow-x-auto p-3 sm:p-4">
            <Component />
          </div>
        </button>
      </div>
      {caption && (
        <figcaption className="text-center font-terminal text-xs leading-relaxed text-cyber-cyan/70 mt-1">{caption}</figcaption>
      )}

      {lightboxOpen && createPortal(
        <div
          className={`fixed inset-0 z-[70] flex flex-col bg-cyber-dark/95 p-3 sm:p-5 transition-opacity duration-200 ease-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Diagram viewer"
          ref={dialogRef}
          tabIndex={-1}
        >
          <button
            type="button"
            className="absolute inset-0 z-0 cursor-default sm:cursor-zoom-out"
            onClick={closeLightbox}
            aria-label="Close diagram"
          />
          <div className={`relative z-10 flex flex-col flex-1 min-h-0 w-full transition-all duration-200 ease-out transform ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          } cyber-card cyber-corner-brackets border border-cyber-yellow/45 p-4 sm:p-6 bg-cyber-dark/95`}>
            <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-cyber-yellow/15 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-terminal text-[10px] uppercase tracking-widest text-cyber-cyan">Zoom</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  nudgeZoom(-ZOOM_STEP)
                }}
                disabled={zoom <= ZOOM_MIN}
                className="rounded-none border border-cyber-cyan/35 bg-cyber-cyan/5 px-3 py-1 font-terminal text-sm text-cyber-cyan hover:bg-cyber-cyan/15 hover:border-cyber-yellow hover:text-cyber-yellow disabled:opacity-20 transition-colors duration-200"
                aria-label="Zoom out"
              >
                −
              </button>
              <span className="min-w-[3rem] text-center font-terminal text-xs text-cyber-yellow font-bold" title="100% = fit to viewer">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  nudgeZoom(ZOOM_STEP)
                }}
                disabled={zoom >= ZOOM_MAX}
                className="rounded-none border border-cyber-cyan/35 bg-cyber-cyan/5 px-3 py-1 font-terminal text-sm text-cyber-cyan hover:bg-cyber-cyan/15 hover:border-cyber-yellow hover:text-cyber-yellow disabled:opacity-20 transition-colors duration-200"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setZoom(1)
                }}
                className="rounded-none border border-cyber-cyan/35 bg-cyber-cyan/5 px-2.5 py-1 font-terminal text-[11px] text-cyber-cyan hover:bg-cyber-cyan/15 hover:border-cyber-yellow hover:text-cyber-yellow transition-colors duration-200"
              >
                Reset
              </button>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="rounded-none border border-cyber-cyan/35 p-1.5 text-cyber-cyan hover:text-cyber-yellow hover:bg-cyber-yellow/15 hover:border-cyber-yellow transition-all duration-300"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            ref={viewportRef}
            className="relative z-10 min-h-0 flex-1 overflow-auto rounded-none border border-cyber-cyan/35 bg-black"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                nudgeZoom(e.deltaY > 0 ? -0.08 : 0.08)
              }
            }}
          >
            <div className="flex min-h-full min-w-full items-center justify-center box-border p-5">
              <div
                className="flex-shrink-0"
                style={
                  fitLayout
                    ? {
                        width: fitLayout.vbW * effectiveScale,
                        height: fitLayout.vbH * effectiveScale,
                      }
                    : {
                        width: 'min(96vw, 1400px)',
                        maxWidth: '100%',
                      }
                }
              >
                <div
                  className="rounded-none border border-cyber-cyan/10 bg-black/40 shadow-xl"
                  style={
                    fitLayout
                      ? {
                          width: fitLayout.vbW,
                          height: fitLayout.vbH,
                          transform: `scale(${effectiveScale})`,
                          transformOrigin: 'top left',
                        }
                      : { width: '100%' }
                  }
                >
                  <Component />
                </div>
              </div>
            </div>
          </div>
          {caption && (
            <p className="relative z-10 mt-2 text-center font-terminal text-[11px] text-cyber-cyan/80">
              {caption}
            </p>
          )}
          <p className="relative z-10 mt-1 text-center font-terminal text-[10px] text-cyber-magenta/70 tracking-widest uppercase">
            Default size fits the viewer. Ctrl/⌘ + scroll to zoom · drag to pan when zoomed // ESC TO CLOSE
          </p>
          </div>
        </div>,
        document.body
      )}
    </figure>
  )
}

export default ProjectDiagram
