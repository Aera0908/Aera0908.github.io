import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudy, CASE_STUDIES } from "@/lib/case-studies";
import { CyberLines } from "@/components/ui/CyberLines";
import { ProjectDiagramsSection } from "@/components/ui/ProjectDiagrams";
import { CaseStudyGallery } from "@/components/ui/CaseStudyGallery";
import { CaseStudyBackButton } from "@/components/ui/CaseStudyBackButton";
import { CaseEnter } from "@/components/ui/CaseEnter";
import { CaseStudyDownloads } from "@/components/ui/CaseStudyDownloads";
import { CaseStudyCollaborators } from "@/components/ui/CaseStudyCollaborators";
import { SearchConsoleTelemetry } from "@/components/ui/SearchConsoleTelemetry";

export async function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  return {
    title: cs ? `${cs.name} - Case File // Aira Ynte` : "Case File",
    description: cs?.summary,
  };
}

/**
 * Full-view case study - flat editorial dossier over the solid world
 * background. Vault shape family (.clip-tab-tl) carries over here.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const liveLink = cs.links?.find(
    (l) => !l.href.includes("github.com") && !l.href.includes("youtube.com")
  );
  const githubLink = cs.links?.find((l) => l.href.includes("github.com"));

  return (
    <main className="relative min-h-screen bg-world px-6 py-28 text-periwinkle md:px-16">
      <CaseEnter />
      <CyberLines />

      {/* dossier header */}
      <div className="relative mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <CaseStudyBackButton />
          {liveLink && (
            <a
              href={liveLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xs border border-signal bg-signal px-3.5 py-1.5 font-mono text-[10px] md:text-xs font-black uppercase tracking-wider text-[#0c0d12] shadow-[0_0_20px_rgba(252,238,10,0.4)] transition-all hover:scale-105 hover:bg-white cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-[#0c0d12] animate-ping" />
              <span>LAUNCH LIVE APP ↗</span>
            </a>
          )}
        </div>

        <p className="t-micro mb-3 text-periwinkle/50">
          CASE FILE // {cs.category}
        </p>
        <h1 className="t-h2 mb-3 text-paper">
          {cs.name}
          <span className="text-iris-bright">.</span>
        </h1>

        {cs.badge && (
          <div className="mb-6 animate-badge-entry">
            <span className="text-[10px] font-bold font-mono tracking-widest text-ink bg-iris px-2.5 py-1 uppercase rounded-sm">
              {cs.badge}
            </span>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-x-10 gap-y-2">
          <span className="t-micro text-periwinkle/60">
            ROLE // <span className="text-periwinkle">{cs.role.toUpperCase()}</span>
          </span>
          <span className="t-micro text-periwinkle/60">
            TIMELINE // <span className="text-periwinkle">{cs.duration}</span>
          </span>
          <span className="t-micro text-periwinkle/60">
            STATUS // <span className="text-iris-bright">{cs.status}</span>
          </span>
        </div>

        {/* Prominent High-Visibility Action Bar for Live Web Apps & Repositories */}
        {((cs.links && cs.links.length > 0) || (cs.downloads && cs.downloads.length > 0)) && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {liveLink && (
              <a
                href={liveLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2.5 rounded-sm bg-signal px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#0c0d12] shadow-[0_0_25px_rgba(252,238,10,0.45)] transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] cursor-pointer"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0c0d12] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0c0d12]" />
                </span>
                <span>LAUNCH LIVE WEB APP</span>
                <span className="text-[#0c0d12]/70 font-bold">[{liveLink.label}]</span>
                <span className="font-bold text-sm group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            )}

            {githubLink && (
              <a
                href={githubLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm border border-periwinkle/30 bg-world-2/80 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-periwinkle transition-all duration-200 hover:border-iris-bright hover:bg-world-2 hover:text-paper hover:scale-[1.02] cursor-pointer"
              >
                <svg className="h-4 w-4 shrink-0 text-periwinkle/70 group-hover:text-signal transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GITHUB REPOSITORY</span>
                <span className="text-periwinkle/50 group-hover:text-signal transition-colors">↗</span>
              </a>
            )}

            {cs.downloads && cs.downloads.length > 0 && !liveLink && (
              <a
                href={cs.downloads[0].href}
                download
                className="group inline-flex items-center gap-2.5 rounded-sm bg-signal px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#0c0d12] shadow-[0_0_25px_rgba(252,238,10,0.4)] transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] cursor-pointer"
              >
                <span>DOWNLOAD {cs.downloads[0].format.toUpperCase()} INSTALLER</span>
                <span className="font-bold text-sm">↓</span>
              </a>
            )}
          </div>
        )}

        {cs.img ? (
          <div className="relative mb-12 overflow-hidden clip-tab-tl border border-periwinkle/15 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cs.img}
              alt={`${cs.name} cover`}
              className="aspect-[21/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {liveLink && (
              <a
                href={liveLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 sm:right-5 sm:bottom-5 z-20 inline-flex items-center gap-2 rounded-xs border border-[#0c0d12]/40 bg-signal px-4 py-2 font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#0c0d12] shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all hover:scale-105 hover:bg-white cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-[#0c0d12] animate-ping" />
                <span>OPEN LIVE WEB APP ↗</span>
              </a>
            )}
          </div>
        ) : (
          <div className="clip-tab-tl mb-12 aspect-[21/9] w-full border border-periwinkle/15 bg-world-2 flex items-center justify-center">
            <span className="t-micro text-periwinkle/30">NO VISUAL CLASSIFIED</span>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* left: narrative */}
          <div>
            {/* Installers Section in Body Content */}
            {cs.downloads && cs.downloads.length > 0 && (
              <CaseStudyDownloads downloads={cs.downloads} />
            )}

            <h2 className="t-h3 mb-4 text-paper">EXECUTIVE SUMMARY</h2>
            <p className="mb-10 text-base leading-relaxed text-periwinkle/85">
              {cs.summary}
            </p>

            <h2 className="t-h3 mb-4 text-paper">SYSTEM HIGHLIGHTS</h2>
            <ul className="mb-10 space-y-3">
              {cs.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-periwinkle/80"
                >
                  <span className="mt-1 block h-1.5 w-1.5 bg-signal shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <h2 className="t-h3 mb-4 text-paper">CORE ARCHITECTURE</h2>
            <ul className="mb-10 space-y-3">
              {cs.architecture.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-periwinkle/80"
                >
                  <span className="mt-1 block h-1.5 w-1.5 bg-iris-bright shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>

            {/* Diagrams section */}
            <ProjectDiagramsSection slug={cs.slug} />

            {/* Google Search Console Telemetry */}
            {cs.slug === "stickout" && <SearchConsoleTelemetry />}

            {/* Gallery Section */}
            {cs.gallery && cs.gallery.length > 0 && (
              <CaseStudyGallery gallery={cs.gallery} slug={cs.slug} />
            )}
          </div>

          {/* right: specs sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
            {/* Prominent Uplinks at the TOP of sidebar */}
            {cs.links && cs.links.length > 0 && (
              <div className="border border-iris-bright/35 bg-world-2 p-5 shadow-xl">
                <p className="t-label mb-3 text-iris-bright flex items-center justify-between font-mono">
                  <span>DEPLOYED UPLINKS</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
                  </span>
                </p>
                <div className="flex flex-col gap-2.5">
                  {cs.links.map((l) => {
                    const isLive = !l.href.includes("github.com") && !l.href.includes("youtube.com");
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-3 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          isLive
                            ? "bg-signal text-[#0c0d12] hover:bg-white hover:scale-[1.02] shadow-[0_0_15px_rgba(252,238,10,0.35)] font-black"
                            : "border border-periwinkle/25 bg-world text-periwinkle hover:border-iris-bright hover:text-paper font-bold"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isLive ? "● LIVE:" : "○"} {l.label}
                        </span>
                        <span>↗</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border border-periwinkle/15 bg-world-2 p-6">
              <p className="t-label mb-4 text-iris-bright">STACK SPECIFICATION</p>
              {cs.stack.map((layer) => (
                <div key={layer.label} className="mb-4 last:mb-0">
                  <p className="t-micro mb-1 text-periwinkle/50">{layer.label}</p>
                  <ul className="space-y-1">
                    {layer.items.map((it) => (
                      <li key={it} className="text-xs text-periwinkle">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {cs.collaborators && cs.collaborators.length > 0 && (
                <div className="mt-6 border-t border-periwinkle/15 pt-6">
                  <CaseStudyCollaborators collaborators={cs.collaborators} />
                </div>
              )}
            </div>

            {cs.nda && (
              <p className="t-micro mb-8 border border-periwinkle/20 p-4 leading-relaxed text-periwinkle/60">
                ◆ FREELANCE ENGAGEMENT // SCREENSHOTS, CLIENT COPY, AND SOME
                IMPLEMENTATION DETAILS ARE WITHHELD. THIS CASE FILE IS LIMITED
                TO NON-SENSITIVE ARCHITECTURE.
              </p>
            )}
          </aside>
        </div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-periwinkle/15 pt-6">
          <div className="flex items-center gap-4">
            <span className="t-micro text-periwinkle/50">
              AERA.DEV // CASE FILE {cs.slug.toUpperCase()}
            </span>
            {liveLink && (
              <a
                href={liveLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold text-signal hover:text-white underline uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>OPEN {liveLink.label}</span> ↗
              </a>
            )}
          </div>
          <Link href="/vault/archive" className="nav-link t-micro text-periwinkle/70">
            ← RETURN TO ARCHIVE
          </Link>
        </footer>
      </div>
    </main>
  );
}
