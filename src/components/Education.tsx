const Education = () => {
  const educationData = [
    {
      school: 'Colegio de Muntinlupa',
      degree: 'Bachelor of Science in Computer Engineering',
      period: '2022 – 2026 (Expected July 2026)',
      location: 'Muntinlupa City, Metro Manila, Philippines',
      progress: 'Expected Graduation: July 2026',
      highlights: [
        'Digital electronics, circuit design, computer architecture',
        'Hardware assembly, robotics, system simulation',
        'AeroVit — end-to-end prototype (mobile, wearable, AI, Web3)',
        'School Clinic Web Booking System (DB, UI, backend)',
      ],
    },
  ]

  return (
    <section id="edu" className="py-16">
      <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; EDUCATION.SYS // LOG_FILE</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8 tracking-wide cyber-glitch">Education</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {educationData.map((edu, index) => (
          <div key={index} className="cyber-card cyber-corner-brackets">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-cyber-cyan glow-cyber-cyan/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-100 font-cyber tracking-wider">{edu.school}</h3>
            </div>
            <p className="text-cyber-cyan font-bold font-cyber tracking-wide mb-2">{edu.degree}</p>
            <p className="text-slate-400 text-sm mb-4 font-terminal">// Specializing in Logic Design &amp; Firmware</p>
            <div className="w-full h-2 bg-cyber-dark border border-cyber-cyan/35 rounded-none overflow-hidden mb-2 p-[1px]">
              <div 
                className="h-full bg-cyber-yellow"
                style={{ width: edu.progress === 'Completed' ? '100%' : '75%' }}
              />
            </div>
            <p className="font-terminal text-xs text-cyber-cyan/80 mb-4 uppercase tracking-widest">{edu.progress}</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              {edu.highlights.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-cyber-magenta font-extrabold font-terminal shrink-0 select-none">&gt;</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="cyber-card cyber-corner-brackets">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-cyber-yellow shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-100 font-cyber tracking-wider">Current Status</h3>
          </div>
          <div className="space-y-4 text-sm font-terminal">
            <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <span className="text-cyber-cyan/70 shrink-0 font-bold">FOCUS:</span>{' '}
              <span className="text-slate-300 font-sans text-sm">
                Software architecture, full-stack systems design, Web2/Web3 application planning, applied AI orchestration
              </span>
            </p>
            <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <span className="text-cyber-cyan/70 shrink-0 font-bold">LEARNING:</span>{' '}
              <span className="text-slate-300 font-sans text-sm">Web3 &amp; blockchain fundamentals (smart contracts, on-chain workflows)</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <span className="text-cyber-cyan/70 shrink-0 font-bold">STATUS:</span>{' '}
              <span className="text-cyber-green font-bold uppercase tracking-wider animate-pulse">Open for software engineering &amp; system architecture roles</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
