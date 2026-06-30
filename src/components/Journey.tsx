import { useState } from 'react'
import journeyData from '../data/journey.json'

interface Milestone {
  id: string
  year: string
  title: string
  company: string
  description: string
  type: string
  achievements: string[]
  tags: string[]
}

const typeConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  work: {
    label: 'EXPERIENCE',
    bg: 'bg-cyber-yellow/10',
    text: 'text-cyber-yellow',
    border: 'border-cyber-yellow/30 hover:border-cyber-yellow/60',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 18.4V14.15m16.5 0c0-1.24-.813-2.286-1.9-2.607L12 9.75 4.875 11.543a2.625 2.625 0 00-1.9 2.607m16.5 0V7.5a2.25 2.25 0 00-2.25-2.25h-1.5a1 1 0 00-1-1h-4a1 1 0 00-1 1h-1.5A2.25 2.25 0 005.25 7.5v6.65" />
      </svg>
    ),
  },
  project: {
    label: 'PROJECT',
    bg: 'bg-cyber-cyan/10',
    text: 'text-cyber-cyan',
    border: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  education: {
    label: 'EDUCATION',
    bg: 'bg-cyber-magenta/10',
    text: 'text-cyber-magenta',
    border: 'border-cyber-magenta/30 hover:border-cyber-magenta/60',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.9c2.79 0 5.428-.707 7.74-1.909a60.363 60.363 0 00-.49-6.348a8.25 8.25 0 0012 2.25a8.25 8.25 0 00-7.74 7.897zm0 0L12 15l7.74-4.853M1 9l11-4 11 4-11 4L1 9z" />
      </svg>
    ),
  },
}

const Journey = () => {
  const milestones = journeyData as Milestone[]
  const [activeId, setActiveId] = useState(milestones[0]?.id || '')

  const current = milestones.find((m) => m.id === activeId) || milestones[0]
  const config = typeConfig[current.type] || typeConfig.project

  return (
    <section id="journey" className="w-full min-w-0 max-w-full scroll-mt-24 py-16">
      <p className="mb-4 font-terminal text-sm text-cyber-magenta tracking-widest">&gt; CAREER.JOURNEY // FILE_LOG</p>
      <h2 className="mb-10 text-2xl font-bold text-slate-50 md:text-3xl tracking-wide cyber-glitch">Journey</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-w-0 max-w-full">
        {/* Left Side: Timeline Navigation Selector */}
        <div className="lg:col-span-5 flex flex-col gap-2 relative pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-[1.5px] before:bg-cyber-cyan/15">
          {milestones.map((m) => {
            const isActive = m.id === activeId
            const typeCfg = typeConfig[m.type] || typeConfig.project

            return (
              <div key={m.id} className="relative w-full">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute left-[-22px] top-4.5 w-3 h-3 rounded-none border-2 bg-cyber-dark z-10 transition-all duration-300 ${
                    isActive ? 'border-cyber-yellow shadow-[0_0_8px_rgba(252,238,10,0.6)]' : 'border-cyber-cyan/35'
                  }`}
                />

                <button
                  onClick={() => setActiveId(m.id)}
                  className={`w-full text-left p-3.5 border transition-all duration-300 relative group cursor-pointer ${
                    isActive
                      ? `${typeCfg.border} bg-cyber-cyan/5 shadow-[0_0_12px_rgba(0,240,255,0.08)]`
                      : 'border-slate-800 bg-cyber-dark/45 hover:border-slate-700 hover:bg-cyber-dark/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`font-terminal text-[10px] font-bold px-1.5 py-0.5 border select-none shrink-0 ${
                          isActive
                            ? `${typeCfg.bg} ${typeCfg.text} border-current/20`
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {m.year}
                      </span>
                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-bold tracking-wide truncate transition-colors ${
                            isActive ? 'text-cyber-yellow' : 'text-slate-300 group-hover:text-slate-100'
                          }`}
                        >
                          {m.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{m.company}</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Right Side: Timeline Details HUD Viewport */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            className={`flex-1 cyber-card cyber-corner-brackets p-6 border transition-all duration-300 flex flex-col justify-between ${config.border} bg-cyber-dark/90`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-cyber-yellow/10 pb-3 mb-4">
                <span className="font-terminal text-[10px] text-cyber-magenta tracking-widest">
                  &gt; EXPERIENCE_DECK // LOGS
                </span>
                <span
                  className={`font-terminal text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border ${config.bg} ${config.text} border-current/25`}
                >
                  {config.label}
                </span>
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <h3 className="text-xl font-bold text-slate-100 font-cyber tracking-wide leading-tight">
                  {current.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-terminal">
                  <span className="text-cyber-cyan font-bold">{current.company}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{current.year}</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">{current.description}</p>

              {/* Achievements */}
              <div className="space-y-3 mb-6">
                <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest">&gt; LOGGED_RESULTS</p>
                <ul className="space-y-2.5">
                  {current.achievements.map((ach, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed items-start">
                      <span className={`font-terminal font-extrabold select-none mt-0.5 ${config.text}`}>&gt;</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technologies tags */}
            <div className="border-t border-cyber-yellow/10 pt-4 mt-auto">
              <p className="font-terminal text-[10px] text-cyber-cyan tracking-widest mb-2.5">&gt; TECHS_USED</p>
              <div className="flex flex-wrap gap-1.5">
                {current.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[10px] text-cyber-cyan font-terminal bg-cyber-cyan/5 border border-cyber-cyan/25 hover:border-cyber-yellow/45 hover:text-cyber-yellow transition-all duration-300"
                  >
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

export default Journey
