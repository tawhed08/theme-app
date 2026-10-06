import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import SaaSNavbar from "@/components/SaaSNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://themestudio.app",
  ),
  title: {
    default: "Theme Studio — Design systems, beautifully in sync",
    template: "%s | Theme Studio",
  },
  description:
    "Build polished color palettes, typography systems, gradients, and complete design tokens with Theme Studio.",
  applicationName: "Theme Studio",
  keywords: [
    "design system",
    "theme builder",
    "color palette generator",
    "design tokens",
    "typography",
    "CSS generator",
  ],
  openGraph: {
    type: "website",
    siteName: "Theme Studio",
    title: "Theme Studio — Design systems, beautifully in sync",
    description:
      "Explore 50+ curated themes and create a cohesive design system in minutes.",
    images: ["/opengraph-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theme Studio — Design systems, beautifully in sync",
    description:
      "Explore 50+ curated themes and create a cohesive design system in minutes.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <SaaSNavbar />
          <div className="flex-1">{children}</div>
          <footer className="border-t border-white/[0.08] bg-[#08090d]">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <Link href="/" className="font-semibold tracking-tight text-white">theme.studio</Link>
              <p>Thoughtful systems for people who make things.</p>
              <nav aria-label="Legal" className="flex gap-5">
                <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
                <Link href="/terms" className="transition hover:text-white">Terms</Link>
              </nav>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
