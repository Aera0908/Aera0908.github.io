import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";
import { CyberLines } from "@/components/ui/CyberLines";
import { CaseStudyBackButton } from "@/components/ui/CaseStudyBackButton";
import { CaseEnter } from "@/components/ui/CaseEnter";
import { ProjectDiagramsSection } from "@/components/ui/ProjectDiagrams";
import { CaseStudyGallery } from "@/components/ui/CaseStudyGallery";
import Link from "next/link";

export function generateStaticParams() {
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
    title: cs ? `${cs.name} — Case File // Aira Ynte` : "Case File",
    description: cs?.summary,
  };
}

/**
 * Full-view case study — flat editorial dossier over the solid world
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
            ROLE — <span className="text-periwinkle">{cs.role.toUpperCase()}</span>
          </span>
          <span className="t-micro text-periwinkle/60">
            TIMELINE — <span className="text-periwinkle">{cs.duration}</span>
          </span>
          <span className="t-micro text-periwinkle/60">
            STATUS — <span className="text-iris-bright">{cs.status}</span>
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
          <div className="clip-tab-tl mb-12 flex aspect-[21/9] w-full items-center justify-center border border-periwinkle/15 bg-world-2">
            <span className="t-micro text-periwinkle/50">
              NDA // NO PUBLIC VISUAL
            </span>
          </div>
        )}

        <p className="mb-14 max-w-3xl text-base leading-relaxed text-periwinkle/85">
          {cs.summary}
        </p>

        <div className="grid gap-14 md:grid-cols-12">
          {/* highlights + architecture */}
          <div className="md:col-span-7">
            <p className="t-label mb-5 text-iris-bright">HIGHLIGHTS</p>
            <ul className="mb-12 flex flex-col gap-3 border-l border-periwinkle/15 pl-5">
              {cs.highlights.map((h) => (
                <li key={h} className="text-sm leading-relaxed text-periwinkle/80">
                  ▸ {h}
                </li>
              ))}
            </ul>

            <p className="t-label mb-5 text-iris-bright">ARCHITECTURE</p>
            <ul className="flex flex-col gap-3 border-l border-periwinkle/15 pl-5">
              {cs.architecture.map((a) => (
                <li key={a} className="font-mono text-xs leading-relaxed text-periwinkle/75">
                  ▸ {a}
                </li>
              ))}
            </ul>

            <ProjectDiagramsSection slug={cs.slug} />
          </div>

          {/* stack + links */}
          <div className="md:col-span-5">
            <p className="t-label mb-5 text-iris-bright">STACK</p>
            <div className="mb-12 flex flex-col gap-6">
              {cs.stack.map((g) => (
                <div key={g.label}>
                  <p className="t-micro mb-2 text-periwinkle/50">{g.label.toUpperCase()}</p>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="t-micro rounded-full border border-periwinkle/20 px-3 py-1.5 text-periwinkle/85"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {cs.nda && (
              <p className="t-micro mb-8 border border-periwinkle/20 p-4 leading-relaxed text-periwinkle/60">
                ◆ FREELANCE ENGAGEMENT — SCREENSHOTS, CLIENT COPY, AND SOME
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
          </div>
        </div>

        {cs.gallery && cs.gallery.length > 0 && (
          <CaseStudyGallery gallery={cs.gallery} slug={cs.slug} />
        )}

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
