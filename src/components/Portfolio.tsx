import { useState, useEffect, useRef } from 'react'
import projectsData from '../data/projects.json'

interface Project {
  title: string
  description: string
  fullDescription: string
  technologies: string[]
  image: string
  role: string
  duration: string
  documentationUrl?: string
}

const Portfolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const projects = projectsData as Project[]

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

  const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => (
    <div className="dashboard-card overflow-hidden">
      <div className="overflow-hidden rounded-lg mb-4">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{project.title}</h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 4).map((tech, techIndex) => (
          <span
            key={techIndex}
            className="px-2 py-0.5 text-xs text-slate-500 font-mono bg-white/5 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        {project.documentationUrl && (
          <a
            href={project.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 text-sm font-medium bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors text-center border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            Documentation
          </a>
        )}
        <button
          onClick={onClick}
          className={`py-2 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors ${project.documentationUrl ? 'flex-1' : 'w-full'}`}
        >
          View Details
        </button>
      </div>
    </div>
  )

  return (
    <section id="portfolio" className="py-16">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; PROJECTS</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">Portfolio</h2>

      <div className="relative">
        {/* Mobile: Simple 2D carousel */}
        <div className="md:hidden">
          <div className="flex flex-col items-center gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`w-full max-w-lg transition-all duration-300 ${
                  index === currentIndex
                    ? 'opacity-100'
                    : 'opacity-0 absolute pointer-events-none'
                }`}
              >
                <ProjectCard project={project} onClick={() => openModal(index)} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3D Carousel */}
        <div className="hidden md:block relative h-[480px]" style={{ perspective: '2000px' }}>
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspectiveOrigin: 'center center', transformStyle: 'preserve-3d' }}>
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
                  className={`absolute w-[380px] transition-all duration-700 ease-out cursor-pointer ${!isVisible ? 'hidden' : ''}`}
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

          <div className="absolute inset-x-0 -bottom-4 flex justify-center items-center gap-4 z-10">
            <button
              onClick={prevSlide}
              className="p-3 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Previous project"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="p-3 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Next project"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex justify-center items-center gap-4 mt-8">
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
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <h3 className="text-xl font-bold text-slate-50 mb-6">
                {projects[selectedProject].title}
              </h3>
              {projects[selectedProject].documentationUrl && (
                <a
                  href={projects[selectedProject].documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                >
                  View Documentation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Portfolio
