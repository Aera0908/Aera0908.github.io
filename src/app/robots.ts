import type { MetadataRoute } from "next";

// required for `output: export`
export const dynamic = "force-static";

// Generated to out/robots.txt at build (static export).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aera0908.github.io/sitemap.xml",
    host: "https://aera0908.github.io",
  };
}
