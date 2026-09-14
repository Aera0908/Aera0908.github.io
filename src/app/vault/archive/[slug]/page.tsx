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

  return (
    <main className="relative min-h-screen bg-world px-6 py-28 text-periwinkle md:px-16">
      <CaseEnter />
      <CyberLines />

      {/* dossier header */}
      <div className="relative mx-auto max-w-5xl">
        <CaseStudyBackButton />

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

        <div className="mb-10 flex flex-wrap gap-x-10 gap-y-2">
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

        {cs.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cs.img}
            alt={`${cs.name} cover`}
            className="clip-tab-tl mb-12 aspect-[21/9] w-full border border-periwinkle/15 object-cover"
          />
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

            {/* Gallery Section */}
            {cs.gallery && cs.gallery.length > 0 && (
              <CaseStudyGallery gallery={cs.gallery} slug={cs.slug} />
            )}
          </div>

          {/* right: specs sidebar */}
          <aside className="space-y-8">
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

            {cs.links && cs.links.length > 0 && (
              <>
                <p className="t-label mb-4 text-iris-bright">UPLINKS</p>
                <div className="flex flex-col gap-3">
                  {cs.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link t-label self-start text-periwinkle"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>

        <footer className="mt-20 flex items-baseline justify-between border-t border-periwinkle/15 pt-5">
          <span className="t-micro text-periwinkle/50">
            AERA.DEV // CASE FILE {cs.slug.toUpperCase()}
          </span>
          <Link href="/vault/archive" className="nav-link t-micro text-periwinkle/70">
            ← RETURN TO ARCHIVE
          </Link>
        </footer>
      </div>
    </main>
  );
}
