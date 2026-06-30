import { useState, useEffect, useRef } from 'react'
import HeaderBar from './components/HeaderBar'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Journey from './components/Journey'
import Certifications from './components/Certifications'
import Portfolio from './components/Portfolio'
import SystemDesign from './components/SystemDesign'
import DeveloperPresence from './components/DeveloperPresence'
import Contact from './components/Contact'
import FloatingDownloadButton from './components/FloatingDownloadButton'
import PortfolioPage from './components/PortfolioPage'
import ProjectDetailPage from './components/ProjectDetailPage'
import CertificatesPage from './components/CertificatesPage'
import { useRoute, SECTION_PATHS, PATH_TO_SECTION, replaceUrl } from './hooks/useRoute'
import projectsData from './data/projects.json'
import GridGlow from './components/GridGlow'

const SECTION_IDS = [
  'dashboard',
  'whoami',
  'edu',
  'journey',
  'certs',
  'projects',
  'designs',
  'presence',
  'comms',
] as const

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { route } = useRoute()
  const hasScrolledOnMount = useRef(false)

  const isPortfolioRoute =
    route.segments[0] === 'portfolio' || route.path === '/portfolio'
  const isProjectDetail = isPortfolioRoute && route.segments.length >= 2
  const projectId = isProjectDetail ? route.segments[1] : null

  const isCertificatesRoute =
    route.segments[0] === 'certificates' || route.path === '/certificates'

  // Deep-link: scroll to section on initial page load
  useEffect(() => {
    if (isPortfolioRoute || isCertificatesRoute || hasScrolledOnMount.current) return
    hasScrolledOnMount.current = true

    // Disable browser automatic scroll restoration to ensure clean animations from top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const sectionId = PATH_TO_SECTION[route.path]
    if (sectionId && sectionId !== 'dashboard') {
      // Small delay to ensure the DOM is ready
      requestAnimationFrame(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      })
    } else {
      // If root/dashboard, explicitly scroll to the very top
      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll-spy: detect which section is in view and update URL
  useEffect(() => {
    if (isPortfolioRoute || isCertificatesRoute) return

    const handleScroll = () => {
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i])
        if (el && el.getBoundingClientRect().top < 200) {
          const newSection = SECTION_IDS[i]
          setActiveSection(newSection)
          // Sync URL with visible section
          const sectionPath = SECTION_PATHS[newSection]
          if (sectionPath) {
            replaceUrl(sectionPath)
          }
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isPortfolioRoute, isCertificatesRoute])

  // Dynamic SEO metadata updates (document title, meta description, canonical, and project structured data)
  useEffect(() => {
    let title = 'Aira Ynte - Web Resume'
    let description = 'Interactive web resume and portfolio of Aira Ynte, a software and hardware engineer specializing in digital systems, IC design, full-stack web development, and AI integration.'

    if (isProjectDetail && projectId) {
      const project = projectsData.find((p) => p.id === projectId)
      if (project) {
        title = `${project.title} | Aira Ynte Case Study`
        description = `${project.description} Detailed software architecture, technologies, and achievements.`
      }
    } else if (isCertificatesRoute) {
      title = 'Certifications Portfolio | Aira Ynte'
      description = 'Browse the certifications, coursework, and technical training completed by Aira Ynte.'
    } else if (isPortfolioRoute) {
      title = 'Portfolio Archive | Aira Ynte'
      description = 'Browse the complete archive of full-stack engineering, Web3, and embedded IoT projects developed by Aira Ynte.'
    } else {
      // Main dashboard sections
      const sectionId = PATH_TO_SECTION[route.path]
      if (sectionId && sectionId !== 'dashboard') {
        const readableSection = sectionId === 'whoami' ? 'About' : sectionId === 'edu' ? 'Education' : sectionId === 'journey' ? 'Journey' : sectionId === 'certs' ? 'Certifications' : sectionId === 'projects' ? 'Portfolio' : sectionId === 'designs' ? 'System Designs' : sectionId === 'presence' ? 'Activity' : sectionId === 'comms' ? 'Contact' : '';
        if (readableSection) {
          title = `${readableSection} | Aira Ynte - Web Resume`
        }
      }
    }

    document.title = title
    
    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', description)
    }

    // Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    if (canonicalLink) {
      const origin = window.location.origin
      const base = import.meta.env.BASE_URL.replace(/\/$/, '')
      canonicalLink.setAttribute('href', `${origin}${base}${route.path}`)
    }

    // Inject JSON-LD structured data for project case studies
    let ldScript = document.getElementById('project-ld-json')
    if (ldScript) {
      ldScript.remove()
    }

    if (isProjectDetail && projectId) {
      const project = projectsData.find((p) => p.id === projectId)
      if (project) {
        ldScript = document.createElement('script')
        ldScript.id = 'project-ld-json'
        ldScript.setAttribute('type', 'application/ld+json')
        ldScript.innerHTML = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": project.title,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "description": project.description,
          "author": {
            "@type": "Person",
            "name": "Aira Josh Ynte"
          },
          "softwareRequirements": project.technologies.join(', ')
        })
        document.head.appendChild(ldScript)
      }
    }
  }, [route.path, isPortfolioRoute, isProjectDetail, projectId])

  return (
    <div className="min-h-screen bg-cyber-dark bg-cyber-grid flex flex-col overflow-x-hidden pt-8 relative">
      {/* Dynamic Background Glow Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyber-cyan/3 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyber-magenta/3 blur-[120px] animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-cyber-yellow/2 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        <GridGlow />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {isProjectDetail && projectId ? (
          <ProjectDetailPage projectId={projectId} />
        ) : isCertificatesRoute ? (
          <CertificatesPage />
        ) : isPortfolioRoute ? (
          <PortfolioPage />
        ) : (
          <>
            <HeaderBar />
            
            <div className="flex flex-1 relative min-w-0">
              <div className="lg:hidden fixed top-8 left-0 right-0 h-12 bg-cyber-gray/95 backdrop-blur border-b border-cyber-yellow/20 z-30 flex items-center px-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-cyber-cyan hover:text-cyber-yellow transition-colors"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <span className="font-terminal text-sm text-cyber-yellow ml-2 tracking-wider">AIRA.SYS</span>
              </div>

              <Sidebar 
                activeSection={activeSection} 
                onNavigate={setActiveSection}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              <main className="flex-1 pt-20 lg:pt-0 min-h-screen min-w-0 w-full max-w-full overflow-x-hidden lg:ml-64">
                <Hero />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0 box-border">
                  <About />
                  <Education />
                  <Journey />
                  <Certifications />
                  <Portfolio />
                  <SystemDesign />
                  <DeveloperPresence />
                  <Contact />
                </div>

              <footer className="py-8 px-4 border-t border-cyber-yellow/10 bg-cyber-gray/30">
                <p className="font-terminal text-center text-xs text-cyber-cyan/50 tracking-wider">
                  // {new Date().getFullYear()} AIRA YNTE // SYSTEM ONLINE
                </p>
              </footer>
              </main>
            </div>

            <FloatingDownloadButton />
          </>
        )}
      </div>
    </div>
  )
}

export default App
