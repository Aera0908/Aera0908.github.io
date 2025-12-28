import { useState, useEffect } from 'react'
import { useTypingEffect } from '../hooks/useTypingEffect'
import skillsData from '../data/skills.json'

interface Skill {
  name: string
  percentage: number
  icon: string
  color: string
}

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const { displayedText, isTyping } = useTypingEffect({
    text: skill.name,
    speed: 80,
    delay: index * 150,
  })

  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(skill.percentage)
    }, index * 150 + skill.name.length * 80 + 200)

    return () => clearTimeout(timer)
  }, [skill.percentage, skill.name.length, index])

  return (
    <div
      className="card animate-slide-up group hover:scale-105 transition-transform"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <img
            src={skill.icon}
            alt={skill.name}
            className="h-12 w-auto tech-badge"
            loading="lazy"
          />
        </div>

        {/* Skill Name with Typing Effect */}
        <h3 className="text-xl font-semibold mb-4 min-h-[28px] text-gray-100">
          {displayedText}
          {isTyping && <span className="animate-pulse text-teal-400">|</span>}
        </h3>

        {/* Progress Bar */}
        <div className="w-full mb-2">
          <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        {/* Percentage */}
        <p className="text-sm font-medium text-gray-300">{skill.percentage}%</p>
      </div>
    </div>
  )
}

const Skills = () => {
  const [skills] = useState<Skill[]>(skillsData as Skill[])

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gray-50">My Skills</span>
          </h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-4"></div>
        </div>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Here are some of the technologies I work with
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills

