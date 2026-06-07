
const About = () => {
  return (
    <section id="whoami" className="py-16 relative overflow-hidden">
      <div className="relative z-10">
        <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; WHOAMI.LOG // EXTENDED</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">About</h2>

        <div className="space-y-6">
          <div className="cyber-card cyber-corner-brackets">
            <h3 className="text-lg font-bold text-cyber-cyan mb-3 font-cyber tracking-wider">Background</h3>
            <p className="text-slate-300 text-base leading-relaxed">
              Detail-oriented software engineer and system architect with a strong foundation in{' '}
              <span className="text-cyber-yellow font-semibold">software architecture planning</span>,{' '}
              <span className="text-cyber-cyan font-semibold">system modularity</span>,{' '}
              <span className="text-cyber-yellow font-semibold">database design</span>,{' '}
              <span className="text-cyber-cyan font-semibold">full-stack web engineering</span>, and{' '}
              <span className="text-cyber-yellow font-semibold">interactive system layout</span>.
            </p>
          </div>

          <div className="cyber-card cyber-corner-brackets">
            <h3 className="text-lg font-bold text-cyber-cyan mb-3 font-cyber tracking-wider">Expertise</h3>
            <p className="text-slate-300 text-base leading-relaxed">
              IC design, embedded &amp; IoT, and full-stack software—spanning Web2 and Web3. I go from RTL and PCBs
              to React, mobile, and on-chain prototypes, with an eye on applied AI and edge systems.
            </p>
          </div>

          <div className="cyber-card cyber-corner-brackets">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-cyber-yellow font-cyber tracking-wider">Experiences</h3>
              <a
                href="#/portfolio"
                className="inline-flex items-center gap-1 bg-cyber-cyan/5 border border-cyber-cyan/40 px-3 py-1.5 font-terminal text-[11px] tracking-wider text-cyber-cyan transition-colors hover:bg-cyber-cyan/15 hover:text-cyber-yellow hover:border-cyber-yellow/45"
              >
                PROJECTS ARCHIVE
              </a>
            </div>
            <ul className="space-y-5 text-slate-300 text-base">
              <li className="flex gap-2">
                <span className="text-cyber-magenta font-extrabold shrink-0 select-none">&gt;&gt;</span>
                <div>
                  <span className="font-bold text-cyber-yellow">AeroVit</span>
                  <span className="text-slate-400"> — flagship project today: </span>
                  Flutter app, ESP32-S3 smartwatch, BlazePose, Firebase, Web3 rewards (Ethereum Sepolia / ERC-20),
                  Next.js &amp; Vite surfaces — full-stack hybrid fitness prototype.
                </div>
              </li>

              <li className="flex gap-2">
                <span className="text-cyber-magenta font-extrabold shrink-0 select-none">&gt;&gt;</span>
                <div className="min-w-0 flex-1">
                  <div>
                    <span className="font-bold text-cyber-cyan font-cyber tracking-wide">IC Design Intern</span>
                    <span className="text-slate-400"> — </span>
                    Xinyx Design Consultancy and Services Inc.
                  </div>
                  <ul className="mt-3 ml-1 space-y-2 border-l border-cyber-cyan/30 pl-4 text-sm text-slate-400">
                    <li>
                      <span className="font-bold text-cyber-yellow">AMBA APB3</span>
                      {' — '}SystemVerilog design and verification — done during this internship.
                    </li>
                  </ul>
                </div>
              </li>

              <li className="flex gap-2">
                <span className="text-cyber-magenta font-extrabold shrink-0 select-none">&gt;&gt;</span>
                <div>
                  <span className="font-bold text-cyber-cyan font-cyber tracking-wide">School Clinic Web Booking System</span>
                  {' — '}database, UI, backend (academic / team project).
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
