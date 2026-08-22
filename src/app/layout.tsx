import type { Metadata } from "next";
import { Geist, Geist_Mono, DotGothic16, Doto } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const dotGothic = DotGothic16({
  weight: "400",
  variable: "--font-dot-gothic",
  subsets: ["latin"],
});

/* ─── Display faces ───────────────────────────────────────────────────────
   Only what something actually uses. Geist Pixel, Pixelify Sans, Raleway
   Dots and VT323 were loaded on every page and referenced nowhere; Geist
   Pixel additionally has no metrics in Next's font table, so it warned at
   build and shipped without a fallback — which is layout shift on first
   paint. Doto sets the reel labels, DotGothic16 the home and work display
   bits. */

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Syed Rafi Naqvi — AI / Software Engineer",
    template: "%s — Syed Rafi Naqvi",
  },
  description:
    "Engineer and founder. Frontend, backend, AI systems, enterprise software and open source — from blank repo to paying customers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dotGothic.variable} ${doto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
