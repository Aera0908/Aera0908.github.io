import { useState, useEffect, useRef } from 'react'
import projectsData from '../data/projects.json'
import type { Project } from '../data/projectTypes'
import { routeTo } from '../hooks/useHashRoute'
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
  const featured = allProjects.filter((p) => p.featured)
  const projects = featured.length > 0 ? featured : allProjects

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
        className="dashboard-card flex h-[472px] w-full max-w-[380px] flex-col overflow-hidden md:h-[472px] md:w-[380px]"
      >
        <div className="relative mb-3 shrink-0 overflow-hidden rounded-lg">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-36 w-full object-cover md:h-40"
          />
        </div>
        <h3 className="mb-2 line-clamp-2 shrink-0 text-base font-semibold leading-snug text-slate-100 md:text-lg">
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
              className="mt-1 text-left text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
            >
              ... see more
            </button>
          )}
        </div>
        <div className="mb-3 flex max-h-[24px] shrink-0 flex-wrap gap-2 overflow-hidden">
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-500 md:text-xs"
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
              className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-center text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
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
              className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-center text-sm font-medium text-slate-300 transition-colors hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
              title="Open source repository"
            >
              Repo
            </a>
          )}
          <button
            type="button"
            onClick={onClick}
            className={`rounded-lg bg-blue-600/20 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-600/30 ${project.links?.live || project.websiteUrl || project.links?.github ? 'flex-1 px-3' : 'w-full'}`}
          >
            Details
          </button>
        </div>
      </div>
    )
  }

  return (
    <section id="portfolio" className="py-16">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; PROJECTS / BEST_WORK</p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2">Portfolio</h2>
          <p className="text-slate-400 text-sm max-w-xl">
            A curated carousel of my best projects. Open the full archive for every project
            on file.
          </p>
        </div>
        <button
          onClick={() => routeTo('/portfolio')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/20"
        >
          View full archive
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspectiveOrigin: 'center center', transformStyle: 'preserve-3d' }}
            >
              {projects.map((project, index) => {
                let offset = index - currentIndex
                if (offset > projects.length / 2) offset -= projects.length
                else if (offset < -projects.length / 2) offset += projects.length

                const absOffset = Math.abs(offset)
                const translateX = offset * 320
                const translateZ = absOffset === 0 ? 0 : -absOffset * 180
                const rotateY = offset * 25
                const scale = absOffset === 0 ? 1 : Math.max(0.55, 0.85 - absOffset * 0.12)
                const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : absOffset > 2 ? 0 : 0.45
                const zIndex = projects.length - absOffset
                const isVisible = absOffset <= 2

                return (
                  <div
                    key={index}
                    className={`absolute w-[380px] cursor-pointer transition-all duration-700 ease-out ${!isVisible ? 'hidden' : ''}`}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
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
          </div>

          <div className="flex items-center justify-center gap-4 pb-2 pt-10">
            <button
              type="button"
              onClick={prevSlide}
              className="rounded-lg p-3 text-slate-400 transition-colors hover:bg-white/5 hover:text-blue-400"
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
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-blue-500'
                      : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextSlide}
              className="rounded-lg p-3 text-slate-400 transition-colors hover:bg-white/5 hover:text-blue-400"
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
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
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
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-blue-500 w-8'
                    : 'bg-slate-600 w-2 hover:bg-slate-500'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div
            ref={contentRef}
            className="relative w-full max-w-2xl dashboard-card overflow-hidden"
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
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white z-10 rounded"
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
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <h3 className="text-xl font-bold text-slate-50 mb-6">
                {projects[selectedProject].title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => goToCaseStudy(projects[selectedProject].id)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                >
                  View Full Case Study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {projects[selectedProject].websiteUrl && (
                  <a
                    href={projects[selectedProject].websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                  >
                    Website
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-slate-500 font-mono text-xs mb-2">DESCRIPTION</h4>
                  <p className="text-slate-300 leading-relaxed">{projects[selectedProject].fullDescription}</p>
                </div>
                <div>
                  <h4 className="text-slate-500 font-mono text-xs mb-2">ROLE</h4>
                  <p className="text-slate-300">{projects[selectedProject].role}</p>
                </div>
                <div>
                  <h4 className="text-slate-500 font-mono text-xs mb-2">DURATION</h4>
                  <p className="text-slate-300">{projects[selectedProject].duration}</p>
                </div>
                <div>
                  <h4 className="text-slate-500 font-mono text-xs mb-2">TECHNOLOGIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {projects[selectedProject].technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-0.5 text-xs text-slate-400 font-mono bg-white/5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {projects[selectedProject].gallery && projects[selectedProject].gallery!.length > 0 && (
                  <div>
                    <h4 className="text-slate-500 font-mono text-xs mb-3">GALLERY</h4>
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
