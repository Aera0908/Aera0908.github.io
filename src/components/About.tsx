const About = () => {
  return (
    <section id="about" className="py-16">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; WHOAMI (extended)</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">About</h2>

      <div className="space-y-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Background</h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Detail-oriented and motivated student with a strong foundation in{' '}
            <span className="text-slate-100 font-medium">digital circuit design</span>,{' '}
            <span className="text-slate-100 font-medium">logic simulation</span>, and{' '}
            <span className="text-slate-100 font-medium">hardware programming</span>.
          </p>
        </div>

        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Expertise</h3>
          <p className="text-slate-300 text-base leading-relaxed">
            IC design, embedded &amp; IoT, and full-stack software—spanning Web2 and Web3. I go from RTL and PCBs
            to React, mobile, and on-chain prototypes, with an eye on applied AI and edge systems.
          </p>
        </div>

        <div className="dashboard-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-blue-400">Experiences</h3>
            <a
              href="#/portfolio"
              className="inline-flex items-center gap-1 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 font-mono text-[11px] tracking-wider text-blue-300 transition-colors hover:bg-blue-500/20"
            >
              PROJECTS ARCHIVE
            </a>
          </div>
          <ul className="space-y-5 text-slate-300 text-base">
            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">|</span>
              <div>
                <span className="font-semibold text-slate-100">AeroVit</span>
                <span className="text-slate-400"> — flagship project today: </span>
                Flutter app, ESP32-S3 smartwatch, BlazePose, Firebase, Web3 rewards (Ethereum Sepolia / ERC-20),
                Next.js &amp; Vite surfaces — full-stack hybrid fitness prototype.
              </div>
            </li>

            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">|</span>
              <div className="min-w-0 flex-1">
                <div>
                  <span className="font-semibold text-slate-100">IC Design Intern</span>
                  <span className="text-slate-400"> — </span>
                  Xinyx Design Consultancy and Services Inc.
                </div>
                <ul className="mt-3 ml-1 space-y-2 border-l border-blue-500/25 pl-4 text-sm text-slate-400">
                  <li>
                    <span className="font-medium text-slate-200">AMBA APB3</span>
                    {' — '}SystemVerilog design and verification — done during this internship.
                  </li>
                </ul>
              </div>
            </li>

            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">|</span>
              <div>
                <span className="font-semibold text-slate-100">School Clinic Web Booking System</span>
                {' — '}database, UI, backend (academic / team project).
              </div>
            </li>

          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
