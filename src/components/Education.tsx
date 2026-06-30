const Education = () => {
  const academicFocus = [
    { area: 'Agentic Engineering', level: 40, status: 'INTERMEDIATE', color: 'text-cyber-magenta border-cyber-magenta/30' },
    { area: 'Frontend Development', level: 40, status: 'INTERMEDIATE', color: 'text-cyber-cyan border-cyber-cyan/35' },
    { area: 'Computer Architecture', level: 30, status: 'BEGINNER', color: 'text-cyber-yellow border-cyber-yellow/30' },
    { area: 'Embedded Prototyping', level: 40, status: 'INTERMEDIATE', color: 'text-cyber-green border-cyber-green/35' }
  ]

  return (
    <section id="edu" className="py-16 scroll-mt-24">
      <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; EDUCATION.SYS // DIAGNOSTIC_RUN</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8 tracking-wide cyber-glitch">Education</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        {/* Academic Institution Card */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="cyber-card cyber-corner-brackets flex-1 p-6 border border-cyber-cyan/30 bg-cyber-dark/85 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4 border-b border-cyber-yellow/10 pb-3">
                <span className="w-2.5 h-2.5 bg-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.7)] rounded-none shrink-0" />
                <h3 className="text-lg font-bold text-slate-100 font-cyber tracking-wider leading-none">
                  Colegio de Muntinlupa
                </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-terminal text-[10px] text-cyber-cyan/70 tracking-widest uppercase mb-1">DEGREE OBJECTIVE</p>
                  <p className="text-sm font-bold text-cyber-yellow font-cyber tracking-wide">
                    Bachelor of Science in Computer Engineering (Magna Cum Laude)
                  </p>
                </div>

                <div>
                  <p className="font-terminal text-[10px] text-cyber-cyan/70 tracking-widest uppercase mb-1">LOCATION & TIMELINE</p>
                  <p className="text-slate-300 text-xs font-terminal">
                    Muntinlupa, PH · 2022 – 2026 (Expected July 2026)
                  </p>
                </div>
              </div>
            </div>

            {/* Graduation Progress Bar */}
            <div className="border-t border-cyber-yellow/10 pt-4 mt-auto">
              <div className="flex justify-between items-center text-[10px] font-terminal mb-1.5">
                <span className="text-cyber-magenta tracking-widest uppercase">GRADUATION_PROGRESS</span>
                <span className="text-cyber-yellow font-bold">95%</span>
              </div>
              
              <div className="w-full h-3 bg-black/60 border border-cyber-cyan/35 rounded-none p-[1.5px] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-yellow transition-all duration-1000 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  style={{ width: '95%' }}
                />
              </div>
              <p className="font-terminal text-[9px] text-slate-400 mt-2 text-right uppercase tracking-wider">
                Status: Final Academic Year
              </p>
            </div>
          </div>
        </div>

        {/* Academic Diagnostics Panel */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="cyber-card cyber-corner-brackets flex-1 p-6 border border-cyber-magenta/30 bg-cyber-dark/85 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-cyber-yellow/10 pb-3 mb-4">
                <span className="font-terminal text-[10px] text-cyber-magenta tracking-widest">
                  &gt; ACADEMIC_CORE // SKILLS_MATRIX
                </span>
                <span className="font-terminal text-[10px] text-cyber-green font-bold animate-pulse">
                  SYSTEM ACTIVE
                </span>
              </div>

              {/* Coursework Diagnostic Readout */}
              <div className="space-y-4 font-terminal">
                {academicFocus.map((f, i) => (
                  <div key={i} className="flex flex-col gap-1 border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">{f.area}</span>
                      <span className={`text-[10px] border px-1.5 py-0.2 uppercase font-bold shrink-0 ${f.color}`}>
                        {f.status}
                      </span>
                    </div>
                    
                    {/* Visual bar */}
                    <div className="flex gap-[2px] h-1 w-full mt-1 bg-black/40">
                      {Array.from({ length: 10 }).map((_, idx) => {
                        const blockActive = idx < Math.round(f.level / 10)
                        return (
                          <div 
                            key={idx}
                            className={`flex-1 h-full ${
                              blockActive 
                                ? f.color.includes('cyan') 
                                  ? 'bg-cyber-cyan shadow-[0_0_4px_rgba(0,240,255,0.4)]'
                                  : f.color.includes('yellow')
                                  ? 'bg-cyber-yellow shadow-[0_0_4px_rgba(252,238,10,0.4)]'
                                  : f.color.includes('green')
                                  ? 'bg-cyber-green shadow-[0_0_4px_rgba(0,255,102,0.4)]'
                                  : 'bg-cyber-magenta shadow-[0_0_4px_rgba(255,0,85,0.4)]'
                                : 'bg-transparent'
                            }`}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Console - Bottom Grid */}
      <div className="cyber-card cyber-corner-brackets p-6 border border-cyber-yellow/20 bg-cyber-dark/60">
        <div className="flex items-center gap-2 mb-4 border-b border-cyber-yellow/10 pb-3">
          <svg className="w-4 h-4 text-cyber-yellow shrink-0 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-sm font-bold text-slate-100 font-cyber tracking-wider">
            Diagnostics: Focus &amp; Status
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-terminal">
          <div className="space-y-1.5">
            <p className="text-cyber-cyan/70 text-[10px] tracking-widest uppercase">&gt; SPECIALIZATION_FOCUS</p>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Software planning, full-stack modular architecture, digital logic design, and applied AI systems.
            </p>
          </div>
          
          <div className="space-y-1.5 border-t border-slate-900 pt-4 md:border-t-0 md:pt-0 md:border-l md:border-slate-800 md:pl-6">
            <p className="text-cyber-cyan/70 text-[10px] tracking-widest uppercase">&gt; ONGOING_RESEARCH</p>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Decentralized Web3 protocols, Sepolia smart contracts, and micro-interaction UX frameworks.
            </p>
          </div>
          
          <div className="space-y-1.5 border-t border-slate-900 pt-4 md:border-t-0 md:pt-0 md:border-l md:border-slate-800 md:pl-6">
            <p className="text-cyber-cyan/70 text-[10px] tracking-widest uppercase">&gt; DEPLOYMENT_STATUS</p>
            <p className="text-cyber-green font-bold uppercase tracking-wider animate-pulse text-xs leading-snug">
              Open for full-stack engineering, system architecture, &amp; hardware-firmware interface roles
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
