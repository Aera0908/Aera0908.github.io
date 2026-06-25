import { useState } from 'react'

interface StackLayer {
  id: string
  level: string
  title: string
  shortDesc: string
  longDesc: string
  tools: string[]
  achievements: string[]
  color: 'cyan' | 'magenta' | 'yellow' | 'green' | 'amber'
}

const stackLayers: StackLayer[] = [
  {
    id: 'l4',
    level: 'L4',
    title: 'Application & AI Integration',
    shortDesc: 'Interactive frontends, AI orchestration, and multi-platform client applications.',
    longDesc: 'Focuses on designing high-fidelity user experiences, client-side state management, and real-time AI computer vision/LLM integrations. Connects frontend clients to distributed networks and edge devices.',
    tools: ['React 19', 'Next.js', 'Flutter', 'Dart', 'MediaPipe BlazePose', 'ChromaDB', 'OpenAI API', 'Three.js', 'GSAP'],
    achievements: [
      'Developed AeroVit\'s Flutter mobile interface with integrated 33-landmark real-time pose tracking.',
      'Designed and coded Flame 2D turn-based dungeon RPG with complex state machine progressions.',
      'Built responsive, high-performance dashboards with offline caching and local notifications.'
    ],
    color: 'magenta',
  },
  {
    id: 'l3',
    level: 'L3',
    title: 'Web3 & Backend Infrastructure',
    shortDesc: 'Secure smart contract protocols, low-latency sync daemons, and database design.',
    longDesc: 'Covers decentralized ledger logic, RPC event-listening daemons, and secure backend microservices that synchronize off-chain operations with on-chain states.',
    tools: ['Solidity', 'Morph L2', 'Sepolia L1', 'Node.js', 'Express', 'PostgreSQL', 'Firebase Functions', 'MetaMask', 'EIP-1193'],
    achievements: [
      'Architected Fehuvia\'s B2BSettlement.sol transaction protocol, delivering sub-2s clearing on Morph L2.',
      'Developed an Express.js RPC log-listener daemon for atomic PostgreSQL state synchronization.',
      'Created a self-healing background gas faucet to automate MetaMask wallet onboarding.'
    ],
    color: 'cyan',
  },
  {
    id: 'l2',
    level: 'L2',
    title: 'Edge Systems & Firmware',
    shortDesc: 'Low-level microcontroller firmware, sensor packet telemetry, and RTOS threads.',
    longDesc: 'Spans hardware-software boundary layers, focusing on deterministic real-time tasks, power management, and serial communication protocols.',
    tools: ['C / C++', 'ESP32-S3', 'FreeRTOS', 'BLE 5.0', 'SPI', 'I2C', 'UART', 'ADC Filtering'],
    achievements: [
      'Wrote custom C++ FreeRTOS firmware for AeroVit smartwatch to stream heart rate (PPG) and IMU metrics.',
      'Optimized BLE packet structures to fit in compact 28-byte frames, avoiding buffer saturation.',
      'Programmed ADC reading filters with custom moving-average smoothing for clean muscle signal input.'
    ],
    color: 'yellow',
  },
  {
    id: 'l1',
    level: 'L1',
    title: 'Silicon RTL & Logic Design',
    shortDesc: 'RTL circuit design, functional verification, and digital bus architectures.',
    longDesc: 'Dives into the register transfer level (RTL) of digital systems, bus architectures, and hardware verification testbenches.',
    tools: ['SystemVerilog', 'Verilog', 'AMBA APB3 Protocol', 'ModelSim', 'Digital Logic Design', 'FPGA Prototyping'],
    achievements: [
      'Designed and functionally verified an AMBA APB3 peripheral bus bridge in SystemVerilog during IC design internship.',
      'Constructed modular testbenches with self-checking assertions to achieve 100% code coverage.',
      'Simulated digital designs and verified gate delays under varying clock constraints.'
    ],
    color: 'amber',
  }
]

