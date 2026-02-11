interface SidebarProps {
  activeSection: string
  onNavigate: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { id: 'home', label: 'DASHBOARD', path: '/' },
  { id: 'about', label: 'WHOAMI', path: '/whoami' },
  { id: 'education', label: 'EDUCATION', path: '/edu' },
  { id: 'skills', label: 'MODULES', path: '/modules' },
  { id: 'certifications', label: 'CERTIFICATIONS', path: '/certs' },
  { id: 'portfolio', label: 'PROJECTS', path: '/projects' },
  { id: 'contact', label: 'COMMS', path: '/comms' },
]

const Sidebar = ({ activeSection, onNavigate, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky lg:top-8 lg:h-[calc(100vh-2rem)] inset-y-0 left-0 z-50
        w-64 bg-[#141414] border-r border-white/5
        flex flex-col shrink-0
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 glow-blue">
              <img
                src={`${import.meta.env.BASE_URL}ynte_pic.jpg`}
                alt="Aira Josh Ynte"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm">AIRA</p>
              <p className="font-mono text-xs text-slate-500">COMP_ENG.sys</p>
            </div>
          </div>
          <p className="flex items-center gap-2 mt-3 font-mono text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            SYSTEM ONLINE
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => {
                onNavigate(item.id)
                onClose()
              }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors border-l-2
                ${activeSection === item.id 
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }
              `}
            >
              <span className="text-slate-500">{item.path}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 font-mono text-xs text-slate-500">
          <p>v.2.0.26 RELEASE</p>
          <p>ID: AIRA-8842</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
