
import { routeTo } from '../hooks/useRoute'
import { VerticalEngineeringStack } from './VerticalEngineeringStack'

const About = () => {
  return (
    <section id="whoami" className="py-16 relative overflow-hidden">
      <div className="relative z-10 w-full min-w-0 max-w-full">
        <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; WHOAMI.LOG // EXTENDED</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-6">About</h2>

        <div className="space-y-8 w-full min-w-0">
          {/* Brief High-Level Background */}
          <div className="cyber-card cyber-corner-brackets">
            <h3 className="text-base font-bold text-cyber-cyan mb-2.5 font-cyber tracking-wider">Engineering Overview</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              I am a software engineer and system architect specializing in modular software design, database planning, and full-stack development. 
              My unique background bridges the entire stack — from register-transfer-level silicon design and custom hardware PCBs to firmware, 
              Web3 protocols, and AI-assisted cloud applications.
            </p>
          </div>

          {/* Interactive Stack Visualizer */}
          <div className="w-full min-w-0">
            <h3 className="text-base font-bold text-cyber-yellow mb-4 font-cyber tracking-wider">Interactive Engineering Stack</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Explore my technical capabilities across the abstraction layers. Click any layer below to inspect core focus areas, achievements, and technical tooling.
            </p>
            <VerticalEngineeringStack />
          </div>

          {/* Project Navigation Banner */}
          <div className="cyber-card cyber-corner-brackets flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-cyber-cyan mb-1.5 font-cyber tracking-wider">Project Deployments</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                See these layers in action across a variety of client applications, hardware prototypes, and open-source packages.
              </p>
            </div>
            <button
              onClick={() => routeTo('/portfolio')}
              className="inline-flex items-center justify-center gap-1.5 bg-cyber-cyan/5 border border-cyber-cyan/40 px-4 py-2 font-terminal text-xs tracking-wider text-cyber-cyan transition-colors hover:bg-cyber-cyan/15 hover:text-cyber-yellow hover:border-cyber-yellow/45 cursor-pointer shrink-0"
            >
              PROJECTS ARCHIVE
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

