import { useEffect } from 'react'
import projectsData from '../data/projects.json'
import type { Project, ProjectSection } from '../data/projectTypes'
import { routeTo } from '../hooks/useRoute'
import { ProjectDiagram } from './diagrams/ProjectDiagrams'
import WebTierBadge from './WebTierBadge'
import { EngagementBadge, LimitedInfoBadge } from './ProjectTagBadges'
import ProjectGallery from './ProjectGallery'

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

interface ProjectDetailPageProps {
  projectId: string
}

const projects = projectsData as Project[]

const calloutStyles: Record<string, string> = {
  info: 'border-blue-500/40 bg-blue-500/5 text-slate-200',
  warn: 'border-amber-500/40 bg-amber-500/5 text-slate-200',
  note: 'border-white/10 bg-white/5 text-slate-300',
  success: 'border-emerald-500/40 bg-emerald-500/5 text-slate-200',
}

const calloutLabel: Record<string, string> = {
  info: 'INFO',
  warn: 'NOTE',
  note: 'NOTE',
  success: 'STATUS',
}

const Paragraphs = ({ text, items }: { text?: string; items?: string[] }) => {
  const parts = items && items.length > 0 ? items : text ? text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean) : []
  if (parts.length === 0) return null
  return (
    <div className="space-y-3">
      {parts.map((p, i) => (
        <p key={i} className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  )
}

const SectionBody = ({ section }: { section: ProjectSection }) => {
  switch (section.type) {
    case 'list':
      return (
        <ul className="space-y-2">
          {section.items?.map((item, j) => (
            <li key={j} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
              <span className="text-blue-400 font-mono mt-1">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'diagram':
      return (
        <div className="space-y-4">
          {section.diagramId && <ProjectDiagram id={section.diagramId} caption={section.caption} />}
          {(section.content || section.paragraphs) && (
            <Paragraphs text={section.content} items={section.paragraphs} />
          )}
        </div>
      )

    case 'callout': {
      const variant = section.variant || 'note'
      return (
        <div className={`rounded-lg border px-4 py-3 ${calloutStyles[variant]}`}>
          <p className="font-mono text-[10px] tracking-wider text-slate-400 mb-1.5">
            {calloutLabel[variant]}
          </p>
          <Paragraphs text={section.content} items={section.paragraphs} />
        </div>
      )
    }

    case 'stack':
      return (
        <div className="space-y-4">
          {(section.content || section.paragraphs) && (
            <Paragraphs text={section.content} items={section.paragraphs} />
          )}
          <div className="space-y-3">
            {section.groups?.map((g, gi) => (
              <div key={gi} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4 items-start">
                <p className="font-mono text-[10px] text-slate-500 tracking-wider pt-1">
                  {g.label.toUpperCase()}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-[11px] text-slate-300 font-mono bg-white/5 rounded border border-white/5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className="space-y-4">
          {(section.content || section.paragraphs) && (
            <Paragraphs text={section.content} items={section.paragraphs} />
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {section.stats?.map((s, si) => (
              <div key={si} className="rounded-lg border border-white/5 bg-white/5 p-3">
                <p className="font-mono text-[10px] text-slate-500 tracking-wider mb-1">
                  {s.label.toUpperCase()}
                </p>
                <p className="text-slate-100 text-lg font-semibold">{s.value}</p>
                {s.note && <p className="text-slate-500 text-[11px] mt-1 font-mono">{s.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )

    case 'steps':
      return (
        <ol className="space-y-3">
          {section.steps?.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono text-xs flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-slate-200 text-sm font-semibold leading-snug">{step.title}</p>
                {step.detail && (
                  <p className="text-slate-400 text-sm leading-relaxed mt-1">{step.detail}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )

    case 'video': {
      const youtubeId = section.videoUrl ? getYoutubeId(section.videoUrl) : null
      return (
        <div className="space-y-4">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={section.title || "Video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full absolute inset-0"
              />
            ) : section.videoUrl ? (
              <video
                src={section.videoUrl}
                controls
                playsInline
                className="w-full h-full"
              />
            ) : null}
          </div>
          {section.caption && (
            <p className="text-xs text-slate-400 font-mono italic text-center">{section.caption}</p>
          )}
          {(section.content || section.paragraphs) && (
            <Paragraphs text={section.content} items={section.paragraphs} />
          )}
        </div>
      )
    }

    default:
      return <Paragraphs text={section.content} items={section.paragraphs} />
  }
}

const NotFound = () => (
  <div className="min-h-screen bg-[#0d0d0d] bg-grid-pattern flex flex-col items-center justify-center px-4">
    <p className="font-mono text-sm text-slate-500 mb-3">&gt; 404 / PROJECT_NOT_FOUND</p>
    <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">Project not found</h1>
    <p className="text-slate-400 mb-6 text-center max-w-md">
      The project you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex gap-3">
      <button
        onClick={() => routeTo('/portfolio')}
        className="px-4 py-2 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
      >
        View Portfolio
      </button>
      <button
        onClick={() => routeTo('/')}
        className="px-4 py-2 text-sm font-medium bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
)

const ProjectDetailPage = ({ projectId }: ProjectDetailPageProps) => {
  const project = projects.find((p) => p.id === projectId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [projectId])

  if (!project) return <NotFound />

  const currentIndex = projects.findIndex((p) => p.id === project.id)
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  const hasLinks =
    project.websiteUrl ||
    project.links?.website ||
    project.links?.github ||
    project.links?.live

  return (
    <div className="min-h-screen bg-[#0d0d0d] bg-grid-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="font-mono text-xs text-slate-500 mb-6 flex items-center gap-1 flex-wrap">
          <button onClick={() => routeTo('/')} className="hover:text-blue-400 transition-colors">
            ~
          </button>
          <span>/</span>
          <button
            onClick={() => routeTo('/portfolio')}
            className="hover:text-blue-400 transition-colors"
          >
            portfolio
          </button>
          <span>/</span>
          <span className="text-slate-300">{project.id}</span>
        </nav>

        {/* Mobile: banner image + text below (readable, no tiny overlay text) */}
        <div className="mb-8 overflow-hidden rounded-xl border border-white/10 md:hidden">
          <img
            src={project.image}
            alt={`${project.title} cover`}
            decoding="async"
            loading="eager"
            className="h-48 w-full object-cover sm:h-56"
          />
          <div className="border-t border-white/10 bg-[#121212] p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {project.category && (
                <span className="rounded bg-blue-600/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white">
                  {project.category.toUpperCase()}
                </span>
              )}
              {project.webTier && <WebTierBadge tier={project.webTier} size="md" />}
              {project.engagement && (
                <EngagementBadge engagement={project.engagement} size="md" />
              )}
              {project.ndaConstrained && <LimitedInfoBadge active size="md" />}
              {project.status && (
                <span className="rounded border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[10px] text-slate-300">
                  {project.status}
                </span>
              )}
            </div>
            <h1 className="mb-3 text-xl font-bold leading-snug text-slate-50 sm:text-2xl">{project.title}</h1>
            <p className="text-sm leading-relaxed text-slate-400">{project.description}</p>
          </div>
        </div>

        {/* Desktop / tablet: gradient overlay on wide banner */}
        <div className="relative mb-8 hidden overflow-hidden rounded-xl bg-slate-900/40 md:block md:aspect-[16/7]">
          <img
            src={project.image}
            alt={project.title}
            decoding="async"
            loading="eager"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="mb-3 flex flex-wrap gap-2">
              {project.category && (
                <span className="rounded bg-blue-600/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white">
                  {project.category.toUpperCase()}
                </span>
              )}
              {project.webTier && <WebTierBadge tier={project.webTier} size="md" />}
              {project.engagement && (
                <EngagementBadge engagement={project.engagement} size="md" />
              )}
              {project.ndaConstrained && <LimitedInfoBadge active size="md" />}
              {project.status && (
                <span className="rounded border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[10px] text-slate-300">
                  {project.status}
                </span>
              )}
            </div>
            <h1 className="mb-2 max-w-3xl text-2xl font-bold text-slate-50 md:text-4xl">{project.title}</h1>
            <p className="max-w-3xl text-sm text-slate-300 md:text-base">{project.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {project.highlights && project.highlights.length > 0 && (
              <section className="dashboard-card">
                <h2 className="font-mono text-xs text-slate-500 mb-3 tracking-wider">
                  &gt; KEY HIGHLIGHTS
                </h2>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                      <span className="text-blue-400 font-mono mt-1">›</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="dashboard-card">
              <h2 className="font-mono text-xs text-slate-500 mb-3 tracking-wider">
                &gt; ABOUT THE PROJECT
              </h2>
              <Paragraphs text={project.fullDescription} />
            </section>

            {project.sections?.map((section, i) => (
              <section key={i} className="dashboard-card">
                <h2 className="font-mono text-xs text-slate-500 mb-4 tracking-wider">
                  &gt; {section.title.toUpperCase()}
                </h2>
                <SectionBody section={section} />
              </section>
            ))}

            {project.gallery && project.gallery.length > 0 && (
              <section className="dashboard-card">
                <h2 className="font-mono text-xs text-slate-500 mb-4 tracking-wider">
                  &gt; GALLERY
                </h2>
                <ProjectGallery items={project.gallery} />
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="dashboard-card space-y-4 lg:sticky lg:top-16">
              <div>
                <h3 className="font-mono text-[10px] text-slate-500 tracking-wider mb-1">
                  ROLE
                </h3>
                <p className="text-slate-200 text-sm">{project.role}</p>
              </div>

              <div>
                <h3 className="font-mono text-[10px] text-slate-500 tracking-wider mb-1">
                  DURATION
                </h3>
                <p className="text-slate-200 text-sm">{project.duration}</p>
              </div>

              {project.webTier && (
                <div>
                  <h3 className="font-mono text-[10px] text-slate-500 tracking-wider mb-2">
                    WEB TIER
                  </h3>
                  <WebTierBadge tier={project.webTier} size="md" />
                </div>
              )}

              {(project.engagement || project.ndaConstrained) && (
                <div>
                  <h3 className="font-mono text-[10px] text-slate-500 tracking-wider mb-2">
                    ENGAGEMENT
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.engagement && (
                      <EngagementBadge engagement={project.engagement} size="md" />
                    )}
                    {project.ndaConstrained && <LimitedInfoBadge active size="md" />}
                  </div>
                  {project.ndaConstrained && (
                    <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
                      Public information for this project is limited per client contract. Some screenshots, code, and internal details are withheld.
                    </p>
                  )}
                </div>
              )}

              {project.category && (
                <div>
                  <h3 className="font-mono text-[10px] text-slate-500 tracking-wider mb-1">
                    CATEGORY
                  </h3>
                  <p className="text-slate-200 text-sm">{project.category}</p>
                </div>
              )}

              {project.status && (
                <div>
                  <h3 className="font-mono text-[10px] text-slate-500 tracking-wider mb-1">
                    STATUS
                  </h3>
                  <p className="text-slate-200 text-sm">{project.status}</p>
                </div>
              )}

              <div>
                <h3 className="font-mono text-[10px] text-slate-500 tracking-wider mb-2">
                  TECHNOLOGIES
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] text-slate-300 font-mono bg-white/5 rounded border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {hasLinks && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {(project.websiteUrl || project.links?.website) && (
                    <a
                      href={project.websiteUrl || project.links?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                    >
                      <span>Website</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-sm font-medium bg-white/5 text-slate-200 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <span>GitHub</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-sm font-medium bg-white/5 text-slate-200 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <span>Live Demo</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => routeTo('/portfolio')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-mono text-slate-400 bg-white/5 rounded-lg hover:bg-white/10 hover:text-slate-200 transition-colors border border-white/5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              All projects
            </button>
          </aside>
        </div>

        <nav className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <button
              onClick={() => routeTo(`/portfolio/${prev.id}`)}
              className="dashboard-card text-left group"
            >
              <p className="font-mono text-[10px] text-slate-500 mb-1">‹ PREVIOUS</p>
              <p className="text-slate-200 font-semibold group-hover:text-blue-400 transition-colors">
                {prev.title}
              </p>
            </button>
          ) : (
            <div />
          )}
          {next ? (
            <button
              onClick={() => routeTo(`/portfolio/${next.id}`)}
              className="dashboard-card text-right group"
            >
              <p className="font-mono text-[10px] text-slate-500 mb-1">NEXT ›</p>
              <p className="text-slate-200 font-semibold group-hover:text-blue-400 transition-colors">
                {next.title}
              </p>
            </button>
          ) : (
            <div />
          )}
        </nav>

        <footer className="mt-12 pt-8 border-t border-white/5 font-mono text-center text-xs text-slate-500">
          {new Date().getFullYear()} Aira Ynte
        </footer>
      </div>
    </div>
  )
}

export default ProjectDetailPage
