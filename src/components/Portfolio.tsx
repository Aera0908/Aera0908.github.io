import { useState, useEffect, useRef } from 'react'
import projectsData from '../data/projects.json'
import type { Project } from '../data/projectTypes'
import { routeTo } from '../hooks/useRoute'
import WebTierBadge from './WebTierBadge'
import { EngagementBadge, LimitedInfoBadge } from './ProjectTagBadges'
import ProjectGallery from './ProjectGallery'

const Portfolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const allProjects = projectsData as Project[]
  // Exclude highlighted projects (AeroVit, Fehuvia & Plant.io) from the carousel
  const carouselProjects = allProjects.filter((p) => p.id !== 'aerovit' && p.id !== 'fehuvia' && p.id !== 'plantio')
  const featured = carouselProjects.filter((p) => p.featured)
  const projects = featured.length > 0 ? featured : carouselProjects

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const openModal = (index: number) => {
    setSelectedProject(index)
    setIsClosing(false)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      if (modalRef.current && contentRef.current) {
        modalRef.current.style.opacity = ''
        modalRef.current.style.transition = ''
        contentRef.current.style.transform = ''
        contentRef.current.style.opacity = ''
        contentRef.current.style.transition = ''
      }
    })
  }

  const closeModal = () => {
    setIsClosing(true)
  }

  useEffect(() => {
    if (isClosing && modalRef.current && contentRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (modalRef.current && contentRef.current) {
            modalRef.current.style.transition = 'opacity 0.2s ease-in-out'
            contentRef.current.style.transition = 'transform 0.2s ease-in, opacity 0.2s ease-in'
            modalRef.current.style.opacity = '0'
            contentRef.current.style.transform = 'translateY(10px)'
            contentRef.current.style.opacity = '0'
          }
        })
      })
      setTimeout(() => {
        setSelectedProject(null)
        setIsClosing(false)
        document.body.style.overflow = 'unset'
      }, 200)
    }
  }, [isClosing])

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const goToCaseStudy = (projectId: string) => {
    document.body.style.overflow = 'unset'
    setSelectedProject(null)
    setIsClosing(false)
    routeTo(`/portfolio/${projectId}`)
  }

  const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
    const hasBadges =
      project.webTier || project.engagement || project.ndaConstrained
    const descIsLong = project.description.length > 160

    return (
      <div
        className="cyber-card cyber-corner-brackets flex h-[472px] w-full max-w-[380px] flex-col overflow-hidden md:h-[472px] md:w-[380px]"
      >
        <div className="relative mb-3 shrink-0 overflow-hidden rounded-none border border-cyber-cyan/30">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-36 w-full object-cover md:h-40"
          />
        </div>
        <h3 className="mb-2 line-clamp-2 shrink-0 text-base font-bold leading-snug text-slate-100 md:text-lg font-cyber tracking-wide">
          {project.title}
        </h3>
        {hasBadges && (
          <div className="mb-2 flex shrink-0 max-h-[52px] flex-wrap gap-1.5 overflow-hidden">
            {project.webTier && <WebTierBadge tier={project.webTier} size="sm" />}
            {project.engagement && (
              <EngagementBadge engagement={project.engagement} size="sm" />
            )}
            {project.ndaConstrained && <LimitedInfoBadge active size="sm" />}
          </div>
        )}
        <div className="mb-3 min-h-0 flex-1 overflow-hidden">
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">{project.description}</p>
          {descIsLong && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
              className="mt-1 text-left text-xs font-semibold text-cyber-cyan hover:text-cyber-yellow"
            >
              ... see more
            </button>
          )}
        </div>
        <div className="mb-3 flex max-h-[24px] shrink-0 flex-wrap gap-2 overflow-hidden">
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-2 py-0.5 font-terminal text-[10px] text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/20"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex shrink-0 gap-2 pt-1">
          {(project.links?.live || project.websiteUrl) && (
            <a
              href={project.links?.live || project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-secondary py-1.5 text-center text-xs font-semibold rounded-none flex-1 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              title="Open live site"
            >
              Live
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-outline py-1.5 text-center text-xs font-semibold rounded-none flex-1 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              title="Open source repository"
            >
              Repo
            </a>
          )}
          <button
            type="button"
            onClick={onClick}
            className={`cyber-btn-primary py-1.5 text-center text-xs font-bold rounded-none ${project.links?.live || project.websiteUrl || project.links?.github ? 'flex-1' : 'w-full'}`}
          >
            Details
          </button>
        </div>
      </div>
    )
  }

  return (
    <section id="projects" className="py-16">
      <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; PORTFOLIO.SYS // MODULE_LOG</p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2 tracking-wide cyber-glitch">Portfolio</h2>
          <p className="text-slate-400 text-sm max-w-xl">
            A curated carousel of my best projects. Open the full archive for every project on file.
          </p>
        </div>
        <button
          onClick={() => routeTo('/portfolio')}
          className="cyber-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-none border-cyber-cyan/45 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-yellow hover:text-cyber-yellow"
        >
          View full archive
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Highlighted Projects ── */}
      {(() => {
        const highlightedOrder = ['fehuvia', 'aerovit', 'plantio']
        const highlighted = allProjects
          .filter((p) => highlightedOrder.includes(p.id))
          .sort((a, b) => highlightedOrder.indexOf(a.id) - highlightedOrder.indexOf(b.id))
        if (highlighted.length === 0) return null
        return (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-3.5 h-3.5 text-cyber-yellow shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <h3 className="font-terminal text-xs tracking-widest text-cyber-yellow font-bold">
                HIGHLIGHTED PROJECTS
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-cyber-yellow/45 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {highlighted.map((project) => {
                const liveUrl = project.links?.live || project.links?.website || project.websiteUrl
                const accentClass =
                  project.id === 'aerovit'
                    ? 'border-cyber-magenta/30 hover:border-cyber-magenta/75 hover:shadow-[0_0_20px_rgba(255,0,85,0.2)]'
                    : project.id === 'fehuvia'
                    ? 'border-cyber-cyan/30 hover:border-cyber-cyan/75 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'border-cyber-yellow/30 hover:border-cyber-yellow/75 hover:shadow-[0_0_20px_rgba(252,238,10,0.2)]'

                return (
                  <div
                    key={project.id}
                    className={`cyber-card cyber-corner-brackets group relative overflow-hidden transition-all duration-300 cursor-pointer border ${accentClass}`}
                    onClick={() => goToCaseStudy(project.id)}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        goToCaseStudy(project.id)
                      }
                    }}
                    aria-label={`View case study: ${project.title}`}
                  >
                    {/* Highlighted badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-terminal tracking-wider bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/35 backdrop-blur-sm">
                        <svg className="w-3 h-3 text-cyber-yellow shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        HIGHLIGHTED
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative overflow-hidden border border-cyber-cyan/25 mb-4 aspect-video bg-cyber-dark">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    {project.category && (
                      <p className="font-terminal text-[10px] text-cyber-cyan mb-1 tracking-widest">
                        {project.category.toUpperCase()}
                      </p>
                    )}
                    <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyber-yellow font-cyber tracking-wide line-clamp-2">
                      {project.title}
                    </h4>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.webTier && <WebTierBadge tier={project.webTier} size="sm" />}
                      {project.engagement && (
                        <EngagementBadge engagement={project.engagement} size="sm" />
                      )}
                      {project.ndaConstrained && <LimitedInfoBadge active size="sm" />}
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[10px] text-cyber-cyan font-terminal bg-cyber-cyan/5 border border-cyber-cyan/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-2 py-0.5 text-[10px] text-slate-500 font-mono">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-cyber-yellow/15">
                      <div className="flex flex-wrap gap-2">
                        {liveUrl && (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="cyber-btn-secondary inline-flex items-center gap-1 px-2.5 py-1 font-terminal text-[9px] tracking-wider rounded-none"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0-7L10 14M5 5v14h14v-6" />
                            </svg>
                            LIVE
                          </a>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-cyber-cyan group-hover:text-cyber-yellow group-hover:gap-2 transition-all shrink-0">
                        View case study
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="flex items-center gap-2 mb-6 mt-4">
        <svg className="w-3.5 h-3.5 text-cyber-cyan shrink-0 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v.191m0-2.103V6.75A2.25 2.25 0 014.5 4.5h5.25a2.25 2.25 0 011.64.698l1.378 1.488a2.25 2.25 0 001.64.698h5.25a2.25 2.25 0 012.25 2.25v1.319" />
        </svg>
        <h3 className="font-terminal text-xs tracking-widest text-cyber-cyan/80 font-bold">
          OTHER NOTABLE PROJECTS
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-cyber-cyan/35 to-transparent" />
      </div>

      <div className="relative">
        {/* Mobile: Simple 2D carousel */}
        <div className="md:hidden">
          <div className="relative flex min-h-[440px] w-full flex-col items-center justify-center">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`w-full max-w-[380px] transition-all duration-300 ${
                  index === currentIndex
                    ? 'relative z-10 opacity-100'
                    : 'pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-0'
                }`}
              >
                <div className="mx-auto w-full max-w-[380px]">
                  <ProjectCard project={project} onClick={() => openModal(index)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3D Carousel — controls sit below the scene so dots never overlap the cards */}
        <div className="hidden md:block">
          <div className="relative h-[460px]" style={{ perspective: '2000px' }}>
            {(() => {
              const radius = Math.max(380, projects.length * 85)
              return (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    perspectiveOrigin: 'center center',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(-6deg) translateZ(${-radius}px)`,
                  }}
                >
                  {projects.map((project, index) => {
                    let offset = index - currentIndex
                    if (offset > projects.length / 2) offset -= projects.length
                    else if (offset < -projects.length / 2) offset += projects.length

                    const absOffset = Math.abs(offset)
                    const theta = (360 / projects.length) * offset
                    
                    const scale = absOffset === 0 ? 0.9 : Math.max(0.65, 0.8 - absOffset * 0.08)
                    const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.75 : 0
                    const zIndex = projects.length - absOffset
                    const isVisible = absOffset < 2 // Only show front card and direct left/right neighbors

                    return (
                      <div
                        key={index}
                        className={`absolute w-[380px] cursor-pointer transition-all duration-700 ease-out ${!isVisible ? 'hidden' : ''}`}
                        style={{
                          transform: `rotateY(${theta}deg) translateZ(${radius}px) rotateY(${-theta * 0.65}deg) scale(${scale})`,
                          transformStyle: 'preserve-3d',
                          opacity,
                          zIndex,
                          pointerEvents: absOffset === 0 ? 'auto' : 'none',
                          perspective: 2000,
                        }}
                        onClick={() => absOffset === 0 && openModal(index)}
                      >
                        <div className="overflow-hidden rounded-lg" style={{ transform: 'translateZ(0)' }}>
                          <ProjectCard project={project} onClick={() => openModal(index)} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          <div className="flex items-center justify-center gap-4 pb-2 pt-10">
            <button
              type="button"
              onClick={prevSlide}
              className="rounded-none p-3 text-cyber-cyan transition-colors hover:bg-cyber-cyan/10 hover:text-cyber-yellow border border-transparent hover:border-cyber-cyan/30"
              aria-label="Previous project"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-none transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-cyber-yellow'
                      : 'w-2 bg-cyber-cyan/30 hover:bg-cyber-cyan/60'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextSlide}
              className="rounded-none p-3 text-cyber-cyan transition-colors hover:bg-cyber-cyan/10 hover:text-cyber-yellow border border-transparent hover:border-cyber-cyan/30"
              aria-label="Next project"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="mt-12 flex justify-center items-center gap-4 md:hidden">
          <button
            onClick={prevSlide}
            className="p-2 text-cyber-cyan hover:text-cyber-yellow transition-colors"
            aria-label="Previous project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-none transition-all ${
                  index === currentIndex
                    ? 'bg-cyber-yellow w-8'
                    : 'bg-cyber-cyan/30 w-2 hover:bg-cyber-cyan/60'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 text-cyber-cyan hover:text-cyber-yellow transition-colors"
            aria-label="Next project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {selectedProject !== null && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div
            ref={contentRef}
            className="relative w-full max-w-2xl cyber-card cyber-corner-brackets overflow-hidden border border-cyber-yellow/45"
            style={{
              maxHeight: '90vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              pointerEvents: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-cyber-cyan hover:text-cyber-yellow z-10 rounded-none hover:bg-cyber-yellow/15"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 pt-12">
              <img
                src={projects[selectedProject].image}
                alt={projects[selectedProject].title}
                loading="lazy"
                decoding="async"
                className="w-full h-48 object-cover rounded-none border border-cyber-cyan/30 mb-6"
              />
              <h3 className="text-xl font-bold text-slate-50 mb-6 font-cyber tracking-wide">
                {projects[selectedProject].title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => goToCaseStudy(projects[selectedProject].id)}
                  className="cyber-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-none"
                >
                  View Full Case Study
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {projects[selectedProject].websiteUrl && (
                  <a
                    href={projects[selectedProject].websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cyber-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-none"
                  >
                    Website
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <div className="space-y-4 text-sm font-terminal">
                <div>
                  <h4 className="text-cyber-magenta font-terminal text-[10px] tracking-widest mb-2">DESCRIPTION</h4>
                  <p className="text-slate-300 leading-relaxed font-sans">{projects[selectedProject].fullDescription}</p>
                </div>
                <div>
                  <h4 className="text-cyber-magenta font-terminal text-[10px] tracking-widest mb-2">ROLE</h4>
                  <p className="text-slate-300 font-sans">{projects[selectedProject].role}</p>
                </div>
                <div>
                  <h4 className="text-cyber-magenta font-terminal text-[10px] tracking-widest mb-2">DURATION</h4>
                  <p className="text-slate-300 font-sans">{projects[selectedProject].duration}</p>
                </div>
                {projects[selectedProject].collaborators && projects[selectedProject].collaborators!.length > 0 && (
                  <div>
                    <h4 className="text-cyber-magenta font-terminal text-[10px] tracking-widest mb-2">COLLABORATORS</h4>
                    <div className="space-y-2 font-sans">
                      {projects[selectedProject].collaborators!.map((collab, ci) => {
                        const avatarSrc = collab.avatar
                          || (collab.github
                            ? `https://github.com/${collab.github.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')}.png?size=80`
                            : undefined)

                        const profileUrl = collab.github
                          ? (collab.github.startsWith('http') ? collab.github : `https://github.com/${collab.github}`)
                          : undefined

                        const inner = (
                          <div className="flex items-center gap-2">
                            {avatarSrc ? (
                              <img
                                src={avatarSrc}
                                alt={collab.name}
                                className="w-6 h-6 rounded-none ring-1 ring-cyber-cyan/30 object-cover shrink-0"
                                loading="lazy"
                              />
                            ) : (
                              <span className="w-6 h-6 rounded-none bg-cyber-cyan/5 ring-1 ring-cyber-cyan/35 flex items-center justify-center text-[10px] font-bold text-cyber-cyan shrink-0">
                                {collab.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="text-slate-300 text-sm leading-tight truncate">{collab.name}</p>
                              <p className="text-cyber-cyan/60 text-[10px] font-terminal leading-tight truncate uppercase">{collab.role}</p>
                            </div>
                          </div>
                        )

                        return profileUrl ? (
                          <a
                            key={ci}
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-none px-1.5 py-1 -mx-1.5 transition-colors hover:bg-cyber-cyan/5"
                            title={`View ${collab.name} on GitHub`}
                          >
                            {inner}
                          </a>
                        ) : (
                          <div key={ci} className="px-1.5 py-1 -mx-1.5">
                            {inner}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="text-cyber-magenta font-terminal text-[10px] tracking-widest mb-2">TECHNOLOGIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {projects[selectedProject].technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-0.5 text-xs text-cyber-cyan font-terminal bg-cyber-cyan/5 border border-cyber-cyan/25 rounded-none"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {projects[selectedProject].gallery && projects[selectedProject].gallery!.length > 0 && (
                  <div>
                    <h4 className="text-cyber-magenta font-terminal text-[10px] tracking-widest mb-3">GALLERY</h4>
                    <ProjectGallery items={projects[selectedProject].gallery!} nested />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Portfolio
