import { useMemo, useState } from 'react'
import projectsData from '../data/projects.json'
import type { Engagement, Project, WebTier } from '../data/projectTypes'
import { routeTo } from '../hooks/useRoute'
import WebTierBadge from './WebTierBadge'
import { EngagementBadge, LimitedInfoBadge } from './ProjectTagBadges'

const projects = projectsData as Project[]

const PortfolioPage = () => {
  const categories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.category && set.add(p.category))
    return ['All', ...Array.from(set)]
  }, [])

  const engagements = useMemo(() => {
    const set = new Set<Engagement>()
    projects.forEach((p) => p.engagement && set.add(p.engagement))
    return ['All', ...Array.from(set)] as Array<'All' | Engagement>
  }, [])

  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeTier, setActiveTier] = useState<'All' | WebTier>('All')
  const [activeEngagement, setActiveEngagement] = useState<'All' | Engagement>('All')

  const tiers: Array<'All' | WebTier> = ['All', 'Web2', 'Web3', 'Hybrid']

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const catMatch = activeCategory === 'All' || p.category === activeCategory
        const tierMatch = activeTier === 'All' || p.webTier === activeTier
        const engagementMatch =
          activeEngagement === 'All' || p.engagement === activeEngagement
        return catMatch && tierMatch && engagementMatch
      }),
    [activeCategory, activeTier, activeEngagement],
  )

  return (
    <div className="min-h-screen bg-cyber-dark bg-cyber-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button
            onClick={() => routeTo('/')}
            className="cyber-btn-outline inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-none mb-6 border-cyber-cyan/45 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-yellow hover:text-cyber-yellow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO DASHBOARD
          </button>

          <p className="font-terminal text-sm text-cyber-magenta tracking-widest mb-3">&gt; /PROJECT_ARCHIVE.SYS</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-3 tracking-wide cyber-glitch">
            Portfolio Archive
          </h1>
          <p className="text-slate-400 max-w-2xl">
            A full catalogue of the projects I've built — from wearable hardware and IoT
            platforms to full-stack web systems. Click any card to open its case study.
          </p>
        </div>

        <div className="space-y-3.5 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-terminal text-[10px] text-cyber-magenta tracking-widest mr-1.5">
              CATEGORY
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 font-terminal text-xs transition-colors border rounded-none ${
                  activeCategory === cat
                    ? 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow font-bold'
                    : 'bg-cyber-dark/45 border-cyber-cyan/35 text-cyber-cyan/70 hover:text-cyber-cyan hover:border-cyber-cyan'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-terminal text-[10px] text-cyber-magenta tracking-widest mr-1.5">
              WEB TIER
            </span>
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-3 py-1.5 font-terminal text-xs transition-colors border rounded-none ${
                  activeTier === tier
                    ? 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow font-bold'
                    : 'bg-cyber-dark/45 border-cyber-cyan/35 text-cyber-cyan/70 hover:text-cyber-cyan hover:border-cyber-cyan'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
          {engagements.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-terminal text-[10px] text-cyber-magenta tracking-widest mr-1.5">
                ENGAGEMENT
              </span>
              {engagements.map((eng) => (
                <button
                  key={eng}
                  onClick={() => setActiveEngagement(eng)}
                  className={`px-3 py-1.5 font-terminal text-xs transition-colors border rounded-none ${
                    activeEngagement === eng
                      ? 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow font-bold'
                      : 'bg-cyber-dark/45 border-cyber-cyan/35 text-cyber-cyan/70 hover:text-cyber-cyan hover:border-cyber-cyan'
                  }`}
                >
                  {eng}
                </button>
              ))}
            </div>
          )}
        </div>

        <div 
          key={`${activeCategory}-${activeTier}-${activeEngagement}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in"
        >
          {filtered.map((project) => {
            const liveUrl = project.links?.live || project.links?.website || project.websiteUrl
            const githubUrl = project.links?.github
            const openProject = () => routeTo(`/portfolio/${project.id}`)

            return (
              <div
                key={project.id}
                role="link"
                tabIndex={0}
                onClick={openProject}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openProject()
                  }
                }}
                className="cyber-card cyber-corner-brackets group text-left flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-transform duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-yellow/40"
                aria-label={`Open case study: ${project.title}`}
              >
                <div className="relative overflow-hidden rounded-none border border-cyber-cyan/30 mb-4 aspect-video bg-cyber-dark">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {project.category && (
                  <p className="font-terminal text-[10px] text-cyber-cyan mb-1 tracking-widest">
                    {project.category.toUpperCase()}
                  </p>
                )}
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyber-yellow font-cyber tracking-wide transition-colors">
                  {project.title}
                </h3>
                {(project.webTier ||
                  project.engagement ||
                  project.ndaConstrained ||
                  project.featured) && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.webTier && <WebTierBadge tier={project.webTier} size="sm" />}
                    {project.engagement && (
                      <EngagementBadge engagement={project.engagement} size="sm" />
                    )}
                    {project.ndaConstrained && <LimitedInfoBadge active size="sm" />}
                    {project.featured && (
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-terminal tracking-wider bg-cyber-yellow/15 text-cyber-yellow border border-cyber-yellow/30">
                        FEATURED
                      </span>
                    )}
                  </div>
                )}
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] text-cyber-cyan font-terminal bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-none"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] text-slate-500 font-mono">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {(liveUrl || githubUrl) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="cyber-btn-secondary inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-terminal tracking-wider rounded-none"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0-7L10 14M5 5v14h14v-6" />
                        </svg>
                        LIVE DEMO
                      </a>
                    )}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="cyber-btn-outline inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-terminal tracking-wider rounded-none"
                      >
                        <svg className="w-3 h-3 text-slate-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.02c-3.2.69-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.52-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 015.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.66.79.54A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
                        </svg>
                        REPO
                      </a>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-cyber-yellow/15 mt-auto">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
                    {project.status && (
                      <span className="font-terminal text-[10px] text-cyber-cyan/85 truncate uppercase">
                        {project.status}
                      </span>
                    )}
                    {project.status && project.duration && (
                      <span className="font-terminal text-[10px] text-cyber-cyan/30">·</span>
                    )}
                    <span className="font-terminal text-[10px] text-cyber-cyan/60 truncate uppercase">
                      {project.duration}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-cyber-cyan group-hover:text-cyber-yellow group-hover:gap-2 transition-all shrink-0">
                    View case study
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-cyber-magenta/70 font-terminal text-sm uppercase tracking-widest">
            // No projects in this category yet.
          </div>
        )}

        <footer className="mt-16 py-8 border-t border-cyber-yellow/10 font-terminal text-center text-xs text-cyber-cyan/50 uppercase tracking-widest">
          // {new Date().getFullYear()} Aira Ynte — Portfolio Archive // SYSTEM_STABLE
        </footer>
      </div>
    </div>
  )
}

export default PortfolioPage
