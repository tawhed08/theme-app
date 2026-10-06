import Link from "next/link";
import type { Metadata } from "next";
import FeatureCarousel from "@/components/FeatureCarousel";
import FeatureTiles from "@/components/FeatureTiles";
import Reveal from "@/components/Reveal";
import ThemeCarousel from "@/components/ThemeCarousel";

export const metadata: Metadata = {
  title: "Design systems, beautifully in sync",
  description:
    "Explore 50+ curated themes and build a cohesive design system with color, type, gradients, and tokens in Theme Studio.",
  alternates: { canonical: "/" },
};

function ProductPreview() {
  return (
    <div className="surface-card theme-preview-float relative overflow-hidden rounded-[1.7rem] p-2 shadow-[0_35px_100px_rgba(0,0,0,.4)]">
      <div className="hero-card-aura absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[90px]" />
      <div className="relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#0c0d13]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span className="text-xs font-medium text-white/70">Your design system</span>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] tracking-wide text-emerald-300">LIVE PREVIEW</span>
        </div>
        <div className="grid gap-0 md:grid-cols-[.8fr_1.2fr]">
          <div className="border-b border-white/[0.07] p-5 md:border-b-0 md:border-r">
            <p className="text-[10px] uppercase tracking-[.16em] text-white/35">Color tokens</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {["#A78BFA", "#22D3EE", "#34D399", "#FBBF24", "#FB7185"].map((color) => (
                <span key={color} className="h-11 rounded-xl border border-white/10" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {[["Primary", "#A78BFA"], ["Secondary", "#22D3EE"], ["Success", "#34D399"]].map(([label, color]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <span className="text-[10px] text-white/55">{label}</span>
                  <span className="font-mono text-[10px] text-white/40">{color}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[.16em] text-white/35">Component preview</span>
              <span className="text-[10px] text-white/35">Aurora / Dark</span>
            </div>
            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#14151d] p-5 sm:p-7">
              <span className="inline-flex rounded-full bg-violet-400/10 px-2.5 py-1 text-[9px] font-medium text-violet-200">BUILT WITH INTENTION</span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Make the details<br />feel effortless.</h2>
              <p className="mt-3 max-w-sm text-xs leading-5 text-white/45">One connected system for the colors, type, and rhythm behind your next great product.</p>
              <div className="mt-5 flex gap-2">
                <span className="rounded-lg bg-violet-400 px-3.5 py-2 text-[10px] font-semibold text-[#100c20]">Explore system</span>
                <span className="rounded-lg border border-white/10 px-3.5 py-2 text-[10px] font-medium text-white/70">View tokens</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[["Radius", "16 px"], ["Elevation", "Soft"], ["Spacing", "8 pt"]].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                  <span className="block text-[9px] text-white/35">{label}</span>
                  <span className="mt-1 block text-[11px] font-medium text-white/75">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">
          <span className="font-mono text-[9px] text-white/35">:root {`{`} --color-primary: #A78BFA;</span>
          <span className="text-[9px] text-white/40">CSS variables ready</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#08090d] text-white">
      <section id="home" className="hero-glow home-hero relative">
        <div className="soft-grid hero-grid-drift pointer-events-none absolute inset-0" />
        <span className="hero-light-sweep" aria-hidden="true" />
        <span className="hero-orb hero-orb-one" aria-hidden="true" />
        <span className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="hero-intro hero-badge inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3.5 py-2 text-[11px] font-medium text-violet-100/80">
              <span className="hero-badge-pulse h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_#a78bfa]" />
              A calmer way to build your design system
              <span aria-hidden="true" className="text-white/35">·</span>
              <span className="text-white/55">50+ curated themes</span>
            </div>
            <h1 className="hero-intro hero-heading mt-7 text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[.99] tracking-[-.065em]">
              Every detail, <span className="hero-title-accent bg-gradient-to-r from-[#c7b8ff] via-[#a38af8] to-[#73c9fa] bg-clip-text text-transparent">in harmony.</span>
            </h1>
            <p className="hero-intro hero-description mx-auto mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              Create a design system that feels like it was always meant to be. Explore thoughtful themes, tune every token, and carry your visual language everywhere.
            </p>
            <div className="hero-cta-group mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="nav-primary justify-center px-6 py-3.5">Get started free <span aria-hidden="true">↗</span></Link>
              <Link href="/themes" className="nav-secondary justify-center px-6 py-3.5">Explore themes <span aria-hidden="true">→</span></Link>
            </div>
            <p className="hero-intro hero-footnote mt-4 text-[11px] text-white/35">No design background needed · Start with a free account</p>
          </div>
          <div className="hero-preview-enter mx-auto mt-16 max-w-5xl sm:mt-20">
            <ProductPreview />
          </div>
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[.16em] text-white/35 sm:gap-x-12">
            <span>Color systems</span><span>Typography</span><span>Gradients</span><span>Design tokens</span><span>CSS export</span>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-white/[0.06] bg-[#0b0c11]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">A connected toolkit</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything speaks the same language.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/48">A small, considered set of tools that work together—so your final system feels cohesive, not assembled.</p>
          </Reveal>
          <FeatureCarousel />
        </div>
      </section>

      <section id="themes" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">The starting point</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A little inspiration goes a long way.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/48">Explore more than 50 original themes, then make any one of them yours.</p>
          </div>
          <Link href="/themes" className="text-sm font-medium text-white/70 transition hover:text-white">Browse all themes <span aria-hidden="true">↗</span></Link>
        </Reveal>
        <ThemeCarousel />
      </section>

      <section id="about" className="border-y border-white/[0.06] bg-[#0b0c11]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">Made for the whole process</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">From first spark to a system that ships.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/50">Start with a curated direction, experiment with the details, and export tokens your team can use immediately.</p>
            <ol className="mt-8 space-y-5">
              {[
                ["01", "Find your direction", "Start from a theme that feels right."],
                ["02", "Make it yours", "Refine palette, type, shape, and rhythm."],
                ["03", "Take it with you", "Preview and copy production-ready CSS."],
              ].map(([step, title, detail]) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-xs text-violet-200/65">{step}</span>
                  <span><span className="block text-sm font-medium text-white/85">{title}</span><span className="mt-1 block text-xs text-white/45">{detail}</span></span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={120}>
            <FeatureTiles />
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">A generous place to begin</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Your next great system starts here.</h2>
          <p className="mt-4 text-sm leading-6 text-white/50">Explore the library, build your own, and save your work in a private workspace. Get started for free.</p>
          <Link href="/signup" className="nav-primary mt-7">Create your free workspace <span aria-hidden="true">↗</span></Link>
        </Reveal>
      </section>
    </main>
  );
}
