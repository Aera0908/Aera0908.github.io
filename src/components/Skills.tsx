import { useState, useEffect } from 'react'
import skillsData from '../data/skills.json'

interface Skill {
  name: string
  percentage: number
  icon: string
  color: string
}

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(skill.percentage)
    }, index * 80)

    return () => clearTimeout(timer)
  }, [skill.percentage, index])

  return (
    <div className="dashboard-card">
      <h3 className="text-base font-semibold text-slate-100 mb-3">{skill.name}</h3>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      <p className="font-mono text-xs text-slate-500 mt-2">{skill.percentage}%</p>
    </div>
  )
}

const Skills = () => {
  const [skills] = useState<Skill[]>(skillsData as Skill[])

  return (
    <section id="skills" className="py-16">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; MODULES</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">Skills</h2>
      <p className="text-slate-400 mb-8">Technologies I work with</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill, index) => (
          <SkillCard key={skill.name} skill={skill} index={index} />
        ))}
      </div>
    </section>
  )
}

export default Skills
