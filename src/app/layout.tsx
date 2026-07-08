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

export const metadata: Metadata = {
  title: "Aira Ynte — Software Engineer & System Architect",
  description:
    "Immersive scrollytelling portfolio of Aira Ynte (@Aera0908) — full-stack systems, hardware-firmware integration, Web3 settlement rails, and AI copilots. Computer Engineering '26, Metro Manila.",
  icons: { icon: "/aj-logo.svg" },
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