const colorConfig = {
  cyan: {
    text: 'text-cyber-cyan',
    border: 'border-cyber-cyan/30',
    borderActive: 'border-cyber-cyan',
    bg: 'bg-cyber-cyan/5',
    bgActive: 'bg-cyber-cyan/15',
    badge: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/25',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    hover: 'hover:border-cyber-cyan/60 hover:bg-cyber-cyan/5',
  },
  magenta: {
    text: 'text-cyber-magenta',
    border: 'border-cyber-magenta/30',
    borderActive: 'border-cyber-magenta',
    bg: 'bg-cyber-magenta/5',
    bgActive: 'bg-cyber-magenta/15',
    badge: 'bg-cyber-magenta/10 text-cyber-magenta border-cyber-magenta/25',
    glow: 'shadow-[0_0_15px_rgba(255,0,85,0.2)]',
    hover: 'hover:border-cyber-magenta/60 hover:bg-cyber-magenta/5',
  },
  yellow: {
    text: 'text-cyber-yellow',
    border: 'border-cyber-yellow/30',
    borderActive: 'border-cyber-yellow',
    bg: 'bg-cyber-yellow/5',
    bgActive: 'bg-cyber-yellow/15',
    badge: 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/25',
    glow: 'shadow-[0_0_15px_rgba(252,238,10,0.2)]',
    hover: 'hover:border-cyber-yellow/60 hover:bg-cyber-yellow/5',
  },
  green: {
    text: 'text-cyber-green',
    border: 'border-cyber-green/30',
    borderActive: 'border-cyber-green',
    bg: 'bg-cyber-green/5',
    bgActive: 'bg-cyber-green/15',
    badge: 'bg-cyber-green/10 text-cyber-green border-cyber-green/25',
    glow: 'shadow-[0_0_15px_rgba(0,255,102,0.2)]',
    hover: 'hover:border-cyber-green/60 hover:bg-cyber-green/5',
  },
  amber: {
    text: 'text-amber-500',
    border: 'border-amber-500/30',
    borderActive: 'border-amber-500',
    bg: 'bg-amber-500/5',
    bgActive: 'bg-amber-500/15',
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    hover: 'hover:border-amber-500/60 hover:bg-amber-500/5',
  }
}

export const VerticalEngineeringStack = () => {
  const [activeId, setActiveId] = useState('l4')

  const activeLayer = stackLayers.find(l => l.id === activeId) || stackLayers[0]
  const activeCfg = colorConfig[activeLayer.color]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-w-0 max-w-full">
      {/* Stack Visual Selector */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-2.5">
          <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-1">
            &gt; SELECT_LAYER.LOG // ACTIVE
          </p>
          <div className="flex flex-col gap-3">
            {stackLayers.map((layer) => {
              const isActive = layer.id === activeId
              const cfg = colorConfig[layer.color]
              
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveId(layer.id)}
                  className={`w-full text-left p-3.5 border transition-all duration-300 relative group cursor-pointer ${
                    isActive 
                      ? `${cfg.borderActive} ${cfg.bgActive} ${cfg.glow}` 
                      : `border-slate-800 bg-cyber-dark/45 ${cfg.hover}`
                  }`}
                  aria-pressed={isActive}
                >
                  {/* Left indicator bar */}
                  <div className={`absolute top-0 bottom-0 left-0 w-[3px] transition-transform duration-300 ${
                    isActive ? `bg-current ${cfg.text}` : 'bg-transparent'
                  }`} />
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`font-terminal text-sm font-bold px-2 py-0.5 border ${
                        isActive ? cfg.badge : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {layer.level}
                      </span>
                      <h4 className={`text-sm font-bold tracking-wide font-cyber transition-colors ${
                        isActive ? cfg.text : 'text-slate-300 group-hover:text-slate-100'
                      }`}>
                        {layer.title}
                      </h4>
                    </div>
                    
                    <span className={`font-terminal text-[10px] uppercase transition-opacity ${
                      isActive ? 'opacity-100 animate-pulse text-cyber-yellow' : 'opacity-0 group-hover:opacity-40 text-slate-400'
                    }`}>
                      {isActive ? 'Active' : 'Select'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Diagnostics / Details Panel */}
      <div className="lg:col-span-7 flex flex-col">
        <div className={`flex-1 cyber-card cyber-corner-brackets p-6 border transition-all duration-300 flex flex-col justify-between ${activeCfg.borderActive} ${activeCfg.bg}`}>
          {/* Header Panel */}
          <div>
            <div className="flex items-center justify-between border-b border-cyber-yellow/10 pb-3.5 mb-4">
              <span className="font-terminal text-[10px] text-cyber-magenta tracking-widest">
                &gt; CORE_COMPETENCY // DIAGNOSTICS
              </span>
              <span className={`font-terminal text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${activeCfg.badge}`}>
                {activeLayer.level} LAYER
              </span>
            </div>

            <h3 className={`text-xl font-bold tracking-wide mb-2 font-cyber ${activeCfg.text}`}>
              {activeLayer.title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              {activeLayer.longDesc}
            </p>

            {/* Achievements List */}
            <div className="space-y-3 mb-6">
              <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest">
                &gt; SELECT_HIGHLIGHTS
              </p>
              <ul className="space-y-2.5">
                {activeLayer.achievements.map((ach, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed items-start">
                    <span className={`font-terminal font-extrabold select-none mt-0.5 ${activeCfg.text}`}>&gt;</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tools / Technologies */}
          <div className="border-t border-cyber-yellow/10 pt-4 mt-auto">
            <p className="font-terminal text-[10px] text-cyber-cyan tracking-widest mb-2.5">
              &gt; TECHNOLOGIES_STACK
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeLayer.tools.map((tool) => (
                <span
                  key={tool}
                  className={`px-2 py-0.5 text-[10px] font-terminal transition-all duration-300 border ${activeCfg.badge}`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
