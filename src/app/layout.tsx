import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { HudAudioProvider } from "@/components/providers/HudAudioProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
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
const SITE_TITLE = "Aira Ynte — Software Engineer & System Architect";
const SITE_DESCRIPTION =
  "Immersive scrollytelling portfolio of Aira Ynte (@Aera0908) — full-stack systems, hardware-firmware integration, Web3 settlement rails, and AI copilots. Computer Engineering '26, Metro Manila.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: "/aj-logo.svg" },
  alternates: { canonical: "/" },
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
        alt: "AERA.DEV — Aira Ynte portfolio",
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
      <body>
        <SmoothScrollProvider>
          <HudAudioProvider>
            <Navbar />
            {children}
            <StickyDownloadButton />
            <ResumePreviewModal />
          </HudAudioProvider>
        </SmoothScrollProvider>
        <FrameBorder />
        <div className="grain" aria-hidden="true" />
        <Cursor />
      </body>
    </html>
  );
}
