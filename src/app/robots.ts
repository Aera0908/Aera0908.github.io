import type { MetadataRoute } from "next";

// required for `output: export`
export const dynamic = "force-static";

// Generated to out/robots.txt at build (static export).
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://aera0908.github.io";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
          "Amazonbot",
          "Bytespider",
          "CCBot",
          "Meta-ExternalAgent",
          "Googlebot",
          "Bingbot",
          "DuckDuckBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

