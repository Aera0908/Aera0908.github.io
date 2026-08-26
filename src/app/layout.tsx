import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { HudAudioProvider } from "@/components/providers/HudAudioProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { Cursor } from "@/components/chrome/Cursor";
import { FrameBorder } from "@/components/chrome/FrameBorder";
import { Navbar } from "@/components/chrome/Navbar";
import { StickyDownloadButton } from "@/components/chrome/StickyDownloadButton";
import { ResumePreviewModal } from "@/components/chrome/ResumePreviewModal";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://aera0908.github.io";
const SITE_TITLE = "Aira Ynte - Software Engineer & System Architect";
const SITE_DESCRIPTION =
  "Immersive scrollytelling portfolio of Aira Ynte (@Aera0908) - full-stack systems, hardware-firmware integration, Web3 settlement rails, and AI copilots. Computer Engineering '26, Metro Manila.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: "/aj-logo.svg" },
  alternates: { canonical: "/" },
  verification: {
    google: "google32a78ba66d0a07c5",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "AERA.DEV",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/OG_card.png",
        width: 1537,
        height: 1023,
        alt: "AERA.DEV - Aira Ynte portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aera0908",
    creator: "@aera0908",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/OG_card.png"],
  },
};

/**
 * themeColor lives on the `viewport` export, not `metadata` (moved in Next
 * 13.4). Matching --world means mobile browser chrome blends into the site
 * instead of framing it in white.
 */
export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      "name": "Aira Ynte",
      "alternateName": ["@Aera0908", "Aira Josh Ynte"],
      "url": SITE_URL,
      "image": `${SITE_URL}/portrait.webp`,
      "jobTitle": "Software Engineer & System Architect",
      "sameAs": [
        "https://github.com/Aera0908",
        "https://linkedin.com/in/aira-josh-ynte"
      ],
      "email": "mailto:08airajosh@gmail.com",
      "knowsAbout": [
        "Full-Stack Web Development",
        "Embedded Systems & ESP32 Firmware",
        "Web3 & Smart Contract Settlement",
        "Solidity",
        "React & Next.js",
        "Artificial Intelligence & RAG Pipelines",
        "Computer Vision"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "AERA.DEV",
      "description": SITE_DESCRIPTION,
      "publisher": {
        "@id": `${SITE_URL}/#person`
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <SmoothScrollProvider>
          <HudAudioProvider>
            <PageTransitionProvider>
              <Navbar />
              {children}
              <StickyDownloadButton />
              <ResumePreviewModal />
            </PageTransitionProvider>
          </HudAudioProvider>
        </SmoothScrollProvider>
        <FrameBorder />
        <div className="grain" aria-hidden="true" />
        <Cursor />
      </body>
    </html>
  );
}
