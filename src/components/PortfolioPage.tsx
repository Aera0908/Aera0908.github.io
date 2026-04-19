import { useMemo, useState } from 'react'
import projectsData from '../data/projects.json'
import type { Engagement, Project, WebTier } from '../data/projectTypes'
import { routeTo } from '../hooks/useHashRoute'
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

  const tiers: Array<'All' | WebTier> = ['All', 'Web2', 'Web3']

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
    <div className="min-h-screen bg-[#0d0d0d] bg-grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button
            onClick={() => routeTo('/')}
            className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-blue-400 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO DASHBOARD
          </button>

          <p className="font-mono text-sm text-slate-500 mb-3">&gt; /projects</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-3">
            Portfolio Archive
          </h1>
          <p className="text-slate-400 max-w-2xl">
            A full catalogue of the projects I've built — from wearable hardware and IoT
            platforms to full-stack web systems. Click any card to open its case study.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500 tracking-wider mr-1">
              CATEGORY
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors border ${
                  activeCategory === cat
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500 tracking-wider mr-1">
              WEB TIER
            </span>
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors border ${
                  activeTier === tier
                    ? tier === 'Web3'
                      ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                      : tier === 'Web2'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
          {engagements.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-slate-500 tracking-wider mr-1">
                ENGAGEMENT
              </span>
              {engagements.map((eng) => (
                <button
                  key={eng}
                  onClick={() => setActiveEngagement(eng)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors border ${
                    activeEngagement === eng
                      ? eng === 'Freelance'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : eng === 'Client'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                          : eng === 'Academic'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : eng === 'Personal'
                              ? 'bg-slate-500/25 text-slate-200 border-slate-400/40'
                              : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {eng}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <button
              key={project.id}
              onClick={() => routeTo(`/portfolio/${project.id}`)}
              className="dashboard-card group text-left flex flex-col overflow-hidden hover:-translate-y-1 hover:glow-blue transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-slate-900/40">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {project.category && (
                <p className="font-mono text-[10px] text-blue-400/80 mb-1 tracking-wider">
                  {project.category.toUpperCase()}
                </p>
              )}
              <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
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
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono tracking-wider bg-blue-600/80 text-white rounded">
                      FEATURED
                    </span>
                  )}
                </div>
              )}
              <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-[10px] text-slate-400 font-mono bg-white/5 rounded"
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

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
                  {project.status && (
                    <span className="font-mono text-[10px] text-slate-300 truncate">
                      {project.status}
                    </span>
                  )}
                  {project.status && project.duration && (
                    <span className="font-mono text-[10px] text-slate-600">·</span>
                  )}
                  <span className="font-mono text-[10px] text-slate-500 truncate">
                    {project.duration}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 group-hover:gap-2 transition-all shrink-0">
                  View case study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-mono text-sm">
            No projects in this category yet.
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-white/5 font-mono text-center text-xs text-slate-500">
          {new Date().getFullYear()} Aira Josh Ynte — Portfolio Archive
        </footer>
      </div>
    </div>
  )
}

export default PortfolioPage
