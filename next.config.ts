import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS export — required for GitHub Pages (static hosting).
  // `next build` emits everything to `out/`.
  output: "export",

  // GitHub Pages serves `/route/index.html`; trailing slashes make every
  // route resolve unambiguously (and the client code strips them back off).
  trailingSlash: true,

  // No image server in a static export — serve <img>/next/image as-is.
  images: { unoptimized: true },

  // This is a user site (aera0908.github.io) served at the domain root,
  // so no basePath/assetPrefix is needed.
};

export default nextConfig;
