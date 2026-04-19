import type { CSSProperties, ReactNode } from 'react'

const palette = {
  stroke: '#334155',
  strokeStrong: '#475569',
  accent: '#3b82f6',
  accentSoft: 'rgba(59, 130, 246, 0.12)',
  emerald: '#10b981',
  emeraldSoft: 'rgba(16, 185, 129, 0.12)',
  amber: '#f59e0b',
  amberSoft: 'rgba(245, 158, 11, 0.12)',
  violet: '#a855f7',
  violetSoft: 'rgba(168, 85, 247, 0.14)',
  slateText: '#e2e8f0',
  slateMuted: '#94a3b8',
  neutralFill: 'rgba(255, 255, 255, 0.03)',
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
        rx={10}
        ry={10}
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
        style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
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
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
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
    fill={palette.slateMuted}
    style={{ fontFamily: 'JetBrains Mono, monospace' }}
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
// Registry + public component
// =====================================================================
const registry: Record<string, () => JSX.Element> = {
  'aerovit-architecture': AeroVitArchitecture,
  'aerovit-dataflow': AeroVitDataFlow,
  'emg-pipeline': EmgPipeline,
}

export const ProjectDiagram = ({ id, caption }: { id: string; caption?: string }) => {
  const Component = registry[id]
  if (!Component) {
    return (
      <div className="rounded-lg border border-dashed border-white/10 bg-white/5 p-6 text-center font-mono text-xs text-slate-500">
        Diagram `{id}` not found.
      </div>
    )
  }
  return (
    <figure className="space-y-3">
      <div className="rounded-lg bg-black/30 border border-white/5 p-4 overflow-x-auto">
        <Component />
      </div>
      {caption && (
        <figcaption className="text-slate-400 text-xs leading-relaxed font-mono text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default ProjectDiagram
