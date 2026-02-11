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
            Hands-on experience in embedded systems, web designing, and SQL database management systems.
            Building from hardware circuits to AI-enhanced web interfaces.
          </p>
        </div>

        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Experience & Projects</h3>
          <ul className="space-y-3 text-slate-300 text-base">
            <li className="flex gap-2">
              <span className="text-slate-500">|</span>
              <span><span className="font-semibold text-slate-100">IC Design Intern</span> – Xinyx Design Consultancy and Services Inc.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">|</span>
              <span><span className="font-semibold text-slate-100">AMBA APB3 Project</span> – SystemVerilog design and verification</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">|</span>
              <span><span className="font-semibold text-slate-100">CPE Challenge 2024</span> – Java Programming, ICpEP.se</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">|</span>
              <span><span className="font-semibold text-slate-100">School Clinic Web Booking System</span> – DB, UI, backend</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">|</span>
              <span><span className="font-semibold text-slate-100">Xepto Education Website</span> – Work immersion, Muntinlupa Science High School</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">|</span>
              <span><span className="font-semibold text-slate-100">DRRR Project</span> – Automotive robot</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
