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
    border: 'border-cyber-yellow/20 hover:border-cyber-yellow/45 hover:shadow-[0_0_15px_rgba(252,238,10,0.15)]',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 18.4V14.15m16.5 0c0-1.24-.813-2.286-1.9-2.607L12 9.75 4.875 11.543a2.625 2.625 0 00-1.9 2.607m16.5 0V7.5a2.25 2.25 0 00-2.25-2.25h-1.5a1 1 0 00-1-1h-4a1 1 0 00-1 1h-1.5A2.25 2.25 0 005.25 7.5v6.65" />
      </svg>
    ),
  },
  project: {
    label: 'PROJECT',
    bg: 'bg-cyber-cyan/10',
    text: 'text-cyber-cyan',
    border: 'border-cyber-cyan/20 hover:border-cyber-cyan/45 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  education: {
    label: 'EDUCATION',
    bg: 'bg-cyber-magenta/10',
    text: 'text-cyber-magenta',
    border: 'border-cyber-magenta/20 hover:border-cyber-magenta/45 hover:shadow-[0_0_15px_rgba(255,0,85,0.15)]',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.9c2.79 0 5.428-.707 7.74-1.909a60.363 60.363 0 00-.49-6.348N8.25 8.25 0 0012 2.25a8.25 8.25 0 00-7.74 7.897zm0 0L12 15l7.74-4.853M1 9l11-4 11 4-11 4L1 9z" />
      </svg>
    ),
  },
}

const Journey = () => {
  const milestones = journeyData as Milestone[]
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'fehuvia-launch': true, // Expanded by default
  })

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section id="journey" className="w-full min-w-0 max-w-full scroll-mt-24 py-16">
      <p className="mb-4 font-terminal text-sm text-cyber-magenta tracking-widest">&gt; CAREER.JOURNEY // FILE_LOG</p>
      <h2 className="mb-2 text-2xl font-bold text-slate-50 md:text-3xl tracking-wide cyber-glitch">Journey &amp; Milestones</h2>
      <p className="mb-12 max-w-full text-sm leading-relaxed text-slate-400 sm:max-w-2xl">
        An interactive timeline tracing my engineering growth, combining hardware PCB bring-ups, Web3 contract deployments, and freelance client systems.
      </p>

      <div className="relative border-l-2 border-cyber-cyan/25 ml-4 md:ml-32 space-y-12 pl-6 sm:pl-8">
        {milestones.map((m) => {
          const config = typeConfig[m.type] || typeConfig.project
          const isExpanded = !!expandedIds[m.id]

          return (
            <div key={m.id} className="relative group/item">
              {/* Timeline dot */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-none bg-cyber-dark border-2 border-cyber-cyan/35 group-hover/item:border-cyber-yellow transition-all duration-300">
                <span className={`flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-none ${config.bg} ${config.text} text-[10px] sm:text-xs`}>
                  {config.icon}
                </span>
              </div>

              {/* Date label for wider viewports */}
              <div className="hidden md:block absolute -left-[160px] top-2.5 w-28 text-right font-terminal text-sm font-semibold text-cyber-cyan/70 group-hover/item:text-cyber-yellow transition-colors">
                {m.year}
              </div>

              {/* Milestone Card */}
              <div className={`cyber-card cyber-corner-brackets flex flex-col p-5 sm:p-6 transition-all duration-300 border ${config.border}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyber-yellow/10 pb-4">
                  <div>
                    {/* Date label for mobile */}
                    <div className="md:hidden font-terminal text-xs font-semibold text-cyber-cyan/70 mb-1">
                      {m.year}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover/item:text-cyber-yellow transition-colors leading-snug">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{m.company}</p>
                  </div>
                  <span className={`inline-flex self-start rounded-none px-2.5 py-0.5 font-terminal text-[9px] uppercase tracking-wider ${config.bg} ${config.text} border border-current/20`}>
                    {config.label}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-300 mt-4">{m.description}</p>

                {/* Collapsible details */}
                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden space-y-4">
                    <div className="border-t border-cyber-yellow/10 pt-4">
                      <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-2.5">&gt; KEY ACHIEVEMENTS</p>
                      <ul className="space-y-2">
                        {m.achievements.map((ach, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <span className="text-cyber-cyan font-terminal font-extrabold mt-0.5">&gt;</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-cyber-yellow/10 pt-4">
                      <p className="font-terminal text-[10px] text-cyber-cyan tracking-widest mb-2">&gt; TECHNOLOGIES</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 text-[10px] text-cyber-cyan font-terminal bg-cyber-cyan/5 border border-cyber-cyan/25 hover:border-cyber-yellow/45 hover:text-cyber-yellow transition-all duration-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expand / Collapse Button */}
                <button
                  onClick={() => toggleExpand(m.id)}
                  className="mt-4 self-center flex items-center gap-1.5 px-3 py-1 rounded-none bg-cyber-dark hover:bg-cyber-yellow/10 border border-cyber-cyan/30 hover:border-cyber-yellow text-[10px] font-terminal uppercase tracking-wider text-cyber-cyan hover:text-cyber-yellow transition-all duration-200"
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? 'Collapse' : 'Expand Details'}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Journey
