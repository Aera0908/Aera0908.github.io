import { useState, useEffect, useMemo } from 'react'
import skillsData from '../data/skills.json'

interface Skill {
  name: string
  percentage: number
  icon: string
  color: string
  category?: 'hardware' | 'software'
}

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(skill.percentage)
    }, index * 80)

    return () => clearTimeout(timer)
  }, [skill.percentage, index])

  const barColor =
    skill.category === 'hardware'
      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
      : 'bg-blue-500'

  return (
    <div className="dashboard-card">
      <h3 className="text-base font-semibold text-slate-100 mb-3">{skill.name}</h3>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      <p className="font-mono text-xs text-slate-500 mt-2">{skill.percentage}%</p>
    </div>
  )
}

const Skills = () => {
  const skills = useMemo(() => skillsData as Skill[], [])

  const hardware = useMemo(() => skills.filter((s) => s.category === 'hardware'), [skills])
  const software = useMemo(() => skills.filter((s) => s.category !== 'hardware'), [skills])
  const allSkillsText = useMemo(() => skills.map((s) => s.name).join(', '), [skills])

  return (
    <section id="skills" className="py-16" aria-label="Technical skills">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; MODULES</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2">Skills</h2>
      <p className="text-slate-400 mb-10 max-w-2xl leading-relaxed">
        Hardware &amp; embedded experience from internships, PCB work, and flagship projects—plus Web2 tooling and APIs.
        The bars reflect practical hands-on depth across both tracks.
      </p>

      <div className="space-y-12">
        <div>
          <h3 className="font-mono text-xs text-amber-400/90 tracking-wider mb-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            HARDWARE &amp; EMBEDDED
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hardware.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-mono text-xs text-blue-400/90 tracking-wider mb-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
            SOFTWARE &amp; WEB STACK
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {software.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Plain-text skill list for search engines and screen readers */}
      <p className="sr-only">
        Skills &amp; technologies: {allSkillsText}.
      </p>
    </section>
  )
}

export default Skills
