"use client";

import { useState } from "react";
import Link from "next/link";
import ColorGenerator from "@/components/ColorGenerator";
import GradientGenerator from "@/components/GradientGenerator";
import RadiusGenerator from "@/components/RadiusGenerator";
import ShadowGenerator from "@/components/ShadowGenerator";
import SpacingGenerator from "@/components/SpacingGenerator";
import ThemeGenerator from "@/components/ThemeGenerator";
import TypographyGenerator from "@/components/TypographyGenerator";
import type {
  RadiusSettings,
  ShadowSettings,
  SpacingSettings,
  Theme,
  TypographySettings,
} from "@/types/theme";
import { themes } from "@/data/themes";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/config";

type CompleteTheme = Theme & {
  success: string;
  warning: string;
  error: string;
  info: string;
  gradient: string;
  typography: TypographySettings;
  radius: RadiusSettings;
  shadows: ShadowSettings;
  spacing: SpacingSettings;
};

const defaults = {
  typography: {
    fontFamily: "Inter",
    headingSize: 48,
    bodySize: 16,
    headingWeight: 700,
    bodyWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
  },
  radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 20, custom: 16 },
  shadows: {
    none: "none",
    sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
    md: "0 4px 10px rgba(0, 0, 0, 0.10)",
    lg: "0 10px 25px rgba(0, 0, 0, 0.14)",
    xl: "0 20px 45px rgba(0, 0, 0, 0.18)",
    custom: "0 18px 50px rgba(0, 0, 0, 0.25)",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, huge: 48, custom: 20 },
};

const complete = (theme: Theme): CompleteTheme => ({
  ...theme,
  success: theme.success ?? "#22C55E",
  warning: theme.warning ?? "#F59E0B",
  error: theme.error ?? "#EF4444",
  info: theme.info ?? "#3B82F6",
  gradient: theme.gradient ?? "",
  typography: { ...defaults.typography, ...theme.typography },
  radius: { ...defaults.radius, ...theme.radius },
  shadows: { ...defaults.shadows, ...theme.shadows },
  spacing: { ...defaults.spacing, ...theme.spacing },
});

const metadata: Record<string, { eyebrow: string; title: string; description: string }> = {
  colors: { eyebrow: "Color studio", title: "Color, with intention.", description: "Build a palette that carries meaning, not just mood." },
  fonts: { eyebrow: "Type studio", title: "Find your voice.", description: "Set the pace and personality of every interface." },
  gradients: { eyebrow: "Gradient studio", title: "Blend into something bold.", description: "Shape a seamless color transition, then take the CSS with you." },
  radius: { eyebrow: "Shape studio", title: "The right edge changes everything.", description: "Give every component a consistent, considered silhouette." },
  shadows: { eyebrow: "Elevation studio", title: "Give ideas a little depth.", description: "Build an elevation scale for surfaces that feel tangible." },
  spacing: { eyebrow: "Layout studio", title: "Make room for clarity.", description: "Create a spacing rhythm that lets your content breathe." },
  generator: { eyebrow: "Theme studio", title: "Start with the whole picture.", description: "Generate a complete system from your curated theme library." },
};

