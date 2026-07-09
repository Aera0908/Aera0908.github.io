import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/case-studies";

// required for `output: export`
export const dynamic = "force-static";

const BASE = "https://aera0908.github.io";

// Generated to out/sitemap.xml at build (static export). trailingSlash:true,
// so canonical URLs end in "/".
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sections = ["", "journey", "vault", "credentials", "contact", "vault/archive"].map(
    (p) => ({
      url: p ? `${BASE}/${p}/` : `${BASE}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    }),
  );

  const caseFiles = CASE_STUDIES.map((c) => ({
    url: `${BASE}/vault/archive/${c.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...sections, ...caseFiles];
}
