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
  info: 'border-cyber-cyan/35 bg-cyber-cyan/5 text-slate-200',
  warn: 'border-cyber-magenta/35 bg-cyber-magenta/5 text-slate-200',
  note: 'border-cyber-yellow/35 bg-cyber-yellow/5 text-slate-300',
  success: 'border-cyber-green/35 bg-cyber-green/5 text-slate-200',
}

const calloutLabel: Record<string, string> = {
  info: 'INFO // SYSTEM_MESSAGE',
  warn: 'WARNING // EXCEPTION_FLAG',
  note: 'NOTE // SYSTEM_LOG',
  success: 'SUCCESS // LOG_SUCCESS',
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
              <span className="text-cyber-cyan font-terminal mt-1">&gt;</span>
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
        <div className={`rounded-none border px-4 py-3 ${calloutStyles[variant]}`}>
          <p className="font-terminal text-[10px] tracking-widest text-slate-400 mb-1.5 font-bold uppercase">
            &gt; {calloutLabel[variant]}
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
                <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest pt-1">
                  {g.label.toUpperCase()}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-[11px] text-cyber-cyan font-terminal bg-cyber-dark rounded-none border border-cyber-cyan/35"
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
              <div key={si} className="rounded-none border border-cyber-cyan/35 bg-cyber-dark/65 p-3 hover:border-cyber-yellow transition-colors duration-300">
                <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-1">
                  {s.label.toUpperCase()}
                </p>
                <p className="text-cyber-yellow text-lg font-bold font-terminal">{s.value}</p>
                {s.note && <p className="text-cyber-cyan/70 text-[11px] mt-1 font-terminal">{s.note}</p>}
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
              <span className="shrink-0 w-7 h-7 rounded-none bg-cyber-cyan/15 border border-cyber-cyan/35 text-cyber-cyan font-terminal text-xs flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-slate-100 text-sm font-bold leading-snug font-terminal tracking-wide">{step.title}</p>
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
          <div className="relative w-full aspect-video rounded-none overflow-hidden border border-cyber-cyan/35 bg-black">
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
            <p className="text-xs text-cyber-magenta font-terminal italic text-center">{section.caption}</p>
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
  <div className="min-h-screen bg-cyber-dark bg-cyber-grid flex flex-col items-center justify-center px-4">
    <p className="font-terminal text-sm text-cyber-magenta mb-3 tracking-widest">&gt; 404 / PROJECT_NOT_FOUND</p>
    <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4 tracking-wide cyber-glitch">Project not found</h1>
    <p className="text-slate-400 mb-6 text-center max-w-md">
      The project you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex gap-3">
      <button
        onClick={() => routeTo('/portfolio')}
        className="cyber-btn-primary py-2 px-4 text-xs font-bold rounded-none"
      >
        View Portfolio
      </button>
      <button
        onClick={() => routeTo('/')}
        className="cyber-btn-outline py-2 px-4 text-xs font-semibold rounded-none border border-cyber-cyan/35 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-yellow hover:text-cyber-yellow"
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
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="font-terminal text-xs text-cyber-cyan/60 mb-6 flex items-center gap-1 flex-wrap">
          <button onClick={() => routeTo('/')} className="hover:text-cyber-yellow transition-colors">
            ~
          </button>
          <span>/</span>
          <button
            onClick={() => routeTo('/portfolio')}
            className="hover:text-cyber-yellow transition-colors"
          >
            portfolio
          </button>
          <span>/</span>
          <span className="text-cyber-yellow">{project.id}</span>
        </nav>

        {/* Mobile: banner image + text below (readable, no tiny overlay text) */}
        <div className="mb-8 overflow-hidden rounded-none border border-cyber-cyan/35 md:hidden bg-cyber-dark">
          <img
            src={project.image}
            alt={`${project.title} cover`}
            decoding="async"
            loading="eager"
            className="h-48 w-full object-cover sm:h-56"
          />
          <div className="border-t border-cyber-cyan/35 bg-cyber-gray p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {project.category && (
                <span className="rounded-none bg-cyber-cyan/15 border border-cyber-cyan/35 px-2.5 py-1 font-terminal text-[10px] tracking-widest text-cyber-cyan">
                  {project.category.toUpperCase()}
                </span>
              )}
              {project.webTier && <WebTierBadge tier={project.webTier} size="md" />}
              {project.engagement && (
                <EngagementBadge engagement={project.engagement} size="md" />
              )}
              {project.ndaConstrained && <LimitedInfoBadge active size="md" />}
              {project.status && (
                <span className="rounded-none border border-cyber-yellow/30 bg-black/70 px-2.5 py-1 font-terminal text-[10px] text-cyber-yellow">
                  {project.status.toUpperCase()}
                </span>
              )}
            </div>
            <h1 className="mb-3 text-xl font-bold leading-snug text-slate-50 sm:text-2xl font-cyber tracking-wide">{project.title}</h1>
            <p className="text-sm leading-relaxed text-slate-400">{project.description}</p>
          </div>
        </div>

        {/* Desktop / tablet: gradient overlay on wide banner */}
        <div className="relative mb-8 hidden overflow-hidden rounded-none border border-cyber-cyan/35 bg-cyber-dark md:block md:aspect-[16/7]">
          <img
            src={project.image}
            alt={project.title}
            decoding="async"
            loading="eager"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="mb-3 flex flex-wrap gap-2">
              {project.category && (
                <span className="rounded-none bg-cyber-cyan/15 border border-cyber-cyan/35 px-2.5 py-1 font-terminal text-[10px] tracking-widest text-cyber-cyan">
                  {project.category.toUpperCase()}
                </span>
              )}
              {project.webTier && <WebTierBadge tier={project.webTier} size="md" />}
              {project.engagement && (
                <EngagementBadge engagement={project.engagement} size="md" />
              )}
              {project.ndaConstrained && <LimitedInfoBadge active size="md" />}
              {project.status && (
                <span className="rounded-none border border-cyber-yellow/30 bg-black/70 px-2.5 py-1 font-terminal text-[10px] text-cyber-yellow">
                  {project.status.toUpperCase()}
                </span>
              )}
            </div>
            <h1 className="mb-2 max-w-3xl text-2xl font-bold text-slate-50 md:text-4xl font-cyber tracking-wide">{project.title}</h1>
            <p className="max-w-3xl text-sm text-slate-300 md:text-base">{project.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {project.highlights && project.highlights.length > 0 && (
              <section className="cyber-card cyber-corner-brackets">
                <h2 className="font-terminal text-xs text-cyber-magenta mb-3 tracking-widest">
                  &gt; KEY HIGHLIGHTS
                </h2>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                      <span className="text-cyber-yellow font-terminal mt-1">&gt;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="cyber-card cyber-corner-brackets">
              <h2 className="font-terminal text-xs text-cyber-magenta mb-3 tracking-widest">
                &gt; ABOUT THE PROJECT
              </h2>
              <Paragraphs text={project.fullDescription} />
            </section>

            {project.sections?.map((section, i) => (
              <section key={i} className="cyber-card cyber-corner-brackets">
                <h2 className="font-terminal text-xs text-cyber-magenta mb-4 tracking-widest">
                  &gt; {section.title.toUpperCase()}
                </h2>
                <SectionBody section={section} />
              </section>
            ))}

            {project.gallery && project.gallery.length > 0 && (
              <section className="cyber-card cyber-corner-brackets">
                <h2 className="font-terminal text-xs text-cyber-magenta mb-4 tracking-widest">
                  &gt; GALLERY
                </h2>
                <ProjectGallery items={project.gallery} />
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="cyber-card border-cyber-cyan/35 space-y-4 lg:sticky lg:top-16">
              <div>
                <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-1">
                  ROLE
                </h3>
                <p className="text-slate-200 text-sm">{project.role}</p>
              </div>

              <div>
                <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-1">
                  DURATION
                </h3>
                <p className="text-slate-200 text-sm">{project.duration}</p>
              </div>

              {project.collaborators && project.collaborators.length > 0 && (
                <div>
                  <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-2">
                    COLLABORATORS
                  </h3>
                  <div className="space-y-2.5">
                    {project.collaborators.map((collab, ci) => {
                      const avatarSrc = collab.avatar
                        || (collab.github
                          ? `https://github.com/${collab.github.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')}.png?size=80`
                          : undefined)

                      const profileUrl = collab.github
                        ? (collab.github.startsWith('http') ? collab.github : `https://github.com/${collab.github}`)
                        : undefined

                      const inner = (
                        <div className="flex items-center gap-2.5">
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={collab.name}
                              className="w-7 h-7 rounded-none border border-cyber-cyan/35 object-cover shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <span className="w-7 h-7 rounded-none bg-cyber-cyan/15 border border-cyber-cyan/35 flex items-center justify-center text-[11px] font-bold text-cyber-cyan shrink-0 font-terminal">
                              {collab.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="text-slate-200 text-sm font-medium leading-tight truncate">
                              {collab.name}
                            </p>
                            <p className="text-cyber-cyan/75 text-[11px] font-terminal leading-tight truncate">
                              {collab.role}
                            </p>
                          </div>
                        </div>
                      )

                      return profileUrl ? (
                        <a
                          key={ci}
                          href={profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-none px-2 py-1.5 -mx-2 border border-transparent hover:border-cyber-yellow/45 hover:bg-cyber-yellow/5 transition-colors group"
                          title={`View ${collab.name} on GitHub`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div key={ci} className="rounded-none px-2 py-1.5 -mx-2">
                          {inner}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {project.webTier && (
                <div>
                  <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-2">
                    WEB TIER
                  </h3>
                  <WebTierBadge tier={project.webTier} size="md" />
                </div>
              )}

              {(project.engagement || project.ndaConstrained) && (
                <div>
                  <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-2">
                    ENGAGEMENT
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.engagement && (
                      <EngagementBadge engagement={project.engagement} size="md" />
                    )}
                    {project.ndaConstrained && <LimitedInfoBadge active size="md" />}
                  </div>
                  {project.ndaConstrained && (
                    <p className="text-cyber-cyan/70 text-[11px] mt-2 leading-relaxed font-terminal">
                      Public information for this project is limited per client contract. Some screenshots, code, and internal details are withheld.
                    </p>
                  )}
                </div>
              )}

              {project.category && (
                <div>
                  <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-1">
                    CATEGORY
                  </h3>
                  <p className="text-slate-200 text-sm">{project.category}</p>
                </div>
              )}

              {project.status && (
                <div>
                  <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-1">
                    STATUS
                  </h3>
                  <p className="text-slate-200 text-sm">{project.status}</p>
                </div>
              )}

              <div>
                <h3 className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-2">
                  TECHNOLOGIES
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] text-cyber-cyan font-terminal bg-cyber-dark border border-cyber-cyan/30 rounded-none"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {hasLinks && (
                <div className="space-y-2 pt-2 border-t border-cyber-yellow/15">
                  {(project.websiteUrl || project.links?.website) && (
                    <a
                      href={project.websiteUrl || project.links?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-btn-secondary flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-none"
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
                      className="cyber-btn-outline flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-none border border-cyber-cyan/35 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-yellow hover:text-cyber-yellow"
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
                      className="cyber-btn-outline flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-none border border-cyber-cyan/35 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-yellow hover:text-cyber-yellow"
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
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-terminal text-cyber-cyan bg-cyber-cyan/5 rounded-none hover:bg-cyber-cyan/15 hover:text-cyber-yellow transition-colors border border-cyber-cyan/35 hover:border-cyber-yellow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              All projects
            </button>
          </aside>
        </div>

        <nav className="mt-12 pt-8 border-t border-cyber-yellow/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <button
              onClick={() => routeTo(`/portfolio/${prev.id}`)}
              className="cyber-card cyber-corner-brackets text-left group"
            >
              <p className="font-terminal text-[10px] text-cyber-magenta mb-1 tracking-widest">&lt; PREVIOUS</p>
              <p className="text-slate-100 font-bold font-cyber tracking-wide group-hover:text-cyber-yellow transition-colors">
                {prev.title}
              </p>
            </button>
          ) : (
            <div />
          )}
          {next ? (
            <button
              onClick={() => routeTo(`/portfolio/${next.id}`)}
              className="cyber-card cyber-corner-brackets text-right group"
            >
              <p className="font-terminal text-[10px] text-cyber-magenta mb-1 tracking-widest">NEXT &gt;</p>
              <p className="text-slate-100 font-bold font-cyber tracking-wide group-hover:text-cyber-yellow transition-colors">
                {next.title}
              </p>
            </button>
          ) : (
            <div />
          )}
        </nav>

        <footer className="mt-12 pt-8 border-t border-cyber-yellow/15 font-terminal text-center text-xs text-cyber-cyan/50 tracking-widest uppercase">
          // {new Date().getFullYear()} Aira Ynte — Portfolio Archive // SYSTEM_STABLE
        </footer>
      </div>
    </div>
  )
}

export default ProjectDetailPage
