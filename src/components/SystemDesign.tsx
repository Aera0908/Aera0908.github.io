import { useState } from 'react'
import { ProjectDiagram } from './diagrams/ProjectDiagrams'

interface DesignTab {
  id: string
  label: string
  title: string
  diagramId: string
  description: string
  bullets: string[]
  tags: string[]
}

const designTabs: DesignTab[] = [
  {
    id: 'fehuvia',
    label: 'FEHUVIA WORKSTATION',
    title: 'Dual-State Transaction & Sync Architecture',
    diagramId: 'fehuvia-architecture',
    description: 'A non-custodial open finance treasury workstation that synchronizes low-latency blockchain execution on Morph L2 with an audits-compliant relational persistence layer.',
    bullets: [
      'Zero-Custody Provider Injection: Employs EIP-1193 standard client-side signing, ensuring backend APIs never touch private keys.',
      'Node.js Listener Daemon: Listens to Morph L2 RPC logs, guaranteeing atomic PostgreSQL synchronization and preventing database report lags.',
      'Background Gas pipeline: Self-healing background faucet monitors client wallets and drops gas asynchronously to reduce user friction.'
    ],
    tags: ['Morph L2', 'Solidity', 'Express', 'PostgreSQL', 'MetaMask']
  },
  {
    id: 'aerovit-layered',
    label: 'AEROVIT ECOSYSTEM',
    title: 'Layered Device & Rewards System Topology',
    diagramId: 'aerovit-architecture',
    description: 'A multi-tier hardware and software stack connecting wearable BLE clients, cloud databases, and on-chain ERC-20 rewards pipelines.',
    bullets: [
      'Embedded Client Isolation: Runs custom C++ RTOS firmware on ESP32-S3 to capture IMU and PPG telemetry independently.',
      'Machine Learning Pipeline: Processes 33-landmark MediaPipe BlazePose keypoints on the client app to run rep state machines.',
      'Serverless Token Burn: Orchestrates Firebase Cloud Functions to verify user milestones and execute ERC-20 Sepolia withdraw/burn rules.'
    ],
    tags: ['ESP32-S3', 'MediaPipe', 'Sepolia L1', 'Flutter', 'Firebase']
  },
  {
    id: 'aerovit-data',
    label: 'AEROVIT DATAFLOW',
    title: 'Anti-Cheat & Blockchain Minting Flow',
    diagramId: 'aerovit-dataflow',
    description: 'Telemetry ingestion and minting pipeline showing the off-chain score accumulation and secure cryptographic web3 claims.',
    bullets: [
      'Compact BLE Packets: Packs IMU/PPG metrics into tightly serialized 28-byte packets to prevent Bluetooth buffer choke.',
      'Secure Cooldown Locks: Restricts token claims via a 24-hour smart contract cooling window combined with off-chain cooldown tracking.',
      'Economic Token Sink: Implements a 5% transaction burn rate on Sepolia withdrawals to stabilize rewards economics.'
    ],
    tags: ['BLE 5.0', 'ERC-20', 'Smart Contracts', 'Firestore']
  },
  {
    id: 'emg-dsp',
    label: 'EMG CONTROLLER',
    title: 'Muscle Signal Acquisition & DSP Chain',
    diagramId: 'emg-pipeline',
    description: 'Real-time bio-signal processing chain designed to read muscle contractions via surface electrodes and map them as game inputs.',
    bullets: [
      'PP-Amp Front-End: Amplifies microvolt-level muscle action potentials using a dedicated EMG instrument front-end.',
      'On-Device DSP: Performs Moving Average, RMS calculation, low-pass filtering, and Peak Envelope detection on-device at 500 Hz.',
      'Adaptive Calibration: Calculates threshold levels dynamically per-session to adjust to muscle fatigue and sensor placement.'
    ],
    tags: ['DSP', 'Microcontrollers', 'ADC Filtering', 'Roblox API', 'Python']
  },
  {
    id: 'stickdiagram',
    label: 'STICKDIAGRAM EDA',
    title: 'Model-View-Controller Front-End Flow',
    diagramId: 'stickdiagram-architecture',
    description: 'A client-side Electronic Design Automation (EDA) editor utilizing React 19 to govern layout models and drawing states on a raw HTML5 Canvas 2D infinite workspace.',
    bullets: [
      'Infinite Math Viewport: Maps screen coordinates to world dimensions, allowing zoom scaling (0.1x to 5.0x) and grid pitch snapping.',
      'Auto-Bridging Wire Solver: Intersects orthogonal wires of the same layer to dynamically split horizontal paths and render arc bridges.',
      'GPU Opacity Blending: Utilizes canvas z-indexing and alpha transparency mixing to display overlapping metal, active, and via regions.'
    ],
    tags: ['React 19', 'HTML5 Canvas', 'Vite 8', 'VLSI Design', 'EDA Tooling']
  }
]