export default function ToolPage({
  tool,
}: Readonly<{ tool: keyof typeof metadata }>) {
  const [theme, setTheme] = useState<CompleteTheme>(() => complete(themes[0]));
  const [semanticColor, setSemanticColor] = useState("success");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const { status } = useAuth();
  const page = metadata[tool];

  const update = (patch: Partial<Theme>) => {
    setTheme((current) => complete({ ...current, ...patch }));
    setSaved(false);
    setCopied(false);
    setError("");
  };

  const save = async () => {
    if (saving) return;
    if (status !== "authenticated") {
      setError("Sign in to save themes to your private library.");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch(`${API_URL}/themes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complete(theme)),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "Could not save this theme.";
        throw new Error(message);
      }
      setSaved(true);
    } catch (saveError) {
      setError(
        saveError instanceof TypeError
          ? `Could not connect to ${API_URL}. Make sure the API is running.`
          : saveError instanceof Error
            ? saveError.message
            : "Could not save this theme.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-[#08090d] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-9 sm:flex-row sm:items-end">
          <div>
            <Link href="/#features" className="text-xs font-medium uppercase tracking-[.17em] text-violet-200/70">Tools / {page.eyebrow}</Link>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">{page.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {saving && <span role="status" className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-200">Saving…</span>}
            {saved && <span role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-xs text-emerald-200">Saved ✓</span>}
            {status !== "authenticated" && <Link href="/login" className="nav-secondary">Sign in to save</Link>}
            <button type="button" onClick={() => void save()} disabled={saving} className="nav-primary disabled:opacity-60">{saving ? "Saving…" : "Save theme"} <span aria-hidden="true">↗</span></button>
          </div>
        </div>
        {error && <div role="alert" className="mb-6 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div>}

        {tool === "colors" && (
          <>
            <div className="mb-8 grid gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-white/80">Apply generated color to
                <select value={semanticColor} onChange={(event) => setSemanticColor(event.target.value)} className="mt-2 block w-full rounded-xl border border-white/10 bg-[#111218] px-3 py-3 text-sm">
                  {["primary", "secondary", "accent", "success", "warning", "error", "info", "background", "surface", "text"].map((key) => <option key={key} value={key}>{key[0].toUpperCase() + key.slice(1)}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["success", "warning", "error", "info"] as const).map((key) => (
                  <label key={key} className="rounded-xl border border-white/[0.08] bg-black/20 p-3 text-xs capitalize text-white/65">{key}
                    <input type="color" aria-label={`${key} semantic color`} value={theme[key] ?? "#ffffff"} onChange={(event) => update({ [key]: event.target.value })} className="mt-2 h-9 w-full cursor-pointer rounded-md bg-transparent" />
                  </label>
                ))}
              </div>
            </div>
            <ColorGenerator
              onApply={(color) => {
                setTheme((current) => complete({ ...current, [semanticColor]: color }));
                setSaved(false);
                setCopied(false);
                setError("");
              }}
            />
          </>
        )}
        {tool === "fonts" && <TypographyGenerator value={theme.typography} onApply={(typography) => update({ typography })} />}
        {tool === "gradients" && <GradientGenerator value={theme.gradient} onApply={(gradient) => update({ gradient })} />}
        {tool === "radius" && <RadiusGenerator value={theme.radius} onApply={(radius) => update({ radius })} />}
        {tool === "shadows" && <ShadowGenerator value={theme.shadows} onApply={(shadows) => update({ shadows })} />}
        {tool === "spacing" && <SpacingGenerator value={theme.spacing} onApply={(spacing) => update({ spacing })} />}
        {tool === "generator" && (
          <ThemeGenerator onGenerate={(generated) => update(complete(generated))} />
        )}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
          <div>
            <p className="text-sm font-semibold">{theme.name}</p>
            <p className="mt-1 text-xs text-white/45">Current system · {theme.typography?.fontFamily} · {theme.radius?.md}px radius · {theme.spacing?.lg}px spacing</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[theme.primary, theme.secondary, theme.accent, theme.success ?? "#22C55E", theme.warning ?? "#F59E0B"].map((color, index) => (
              <span key={`${theme.name}-workspace-${index}`} title={color} className="h-8 w-8 rounded-lg border border-white/10" style={{ backgroundColor: color }} />
            ))}
            <Link href="/studio" className="nav-secondary ml-2">Open full studio ↗</Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const current = complete(theme);
              const css = `:root {
  --color-background: ${current.background};
  --color-surface: ${current.surface};
  --color-primary: ${current.primary};
  --color-secondary: ${current.secondary};
  --color-accent: ${current.accent};
  --color-text: ${current.text};
  --color-success: ${current.success};
  --color-warning: ${current.warning};
  --color-error: ${current.error};
  --color-info: ${current.info};
  --font-family: "${current.typography?.fontFamily}", sans-serif;
  --heading-size: ${current.typography?.headingSize}px;
  --body-size: ${current.typography?.bodySize}px;
  --heading-weight: ${current.typography?.headingWeight};
  --body-weight: ${current.typography?.bodyWeight};
  --line-height: ${current.typography?.lineHeight};
  --letter-spacing: ${current.typography?.letterSpacing}px;
  --radius-none: ${current.radius?.none}px;
  --radius-sm: ${current.radius?.sm}px;
  --radius-md: ${current.radius?.md}px;
  --radius-lg: ${current.radius?.lg}px;
  --radius-xl: ${current.radius?.xl}px;
  --shadow-sm: ${current.shadows?.sm};
  --shadow-md: ${current.shadows?.md};
  --shadow-lg: ${current.shadows?.lg};
  --shadow-xl: ${current.shadows?.xl};
  --space-xs: ${current.spacing?.xs}px;
  --space-sm: ${current.spacing?.sm}px;
  --space-md: ${current.spacing?.md}px;
  --space-lg: ${current.spacing?.lg}px;
  --space-xl: ${current.spacing?.xl}px;
  --space-2xl: ${current.spacing?.xxl}px;
  --space-huge: ${current.spacing?.huge}px;
  --gradient: ${current.gradient || "none"};
}`;
              void navigator.clipboard.writeText(css).then(
                () => {
                  setCopied(true);
                  setError("");
                  window.setTimeout(() => setCopied(false), 1800);
                },
                (copyError: unknown) => {
                  setError(
                    copyError instanceof Error
                      ? `Could not copy CSS: ${copyError.message}`
                      : "Could not copy CSS. Check browser clipboard permissions.",
                  );
                },
              );
            }}
            className="nav-secondary"
          >
            {copied ? "CSS copied ✓" : "Copy CSS"}
          </button>
          {error && <p role="alert" className="text-xs text-rose-200">{error}</p>}
        </div>
      </div>
    </main>
  );
}
