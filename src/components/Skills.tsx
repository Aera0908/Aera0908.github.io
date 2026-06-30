import { useMemo, useState } from 'react'
import skillsData from '../data/skills.json'
import peopleSkillsData from '../data/people-skills.json'

interface Skill {
  name: string
  percentage: number
  icon: string
  color: string
  category?: 'hardware' | 'software'
}

interface PeopleSkillsFile {
  hardSkills: string[]
  softSkills: string[]
}

const peopleSkills = peopleSkillsData as PeopleSkillsFile

const TechStackItem = ({
  skill,
}: {
  skill: Skill
}) => {
  const isHardware = skill.category === 'hardware'
  const hoverBorderColor = isHardware ? 'hover:border-cyber-yellow/65' : 'hover:border-cyber-cyan/65'
  const accentText = isHardware ? 'text-cyber-yellow' : 'text-cyber-cyan'
  const glowShadow = isHardware ? 'hover:shadow-[0_0_12px_rgba(252,238,10,0.2)]' : 'hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]'
  const bulletSymbol = isHardware ? '▲' : '■'
  const activeBlocks = Math.round((skill.percentage || 50) / 20)

  return (
    <div className={`flex items-center gap-3 rounded-none border border-cyber-cyan/15 bg-cyber-dark/70 px-3.5 py-2 hover:bg-cyber-dark/95 transition-all duration-300 ${hoverBorderColor} ${glowShadow} shrink-0`}>
      <span className={`text-[10px] font-mono select-none shrink-0 ${accentText}`}>
        {bulletSymbol}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs sm:text-sm font-terminal font-semibold tracking-wider text-slate-200 whitespace-nowrap">
          {skill.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex gap-[2px] h-1 w-12 items-center">
            {Array.from({ length: 5 }).map((_, idx) => {
              const isBlockActive = idx < activeBlocks
              return (
                <div
                  key={idx}
                  className={`flex-1 h-[3px] ${
                    isBlockActive
                      ? isHardware
                        ? 'bg-cyber-yellow shadow-[0_0_3px_rgba(252,238,10,0.6)]'
                        : 'bg-cyber-cyan shadow-[0_0_3px_rgba(0,240,255,0.6)]'
                      : 'bg-black/40 border border-slate-900/50'
                  }`}
                />
              )
            })}
          </div>
          <span className="text-[8px] font-mono text-slate-400 font-bold select-none">
            {skill.percentage}%
          </span>
        </div>
      </div>
    </div>
  )
}

const CompetencyCard = ({
  text,
  accent,
}: {
  text: string
  accent: 'violet' | 'teal'
}) => {
  const isViolet = accent === 'violet'
  const textColor = isViolet ? 'text-cyber-magenta' : 'text-cyber-cyan'
  const borderColor = isViolet ? 'border-cyber-magenta/20' : 'border-cyber-cyan/20'
  const bgColor = isViolet ? 'bg-cyber-magenta/5' : 'bg-cyber-cyan/5'
  const statusLabel = isViolet ? '[ HARD_SYS ]' : '[ SOFT_COM ]'

  return (
    <div className={`min-w-0 max-w-full break-words rounded-none border px-3 py-2.5 text-[11px] leading-relaxed text-slate-300 font-terminal transition-all duration-300 hover:border-cyber-yellow hover:bg-black/35 flex gap-2 items-start ${borderColor} ${bgColor}`}>
      <span className={`font-bold shrink-0 mt-0.5 ${textColor}`}>{statusLabel}</span>
      <span className="font-sans text-xs text-slate-300 leading-relaxed">{text}</span>
    </div>
  )
}

const techGridClass =
  'flex flex-wrap gap-2 sm:gap-3'

const CollapsibleSection = ({
  title,
  colorClass,
  bulletColor,
  children,
}: {
  title: string
  colorClass: string
  bulletColor: string
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-w-0 border-b border-cyber-cyan/10 pb-6 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-yellow/40 rounded-none bg-cyber-dark/45 hover:bg-cyber-dark/70 border border-cyber-cyan/35 hover:border-cyber-yellow/60 transition-all duration-300 shadow-sm backdrop-blur-sm group"
        aria-expanded={isOpen}
      >
        <h3 className={`flex items-center gap-2 font-terminal text-xs tracking-wider font-semibold ${colorClass}`}>
          <span className={`inline-block h-2 w-2 rounded-none ${bulletColor}`} />
          {title}
        </h3>
        <div className="flex h-6 w-6 items-center justify-center rounded-none bg-cyber-cyan/5 group-hover:bg-cyber-yellow/10 border border-cyber-cyan/25 group-hover:border-cyber-yellow/45 transition-colors">
          <svg
            className={`w-3 h-3 text-cyber-cyan group-hover:text-cyber-yellow transition-transform duration-200 ${
              isOpen ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

const Skills = () => {
  const skills = useMemo(() => skillsData as Skill[], [])

  const hardware = useMemo(
    () =>
      skills
        .filter((s) => s.category === 'hardware')
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [skills],
  )

  const software = useMemo(
    () =>
      skills
        .filter((s) => s.category !== 'hardware')
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [skills],
  )

  const techStackSr = useMemo(
    () =>
      [...hardware, ...software]
        .map((s) => s.name)
        .join(', '),
    [hardware, software],
  )

  const srSummary = useMemo(
    () =>
      `Tech stack: ${techStackSr}. Hard skills: ${peopleSkills.hardSkills.join(', ')}. Soft skills: ${peopleSkills.softSkills.join(', ')}.`,
    [techStackSr],
  )

  return (
    <section
      id="stack"
      className="w-full min-w-0 max-w-full scroll-mt-24 py-16"
      aria-label="Technology stack and competencies"
    >
      <p className="mb-4 font-terminal text-sm text-cyber-magenta tracking-widest">&gt; TECH.STACK // DIAGNOSTICS</p>
      <h2 className="mb-10 text-2xl font-bold text-slate-50 md:text-3xl tracking-wide cyber-glitch">
        Tech Stack
      </h2>

      <div className="min-w-0 space-y-6">
        <CollapsibleSection
          title="HARDWARE & EMBEDDED"
          colorClass="text-cyber-yellow"
          bulletColor="bg-cyber-yellow"
        >
          <div className={techGridClass}>
            {hardware.map((skill) => (
              <TechStackItem
                key={skill.name}
                skill={skill}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="SOFTWARE & WEB STACK"
          colorClass="text-cyber-cyan"
          bulletColor="bg-cyber-cyan"
        >
          <div className={techGridClass}>
            {software.map((skill) => (
              <TechStackItem
                key={skill.name}
                skill={skill}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="HARD SKILLS"
          colorClass="text-cyber-magenta"
          bulletColor="bg-cyber-magenta"
        >
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {peopleSkills.hardSkills.map((line) => (
              <CompetencyCard
                key={line}
                text={line}
                accent="violet"
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="SOFT SKILLS"
          colorClass="text-cyber-cyan"
          bulletColor="bg-cyber-cyan"
        >
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {peopleSkills.softSkills.map((line) => (
              <CompetencyCard
                key={line}
                text={line}
                accent="teal"
              />
            ))}
          </div>
        </CollapsibleSection>
      </div>

      <p className="sr-only">{srSummary}</p>
    </section>
  )
}

export default Skills