const SystemDesign = () => {
  const [activeTab, setActiveTab] = useState('fehuvia')
  const [displayedTab, setDisplayedTab] = useState('fehuvia')
  const [isFading, setIsFading] = useState(false)

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab || isFading) return
    setActiveTab(tabId)
    setIsFading(true)
    setTimeout(() => {
      setDisplayedTab(tabId)
      setIsFading(false)
    }, 200)
  }

  const current = designTabs.find((t) => t.id === displayedTab) || designTabs[0]

  return (
    <section id="designs" className="w-full min-w-0 max-w-full scroll-mt-24 py-16">
      <p className="mb-4 font-terminal text-sm text-cyber-magenta tracking-widest">&gt; SYSTEM.DESIGN // TOPOLOGY</p>
      <h2 className="mb-2 text-2xl font-bold text-slate-50 md:text-3xl tracking-wide cyber-glitch">Architectural Showcases</h2>
      <p className="mb-10 max-w-full text-sm leading-relaxed text-slate-400 sm:max-w-2xl">
        Explore interactive system designs of my key platforms, highlighting end-to-end hardware interfaces, Web3 sync daemons, and signal pipelines.
      </p>

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-cyber-yellow/20 pb-4">
        {designTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={`px-4 py-2 font-terminal text-[10px] sm:text-xs tracking-wider rounded-none border transition-all duration-200 ${
              activeTab === t.id
                ? 'bg-cyber-yellow/10 border-cyber-yellow text-cyber-yellow font-bold glow-cyber-yellow/15'
                : 'bg-cyber-dark/40 border-cyber-cyan/35 text-cyber-cyan/70 hover:text-cyber-cyan hover:border-cyber-cyan/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Layout (Vertical Stack) */}
      <div className={`space-y-6 transition-all duration-200 ease-in-out ${isFading ? 'opacity-0 scale-[0.995]' : 'opacity-100 scale-100'}`}>
        {/* Diagram Area (Above, Full Width) */}
        <div className="cyber-card cyber-corner-brackets p-4 sm:p-6 w-full">
          <div className="flex justify-between items-center mb-3">
            <span className="font-terminal text-[10px] text-cyber-magenta tracking-widest">&gt; INTERACTIVE DIAGRAM</span>
            <span className="font-terminal text-[10px] text-cyber-yellow animate-pulse font-bold">Zoomable</span>
          </div>
          <div className="w-full overflow-hidden">
            <ProjectDiagram id={current.diagramId} />
          </div>
        </div>

        {/* Technical Explainer Area (Below, Full Width) */}
        <div className="cyber-card cyber-corner-brackets p-5 sm:p-8 w-full">
          <span className="bg-cyber-magenta/15 border border-cyber-magenta/35 px-2.5 py-1 font-terminal text-[10px] uppercase tracking-wider text-cyber-magenta font-bold rounded-none">
            ARCHITECTURE OVERVIEW
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-4 leading-snug font-cyber tracking-wide">
            {current.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-400 mt-3 mb-6">
            {current.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-cyber-yellow/20 pt-6">
            <div className="md:col-span-3 space-y-4 font-terminal">
              <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest">&gt; TECHNICAL BULLETS</p>
              <ul className="space-y-3 font-sans">
                {current.bullets.map((bullet, idx) => {
                  const [boldText, normalText] = bullet.split(': ')
                  return (
                    <li key={idx} className="flex gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <span className="text-cyber-cyan font-terminal font-extrabold mt-0.5">&gt;</span>
                      <div>
                        {normalText ? (
                          <>
                            <strong className="text-cyber-cyan font-bold font-cyber tracking-wide">{boldText}:</strong> {normalText}
                          </>
                        ) : (
                          bullet
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="md:col-span-1 space-y-4 md:border-l md:border-cyber-yellow/20 md:pl-6">
              <p className="font-terminal text-[10px] text-cyber-cyan tracking-widest mb-2.5">&gt; KEY ENABLERS</p>
              <div className="flex flex-wrap gap-1.5">
                {current.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[10px] text-cyber-cyan font-terminal bg-cyber-cyan/5 border border-cyber-cyan/25 hover:border-cyber-yellow/45 hover:text-cyber-yellow rounded-none transition-all duration-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SystemDesign
