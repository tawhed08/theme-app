"use client";

import { useState } from "react";

type GradientType = "linear" | "radial";

interface GradientGeneratorProps {
  value?: string;
  onApply?: (gradient: string) => void;
}

const gradientPresets = [
  {
    name: "Ocean",
    colors: ["#06B6D4", "#3B82F6", "#8B5CF6"],
  },
  {
    name: "Sunset",
    colors: ["#F97316", "#EF4444", "#EC4899"],
  },
  {
    name: "Aurora",
    colors: ["#22C55E", "#06B6D4", "#8B5CF6"],
  },
  {
    name: "Purple Dream",
    colors: ["#7C3AED", "#C026D3", "#EC4899"],
  },
  {
    name: "Fire",
    colors: ["#EF4444", "#F97316", "#FACC15"],
  },
  {
    name: "Forest",
    colors: ["#166534", "#16A34A", "#84CC16"],
  },
  {
    name: "Cyber",
    colors: ["#22D3EE", "#8B5CF6", "#E879F9"],
  },
  {
    name: "Royal",
    colors: ["#1D4ED8", "#4F46E5", "#9333EA"],
  },
];

export default function GradientGenerator({
  value = "",
  onApply,
}: GradientGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const defaultColors = ["#38BDF8", "#8B5CF6", "#EC4899"];
  const gradient =
    value ||
    `linear-gradient(135deg, ${defaultColors.join(", ")})`;
  const type: GradientType = gradient.startsWith("radial-gradient")
    ? "radial"
    : "linear";
  const colors = [
    ...gradient.match(/#[\da-f]{3,8}\b/gi) ?? [],
    ...defaultColors,
  ].slice(0, 3);
  const parsedAngle = gradient.match(
    /^linear-gradient\(\s*(-?\d+(?:\.\d+)?)deg/i,
  )?.[1];
  const angle = parsedAngle ? Number(parsedAngle) : 135;

  const createGradient = (
    nextType: GradientType,
    nextColors: string[],
    nextAngle = angle,
  ) =>
    nextType === "linear"
      ? `linear-gradient(${nextAngle}deg, ${nextColors.join(", ")})`
      : `radial-gradient(circle, ${nextColors.join(", ")})`;

  const updateColor = (index: number, value: string) => {
    const nextColors = colors.map((color, colorIndex) =>
      colorIndex === index ? value : color,
    );
    setCopied(false);
    onApply?.(createGradient(type, nextColors));
  };

  const generateRandomGradient = () => {
    const randomIndex = Math.floor(
      Math.random() * gradientPresets.length,
    );

    const preset =
      gradientPresets[randomIndex] ?? gradientPresets[0];

    onApply?.(createGradient(type, preset.colors));
    setCopied(false);
  };

  const applyPreset = (presetColors: string[]) => {
    onApply?.(createGradient(type, presetColors));
    setCopied(false);
  };

  const copyCSS = () => {
    const css = `background: ${gradient};`;

    void navigator.clipboard
      .writeText(css)
      .then(() => {
        setCopied(true);
        setCopyError("");

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((error: unknown) => {
        setCopied(false);
        setCopyError(
          error instanceof Error
            ? `Could not copy gradient CSS: ${error.message}`
            : "Could not copy gradient CSS. Check browser clipboard permissions.",
        );
      });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          {/* Controls */}
          <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Gradient Generator
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Create beautiful
              <span className="block text-white/40">
                gradients.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/45">
              Build custom gradients, experiment with colors,
              and export the CSS instantly.
            </p>

            {/* Gradient Type */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                Gradient Type
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onApply?.(createGradient("linear", colors))
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    type === "linear"
                      ? "border-white/20 bg-white text-black"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Linear
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onApply?.(createGradient("radial", colors))
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    type === "radial"
                      ? "border-white/20 bg-white text-black"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Radial
                </button>
              </div>

              {copyError && (
                <p
                  role="alert"
                  className="mt-3 text-xs text-red-300"
                >
                  {copyError}
                </p>
              )}
            </div>

            {/* Colors */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                Gradient Colors
              </p>

              <div className="space-y-3">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <label
                      className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10"
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(event) =>
                          updateColor(
                            index,
                            event.target.value,
                          )
                        }
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        aria-label={`Gradient color ${index + 1}`}
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white/40">
                        Color {index + 1}
                      </p>

                      <p className="mt-1 font-mono text-sm text-white">
                        {color}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Angle */}
            {type === "linear" && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                    Angle
                  </p>

                  <span className="rounded-lg bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70">
                    {angle}°
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(event) => {
                    setCopied(false);
                    onApply?.(
                      createGradient(
                        "linear",
                        colors,
                        Number(event.target.value),
                      ),
                    );
                  }}
                  className="w-full cursor-pointer accent-white"
                />

                <div className="mt-2 flex justify-between text-[10px] text-white/25">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generateRandomGradient}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Random Gradient
              </button>

              <button
                type="button"
                onClick={copyCSS}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {copied ? "Copied!" : "Copy CSS"}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                  Live Preview
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Your gradient
                </h3>
              </div>

              {onApply && (
                <button
                  type="button"
                  onClick={() => onApply(gradient)}
                  className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
                >
                  Apply Gradient
                </button>
              )}
            </div>

            {/* Gradient Preview */}
            <div
              className="mt-6 min-h-[340px] overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl sm:p-8"
              style={{
                background: gradient,
              }}
            >
              <div className="flex h-full min-h-[290px] flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-black/20 px-4 py-2 backdrop-blur-md">
                    <span className="text-xs font-semibold text-white">
                      Gradient Studio
                    </span>
                  </div>

                  <div className="h-10 w-10 rounded-full border border-white/30 bg-white/20 backdrop-blur-md" />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Live Preview
                  </span>

                  <h4 className="mt-3 max-w-xl text-3xl font-bold text-white sm:text-4xl">
                    Beautiful colors,
                    <span className="block text-white/70">
                      endless possibilities.
                    </span>
                  </h4>

                  <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
                    Experiment with different colors and
                    directions to create a gradient that fits
                    your design perfectly.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg"
                    >
                      Primary Action
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-white/30 bg-black/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS Output */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                  CSS
                </p>

                <span className="text-[10px] text-white/25">
                  Ready to copy
                </span>
              </div>

              <code className="mt-3 block overflow-x-auto rounded-xl bg-black/30 p-4 font-mono text-xs leading-6 text-white/60">
                background: {gradient};
              </code>
            </div>

            {/* Presets */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                  Quick Presets
                </p>

                <span className="text-[10px] text-white/25">
                  {gradientPresets.length} presets
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {gradientPresets.map((preset) => {
                  const presetGradient = `linear-gradient(135deg, ${preset.colors.join(", ")})`;

                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        applyPreset(preset.colors)
                      }
                      className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left transition hover:-translate-y-0.5 hover:border-white/20"
                    >
                      <div
                        className="h-14"
                        style={{
                          background: presetGradient,
                        }}
                      />

                      <div className="p-2.5">
                        <p className="text-xs font-medium text-white/70 group-hover:text-white">
                          {preset.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}