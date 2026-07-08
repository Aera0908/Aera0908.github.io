import { notFound } from "next/navigation";
import { Home } from "@/components/Home";

const SECTIONS = ["journey", "vault", "credentials", "contact"] as const;

export function generateStaticParams() {
  return [
    { section: [] as string[] },
    ...SECTIONS.map((s) => ({ section: [s] })),
  ];
}

/**
 * Optional catch-all for the one-pager: "/" boots the full intro, while
 * /experience, /projects, /credentials and /contact skip the loader and
 * land pre-scrolled on their section. Anything else 404s.
 * (/projects/[slug] is a more specific route and wins over this one.)
 */
export default async function Page({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  const seg = section?.[0] ?? null;

  if (section && section.length > 1) notFound();
  if (seg && !SECTIONS.includes(seg as (typeof SECTIONS)[number])) notFound();

  return <Home initialSection={seg} />;
}
