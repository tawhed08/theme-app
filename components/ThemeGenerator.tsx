"use client";

import { useState } from "react";

import { themes } from "@/data/themes";

import type { Theme } from "@/types/theme";

interface ThemeGeneratorProps {
  onGenerate: (theme: Theme) => void;
}

const getRandomTheme = (): Theme => {
  const index = Math.floor(
    Math.random() * themes.length,
  );

  return themes[index];
};

export default function ThemeGenerator({
  onGenerate,
}: ThemeGeneratorProps) {
  const [generated, setGenerated] =
    useState<Theme | null>(null);

  const generateTheme = () => {
    const nextTheme = getRandomTheme();

    setGenerated(nextTheme);
    onGenerate(nextTheme);
  };

  return (
    <section>
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Theme Generator
        </span>

        <h2 className="mt-2 text-2xl font-bold">
          Generate a complete theme
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
          Generate colors, semantic states, gradients,
          typography, radius, shadows and spacing
          together.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <button
          type="button"
          onClick={generateTheme}
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          {generated
            ? "Generate Again"
            : "Generate Theme"}
        </button>

        {generated && (
          <div className="mt-6">
            <div
              className="h-32 rounded-2xl border border-white/10"
              style={{
                background:
                  generated.gradient ??
                  generated.background,
              }}
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                generated.primary,
                generated.secondary,
                generated.accent,
                generated.success ??
                  "#22C55E",
                generated.warning ??
                  "#F59E0B",
                generated.error ??
                  "#EF4444",
                generated.info ??
                  "#3B82F6",
              ].map((color, index) => (
                <span
                  key={`${generated.name}-${color}-${index}`}
                  className="h-8 w-8 rounded-lg border border-white/10"
                  style={{
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              {generated.name}
            </h3>

            <p className="mt-1 text-xs text-white/40">
              {generated.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Radius
                </p>

                <p className="mt-2 text-sm">
                  {generated.radius?.md ?? 8}px
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Spacing
                </p>

                <p className="mt-2 text-sm">
                  {generated.spacing?.lg ?? 16}px
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Font
                </p>

                <p className="mt-2 text-sm">
                  {generated.typography
                    ?.fontFamily ?? "Inter"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}