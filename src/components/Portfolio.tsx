import { useState, useEffect, useRef } from 'react'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import projectsData from '../data/projects.json'

const Portfolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const projects = projectsData

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
    // Reset styles when opening
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
      // Use double requestAnimationFrame to ensure styles are applied after render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (modalRef.current && contentRef.current) {
            modalRef.current.style.transition = 'opacity 0.3s ease-in-out'
            contentRef.current.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in'
            modalRef.current.style.opacity = '0'
            contentRef.current.style.transform = 'translateY(20px)'
            contentRef.current.style.opacity = '0'
          }
        })
      })
      
      setTimeout(() => {
        setSelectedProject(null)
        setIsClosing(false)
        document.body.style.overflow = 'unset'
      }, 300) // Match animation duration
    }
  }, [isClosing])

  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="gradient-text">Portfolio</span>
        </h2>

        {/* Carousel - 2D on Mobile, 3D on Desktop */}
        <div className="relative h-[500px] md:h-[500px] flex items-center justify-center md:perspective-[2000px]" style={{ perspectiveOrigin: 'center center' }}>
          
          {/* Mobile: Simple 2D Carousel */}
          <div className="md:hidden relative w-full h-full flex items-center justify-center px-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`absolute w-[90%] max-w-[350px] transition-all duration-500 ease-out ${
                  index === currentIndex 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-95 pointer-events-none z-0'
                }`}
              >
                <div className="card group">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-red-400">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-200 mb-4 text-sm text-justify line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs bg-red-900/30 text-red-300 rounded-full border border-red-800/50"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 text-xs bg-red-900/30 text-red-300 rounded-full border border-red-800/50">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openModal(index)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors active:scale-95"
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: 3D Carousel */}
          <div className="hidden md:block relative w-full h-full">
            <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {projects.map((project, index) => {
                // Calculate circular offset
                let offset = index - currentIndex
                
                // Wrap around for circular effect
                if (offset > projects.length / 2) {
                  offset -= projects.length
                } else if (offset < -projects.length / 2) {
                  offset += projects.length
                }
                
                const absOffset = Math.abs(offset)
                
                // Calculate transformations for 3D effect
                const translateX = offset * 320
                const translateZ = absOffset === 0 ? 0 : -absOffset * 200
                const rotateY = offset * 30
                const scale = absOffset === 0 ? 1 : Math.max(0.5, 0.8 - absOffset * 0.1)
                const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : absOffset > 2 ? 0 : 0.4
                const zIndex = projects.length - absOffset
                const isVisible = absOffset <= 2

                return (
                  <div
                    key={index}
                    className={`absolute w-[400px] transition-all duration-700 ease-out cursor-pointer ${!isVisible ? 'hidden' : ''}`}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      transformStyle: 'preserve-3d',
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: absOffset === 0 ? 'auto' : 'none',
                    }}
                    onClick={() => absOffset === 0 && openModal(index)}
                  >
                    <div className="card group hover:scale-105 transition-transform">
                      <div className="relative overflow-hidden rounded-lg mb-4">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {absOffset === 0 && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-lg font-semibold">Click for details</p>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-semibold mb-2 text-red-400">
                        {project.title}
                      </h3>
                      
                      {absOffset === 0 && (
                        <>
                          <p className="text-gray-200 mb-4 text-base text-justify">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 text-xs bg-red-900/30 text-red-300 rounded-full border border-red-800/50"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-3 py-1 text-xs bg-red-900/30 text-red-300 rounded-full border border-red-800/50">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-red-600/80 hover:bg-red-600 text-white p-3 rounded-full transition-colors z-20"
            aria-label="Previous project"
          >
            <HiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-red-600/80 hover:bg-red-600 text-white p-3 rounded-full transition-colors z-20"
            aria-label="Next project"
          >
            <HiChevronRight className="text-2xl" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-red-500 w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        {/* Modal */}
        {selectedProject !== null && (
          <div 
            ref={modalRef}
            className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ${isClosing ? '' : 'animate-fade-in'}`}
            style={{ pointerEvents: 'auto' }}
          >
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <div 
              ref={contentRef}
              className={`relative w-full max-w-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-red-900/30 ${isClosing ? '' : 'animate-slide-up'}`}
              style={{ 
                maxHeight: '90vh', 
                overflowY: 'auto', 
                overflowX: 'hidden', 
                pointerEvents: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Close button */}
              <button
                onClick={closeModal}
                className="sticky top-4 float-right mr-4 mt-4 text-gray-400 hover:text-white transition-colors z-10 bg-slate-800/80 rounded-full p-2"
              >
                <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Content */}
              <div className="relative p-4 sm:p-6 md:p-8 clear-both">
                <div className="mb-4 sm:mb-6">
                  <img
                    src={projects[selectedProject].image}
                    alt={projects[selectedProject].title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg"
                  />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
                  {projects[selectedProject].title}
                </h3>

                <div className="space-y-4 sm:space-y-5 mb-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-red-400 mb-2">Description</h4>
                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed text-justify">
                      {projects[selectedProject].fullDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-red-400 mb-2">Role</h4>
                    <p className="text-gray-200 text-sm sm:text-base text-justify">{projects[selectedProject].role}</p>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-red-400 mb-2">Duration</h4>
                    <p className="text-gray-200 text-sm sm:text-base text-justify">{projects[selectedProject].duration}</p>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-red-400 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {projects[selectedProject].technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-900/30 text-red-300 rounded-lg border border-red-800/50"
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
      </div>
    </section>
  )
}

export default Portfolio
