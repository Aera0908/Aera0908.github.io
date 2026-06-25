
import { routeTo } from '../hooks/useRoute'
import { VerticalEngineeringStack } from './VerticalEngineeringStack'

const About = () => {
  return (
    <section id="whoami" className="py-16 relative overflow-hidden">
      <div className="relative z-10 w-full min-w-0 max-w-full">
        <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; WHOAMI.LOG // EXTENDED</p>
        <div className="space-y-8 w-full min-w-0">
          {/* Interactive Stack Visualizer */}
          <div className="w-full min-w-0">
            <h3 className="text-base font-bold text-cyber-yellow mb-4 font-cyber tracking-wider">Engineering Stack</h3>
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

