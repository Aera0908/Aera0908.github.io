import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { HudAudioProvider } from "@/components/providers/HudAudioProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Cursor } from "@/components/chrome/Cursor";
import { FrameBorder } from "@/components/chrome/FrameBorder";
import { Navbar } from "@/components/chrome/Navbar";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AJ — Full-Stack · Embedded · AI",
  description:
    "Immersive scrollytelling portfolio — engineering experience, full-stack builds, and hardware/AI projects rendered in an interactive 3D world.",
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
          </HudAudioProvider>
        </SmoothScrollProvider>
        <FrameBorder />
        <div className="grain" aria-hidden="true" />
        <Cursor />
      </body>
    </html>
  );
}
