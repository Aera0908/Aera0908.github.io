import { useMemo, useEffect, useState } from 'react'
import skillsData from '../data/skills.json'
import peopleSkillsData from '../data/people-skills.json'

interface Skill {
  name: string
  percentage: number
  icon: string
  color: string
  category?: 'hardware' | 'software'
}

type Proficiency = 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner'

function proficiencyFromPercentage(p: number): Proficiency {
  if (p >= 80) return 'Expert'
  if (p >= 60) return 'Advanced'
  if (p >= 40) return 'Intermediate'
  return 'Beginner'
}

const tierBadgeClass: Record<Proficiency, string> = {
  Expert:
    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35',
  Advanced:
    'bg-sky-500/15 text-sky-300 border border-sky-500/35',
  Intermediate:
    'bg-amber-500/12 text-amber-200 border border-amber-500/30',
  Beginner:
    'bg-slate-600/20 text-slate-400 border border-slate-500/25',
}

/** ≥ Tailwind `sm` — desktop-style expanded tech cards */
function useMinSm() {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const fn = () => setMatches(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return matches
}

const tierBadge = (tier: Proficiency) => (
  <span
    className={`inline-flex rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${tierBadgeClass[tier]}`}
  >
    {tier}
  </span>
)

const TechStackItem = ({
  skill,
  layoutExpanded,
}: {
  skill: Skill
  layoutExpanded: boolean
}) => {
  const tier = proficiencyFromPercentage(skill.percentage)

  if (layoutExpanded) {
    return (
      <div className="flex h-full min-w-0 max-w-full flex-col gap-2 overflow-hidden rounded-lg border border-white/[0.08] bg-[#161616]/80 px-3 py-2.5">
        <span className="break-words text-[13px] font-medium leading-snug text-slate-200">
          {skill.name}
        </span>
        <span className="mt-auto inline-flex self-start">{tierBadge(tier)}</span>
      </div>
    )
  }

  return (
    <details className="group min-w-0 max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#161616]/80 open:bg-[#1a1a1a]">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-center px-1 py-2 text-center [&::-webkit-details-marker]:hidden marker:content-none">
        <span className="line-clamp-4 break-words px-0.5 text-[10px] font-semibold leading-tight text-slate-100">
          {skill.name}
        </span>
      </summary>
      <div className="flex justify-center border-t border-white/[0.06] px-1 pb-2 pt-2">
        {tierBadge(tier)}
      </div>
    </details>
  )
}

function competencyKeyword(text: string): string {
  const em = text.split(' — ')
  if (em.length >= 2 && em[0].trim().length <= 52) {
    return em[0].trim()
  }
  if (text.length <= 44) return text
  const cut = text.slice(0, 42).trimEnd()
  const sp = cut.lastIndexOf(' ')
  const base = sp > 18 ? cut.slice(0, sp) : cut
  return `${base}…`
}

interface PeopleSkillsFile {
  hardSkills: string[]
  softSkills: string[]
}

const peopleSkills = peopleSkillsData as PeopleSkillsFile

const CompetencyCard = ({
  text,
  accent,
  layoutExpanded,
}: {
  text: string
  accent: 'violet' | 'teal'
  layoutExpanded: boolean
}) => {
  const shell =
    accent === 'violet'
      ? 'border-violet-500/25 bg-violet-500/[0.06]'
      : 'border-teal-500/25 bg-teal-500/[0.06]'
  const headline = useMemo(() => competencyKeyword(text), [text])

  if (layoutExpanded) {
    return (
      <div
        className={`min-w-0 max-w-full break-words rounded-lg border px-3 py-2.5 text-[13px] leading-snug text-slate-200 ${shell}`}
      >
        {text}
      </div>
    )
  }

  return (
    <details
      className={`min-w-0 max-w-full overflow-hidden rounded-lg border ${shell} open:bg-black/20`}
    >
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center px-1 py-2 text-left sm:px-2 [&::-webkit-details-marker]:hidden marker:content-none">
        <span className="line-clamp-4 break-words text-[10px] font-semibold leading-snug text-slate-100 sm:text-[11px]">
          {headline}
        </span>
      </summary>
      <div className="border-t border-white/[0.06] px-1 pb-2 pt-2 text-[10px] leading-relaxed text-slate-300 sm:px-2 sm:text-[11px]">
        {text}
      </div>
    </details>
  )
}

const techGridClass =
  'grid min-w-0 grid-cols-3 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

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
    <div className="min-w-0 border-b border-white/[0.04] pb-6 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-200 shadow-sm backdrop-blur-sm group"
        aria-expanded={isOpen}
      >
        <h3 className={`flex items-center gap-2 font-mono text-[11px] tracking-wider font-semibold ${colorClass}`}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${bulletColor}`} />
          {title}
        </h3>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.04] group-hover:bg-white/[0.08] border border-white/[0.05] transition-colors">
          <svg
            className={`w-3 h-3 text-slate-400 group-hover:text-slate-200 transition-transform duration-200 ${
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
  const layoutExpanded = useMinSm()

  const hardware = useMemo(
    () =>
      skills
          .filter((s) => s.category === 'hardware')
          .slice()
          .sort((a, b) => b.percentage - a.percentage),
    [skills],
  )

  const software = useMemo(
    () =>
      skills
          .filter((s) => s.category !== 'hardware')
          .slice()
          .sort((a, b) => b.percentage - a.percentage),
    [skills],
  )

  const techStackSr = useMemo(
    () =>
      [...hardware, ...software]
          .map(
              (s) =>
                  `${s.name} (${proficiencyFromPercentage(s.percentage)})`,
          )
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
      <p className="mb-4 font-mono text-sm text-slate-500">&gt; TECH.STACK</p>
      <h2 className="mb-2 text-2xl font-bold text-slate-50 md:text-3xl">
        Tech Stack
      </h2>
      <p className="mb-10 max-w-full text-sm leading-relaxed text-slate-400 sm:max-w-2xl">
        Languages, frameworks, and hardware tooling I use day-to-day — grounded in internships, PCB bring-up, flagship prototypes, and shipped Web2 surfaces.
      </p>

      <div className="min-w-0 space-y-6">
        <CollapsibleSection
          title="HARDWARE & EMBEDDED"
          colorClass="text-amber-400/90"
          bulletColor="bg-amber-400"
        >
          <div className={techGridClass}>
            {hardware.map((skill) => (
              <TechStackItem
                key={skill.name}
                skill={skill}
                layoutExpanded={layoutExpanded}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="SOFTWARE & WEB STACK"
          colorClass="text-blue-400/90"
          bulletColor="bg-blue-400"
        >
          <div className={techGridClass}>
            {software.map((skill) => (
              <TechStackItem
                key={skill.name}
                skill={skill}
                layoutExpanded={layoutExpanded}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="HARD SKILLS"
          colorClass="text-violet-400/90"
          bulletColor="bg-violet-400"
        >
          <div className="grid min-w-0 grid-cols-2 gap-1.5 min-[360px]:grid-cols-3 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
            {peopleSkills.hardSkills.map((line) => (
              <CompetencyCard
                key={line}
                text={line}
                accent="violet"
                layoutExpanded={layoutExpanded}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="SOFT SKILLS"
          colorClass="text-teal-400/90"
          bulletColor="bg-teal-400"
        >
          <div className="grid min-w-0 grid-cols-2 gap-1.5 min-[360px]:grid-cols-3 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
            {peopleSkills.softSkills.map((line) => (
              <CompetencyCard
                key={line}
                text={line}
                accent="teal"
                layoutExpanded={layoutExpanded}
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
