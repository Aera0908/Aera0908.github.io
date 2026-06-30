import { SECTION_PATHS } from '../hooks/useRoute'

interface SidebarProps {
  activeSection: string
  onNavigate: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { id: 'dashboard', label: 'DASHBOARD', path: '/' },
  { id: 'whoami', label: 'WHOAMI', path: '/whoami' },
  { id: 'edu', label: 'EDUCATION', path: '/edu' },
  { id: 'journey', label: 'JOURNEY', path: '/journey' },
  { id: 'certs', label: 'CERTIFICATIONS', path: '/certs' },
  { id: 'projects', label: 'PROJECTS', path: '/projects' },
  { id: 'designs', label: 'SYSTEM.DESIGN', path: '/designs' },
  { id: 'presence', label: 'PRESENCE', path: '/presence' },
  { id: 'comms', label: 'COMMS', path: '/comms' },
]

const Sidebar = ({ activeSection, onNavigate, isOpen, onClose }: SidebarProps) => {
  const handleNav = (e: React.MouseEvent, item: typeof navItems[number]) => {
    e.preventDefault()
    onNavigate(item.id)
    onClose()

    // Push the clean URL
    const sectionPath = SECTION_PATHS[item.id] || item.path
    history.pushState(null, '', sectionPath)

    // Scroll to the section
    const el = document.getElementById(item.id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (item.id === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-cyber-dark/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-cyber-gray border-r border-cyber-yellow/20
        flex flex-col shrink-0
        transform transition-transform duration-300 ease-out
        lg:fixed lg:top-8 lg:bottom-0 lg:inset-y-auto lg:h-[calc(100vh-2rem)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 pt-8 border-b border-cyber-yellow/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 border-2 border-cyber-cyan glow-cyber-cyan overflow-hidden flex-shrink-0 relative">
              <img
                src={`${import.meta.env.BASE_URL}ynte_pic.jpg`}
                alt="Aira Ynte"
                decoding="async"
                loading="eager"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 border border-cyber-yellow/30 pointer-events-none" />
            </div>
            <div>
              <p className="font-terminal font-bold text-cyber-yellow tracking-wider text-sm">AIRA YNTE</p>
              <p className="font-terminal text-xs text-cyber-cyan/70">COMP_ENG.sys</p>
            </div>
          </div>
          <p className="flex items-center gap-2 mt-4 font-terminal text-xs text-cyber-green">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green"></span>
            </span>
            SYSTEM_ONLINE // DECK_LOADED
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              onClick={(e) => handleNav(e, item)}
              className={`
                group flex items-center justify-between px-4 py-2.5 font-terminal text-sm transition-all duration-200 border-l-2 select-none
                ${activeSection === item.id 
                  ? 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow glow-cyber-yellow/10 font-bold' 
                  : 'border-transparent text-cyber-cyan/70 hover:text-cyber-cyan hover:bg-cyber-cyan/5'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span className={`text-[10px] ${activeSection === item.id ? 'text-cyber-yellow' : 'text-cyber-cyan/40 group-hover:text-cyber-cyan/70'}`}>
                  &gt;
                </span>
                {item.label}
              </span>
              <span className="font-mono text-[10px] text-cyber-magenta/40 group-hover:text-cyber-magenta/70 transition-colors">
                {item.path}
              </span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-cyber-yellow/20 bg-cyber-dark/45 font-terminal text-[11px] text-cyber-cyan/60 space-y-1">
          <div className="flex justify-between">
            <span>SYS.VERSION:</span>
            <span className="text-cyber-yellow">v2.0.26-EDG</span>
          </div>
          <div className="flex justify-between">
            <span>USER.ID:</span>
            <span className="text-cyber-magenta font-semibold">AIRA-8842</span>
          </div>
          <div className="h-1.5 w-full cyber-hazard-mini opacity-30 mt-3" />
        </div>
      </aside>
    </>
  )
}

export default Sidebar
