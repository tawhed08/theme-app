"use client";

import { useEffect, useRef, useState } from "react";

import ColorGenerator from "@/components/ColorGenerator";
import GradientGenerator from "@/components/GradientGenerator";
import RadiusGenerator from "@/components/RadiusGenerator";
import ShadowGenerator from "@/components/ShadowGenerator";
import SpacingGenerator from "@/components/SpacingGenerator";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import ThemeGenerator from "@/components/ThemeGenerator";
import TypographyGenerator from "@/components/TypographyGenerator";

import { themes } from "@/data/themes";
import { API_URL } from "@/lib/config";

import type {
  RadiusSettings,
  ShadowSettings,
  SpacingSettings,
  Theme,
  TypographySettings,
} from "@/types/theme";

interface SavedTheme extends Theme {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

type ResolvedTheme = Theme & {
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

type ColorTarget =
  | "background"
  | "surface"
  | "primary"
  | "secondary"
  | "text"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

type SaveStatus =
  | "idle"
  | "saving"
  | "saved";

const readResponseBody = async (
  response: Response,
): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const responseMessage = (
  body: unknown,
  fallback: string,
) => {
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }

  return fallback;
};

const requestErrorMessage = (
  error: unknown,
  action: string,
) => {
  if (error instanceof TypeError) {
    return `Could not ${action}: unable to connect to ${API_URL}. Check that the backend is running. (${error.message})`;
  }

  return error instanceof Error
    ? error.message
    : `Could not ${action}.`;
};

const isSavedTheme = (
  value: unknown,
): value is SavedTheme => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate._id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.background === "string" &&
    typeof candidate.surface === "string" &&
    typeof candidate.primary === "string" &&
    typeof candidate.secondary === "string" &&
    typeof candidate.text === "string" &&
    typeof candidate.accent === "string"
  );
};

const defaultTypography: TypographySettings = {
  fontFamily: "Inter",
  headingSize: 48,
  bodySize: 16,
  headingWeight: 700,
  bodyWeight: 400,
  lineHeight: 1.6,
  letterSpacing: 0,
};

const defaultRadius: RadiusSettings = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  custom: 16,
};

const defaultShadows: ShadowSettings = {
  none: "none",
  sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
  md: "0 4px 10px rgba(0, 0, 0, 0.10)",
  lg: "0 10px 25px rgba(0, 0, 0, 0.14)",
  xl: "0 20px 45px rgba(0, 0, 0, 0.18)",
  custom: "0 18px 50px rgba(0, 0, 0, 0.25)",
};

const defaultSpacing: SpacingSettings = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
  custom: 20,
};

const normalizeTheme = (
  input: Theme,
): ResolvedTheme => {
  return {
    name: input.name,
    description: input.description ?? "",

    background: input.background,
    surface: input.surface,
    primary: input.primary,
    secondary: input.secondary,
    text: input.text,
    accent: input.accent,

    success:
      input.success ?? "#22C55E",
    warning:
      input.warning ?? "#F59E0B",
    error:
      input.error ?? "#EF4444",
    info:
      input.info ?? "#3B82F6",

    gradient:
      input.gradient ?? "",

    typography: {
      ...defaultTypography,
      ...(input.typography ?? {}),
    },

    radius: {
      ...defaultRadius,
      ...(input.radius ?? {}),
    },

    shadows: {
      ...defaultShadows,
      ...(input.shadows ?? {}),
    },

    spacing: {
      ...defaultSpacing,
      ...(input.spacing ?? {}),
    },
  };
};

const createThemeCss = (
  inputTheme: Theme,
) => {
  const theme =
    normalizeTheme(inputTheme);

  return `:root {
  --color-background: ${theme.background};
  --color-surface: ${theme.surface};

  --color-primary: ${theme.primary};
  --color-secondary: ${theme.secondary};
  --color-accent: ${theme.accent};
  --color-text: ${theme.text};

  --color-success: ${theme.success};
  --color-warning: ${theme.warning};
  --color-error: ${theme.error};
  --color-info: ${theme.info};

  --font-family: "${theme.typography.fontFamily}", sans-serif;
  --heading-size: ${theme.typography.headingSize}px;
  --body-size: ${theme.typography.bodySize}px;

  --heading-weight: ${theme.typography.headingWeight};
  --body-weight: ${theme.typography.bodyWeight};

  --line-height: ${theme.typography.lineHeight};
  --letter-spacing: ${theme.typography.letterSpacing}px;

  --radius-none: ${theme.radius.none}px;
  --radius-sm: ${theme.radius.sm}px;
  --radius-md: ${theme.radius.md}px;
  --radius-lg: ${theme.radius.lg}px;
  --radius-xl: ${theme.radius.xl}px;
  --radius-custom: ${theme.radius.custom}px;

  --shadow-none: ${theme.shadows.none};
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};
  --shadow-xl: ${theme.shadows.xl};
  --shadow-custom: ${theme.shadows.custom};

  --space-xs: ${theme.spacing.xs}px;
  --space-sm: ${theme.spacing.sm}px;
  --space-md: ${theme.spacing.md}px;
  --space-lg: ${theme.spacing.lg}px;
  --space-xl: ${theme.spacing.xl}px;
  --space-2xl: ${theme.spacing.xxl}px;
  --space-huge: ${theme.spacing.huge}px;
  --space-custom: ${theme.spacing.custom}px;

  --gradient: ${theme.gradient || "none"};
}`;
};

export default function ThemeStudio({
  initialTheme = themes[0],
}: Readonly<{ initialTheme?: Theme }>) {
  const [theme, setTheme] =
    useState<Theme>(() =>
      normalizeTheme(initialTheme),
    );

  const [savedThemes, setSavedThemes] =
    useState<SavedTheme[]>([]);

  const [loadingThemes, setLoadingThemes] =
    useState(true);

  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");

  const [colorTarget, setColorTarget] =
    useState<ColorTarget>("primary");

  const saveLock = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadThemes = async () => {
      try {
        const response = await fetch(
          `${API_URL}/themes`,
          { credentials: "include", cache: "no-store" },
        );

        const body = await readResponseBody(response);

        if (!response.ok) {
          throw new Error(
            responseMessage(body, "Failed to load themes."),
          );
        }

        if (!Array.isArray(body) || !body.every(isSavedTheme)) {
          throw new Error("The API returned an invalid saved themes response.");
        }

        if (!cancelled) {
          setSavedThemes(body);
          const query = new URLSearchParams(window.location.search);
          const presetName = query.get("preset");
          const savedId = query.get("themeId");
          const selectedPreset = presetName
            ? themes.find((preset) => preset.name === presetName)
            : undefined;
          const selectedSavedTheme = savedId
            ? body.find((savedTheme) => savedTheme._id === savedId)
            : undefined;
          const selectedTheme = selectedSavedTheme ?? selectedPreset;
          if (selectedTheme) {
            setTheme(normalizeTheme(selectedTheme));
          }
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          console.error("LOAD THEMES ERROR:", loadError);
          setError(
            requestErrorMessage(loadError, "load saved themes"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingThemes(false);
        }
      }
    };

    void loadThemes();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePresetSelect = (
    preset: Theme,
  ) => {
    setTheme(
      normalizeTheme(preset),
    );

    setSaveStatus("idle");
    setCopied(false);
    setError("");
  };

  const handleGenerateTheme = (
    generatedTheme: Theme,
  ) => {
    setTheme(
      normalizeTheme(
        generatedTheme,
      ),
    );

    setSaveStatus("idle");
    setCopied(false);
    setError("");
  };

  const handleApplyColor = (
    color: string,
  ) => {
    setTheme((current) =>
      normalizeTheme({
        ...current,
        [colorTarget]: color,
      }),
    );

    setSaveStatus("idle");
    setError("");
  };

  const handleApplyGradient = (
    gradient: string,
  ) => {
    setTheme((current) =>
      normalizeTheme({
        ...current,
        gradient,
      }),
    );

    setSaveStatus("idle");
    setError("");
  };

  const handleApplyTypography = (
    typography: TypographySettings,
  ) => {
    setTheme((current) =>
      normalizeTheme({
        ...current,
        typography,
      }),
    );

    setSaveStatus("idle");
    setError("");
  };

  const handleCustomizeTheme = (
    updatedTheme: Theme,
  ) => {
    setTheme(normalizeTheme(updatedTheme));
    setSaveStatus("idle");
    setError("");
  };

  const handleApplyRadius = (
    radius: RadiusSettings,
  ) => {
    setTheme((current) =>
      normalizeTheme({
        ...current,
        radius,
      }),
    );

    setSaveStatus("idle");
    setError("");
  };

  const handleApplyShadows = (
    shadows: ShadowSettings,
  ) => {
    setTheme((current) =>
      normalizeTheme({
        ...current,
        shadows,
      }),
    );

    setSaveStatus("idle");
    setError("");
  };

  const handleApplySpacing = (
    spacing: SpacingSettings,
  ) => {
    setTheme((current) =>
      normalizeTheme({
        ...current,
        spacing,
      }),
    );

    setSaveStatus("idle");
    setError("");
  };

  const loadSavedTheme = (
    savedTheme: SavedTheme,
  ) => {
    setTheme(
      normalizeTheme(savedTheme),
    );

    setSaveStatus("idle");
    setCopied(false);
    setError("");
  };

  const saveTheme = async () => {
    if (saveLock.current) {
      return;
    }

    saveLock.current = true;

    try {
      setSaveStatus("saving");
      setError("");

      const normalized =
        normalizeTheme(theme);

      const response = await fetch(
        `${API_URL}/themes`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",

          body: JSON.stringify(
            normalized,
          ),
        },
      );

      const body = await readResponseBody(response);

      if (!response.ok) {
        throw new Error(
          responseMessage(body, "Failed to save theme."),
        );
      }

      if (!isSavedTheme(body)) {
        throw new Error("The API returned an invalid saved theme response.");
      }

      const created = body;

      setSavedThemes((current) => [
        created,
        ...current.filter((item) => item._id !== created._id),
      ]);

      setTheme(
        normalizeTheme(created),
      );

      setSaveStatus("saved");
      setError("");
    } catch (saveError: unknown) {
      console.error(
        "SAVE THEME ERROR:",
        saveError,
      );

      setSaveStatus("idle");
      setError(requestErrorMessage(saveError, "save the theme"));
    } finally {
      saveLock.current = false;
    }
  };

  const deleteTheme = async (
    id: string,
  ) => {
    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `${API_URL}/themes/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const body = await readResponseBody(response);

      if (!response.ok) {
        throw new Error(
          responseMessage(body, "Failed to delete theme."),
        );
      }

      setSavedThemes((current) =>
        current.filter(
          (item) =>
            item._id !== id,
        ),
      );
    } catch (deleteError: unknown) {
      console.error(
        "DELETE THEME ERROR:",
        deleteError,
      );

      setError(requestErrorMessage(deleteError, "delete the theme"));
    } finally {
      setDeletingId(null);
    }
  };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(
        createThemeCss(theme),
      );

      setCopied(true);
      setError("");

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (copyError: unknown) {
      console.error("COPY CSS ERROR:", copyError);
      setCopied(false);
      setError(
        copyError instanceof Error
          ? `Could not copy CSS: ${copyError.message}`
          : "Could not copy CSS. Check browser clipboard permissions.",
      );
    }
  };

  const currentTheme =
    normalizeTheme(theme);

  const savedColors = (
    savedTheme: ResolvedTheme,
  ) => [
    savedTheme.primary,
    savedTheme.secondary,
    savedTheme.accent,
    savedTheme.success,
    savedTheme.warning,
    savedTheme.error,
    savedTheme.info,
  ];

  return (
    <>
      {/* COLOR SYSTEM */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            Design System
          </span>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Color System
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Build base colors and semantic design tokens.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Apply generated color to
            </p>

            <p className="mt-1 text-xs text-white/40">
              Select the token you want to update.
            </p>
          </div>

          <select
            value={colorTarget}
            onChange={(event) =>
              setColorTarget(
                event.target.value as ColorTarget,
              )
            }
            className="rounded-xl border border-white/10 bg-[#101217] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="background">
              Background
            </option>
            <option value="surface">
              Surface
            </option>
            <option value="primary">
              Primary
            </option>
            <option value="secondary">
              Secondary
            </option>
            <option value="text">
              Text
            </option>
            <option value="accent">
              Accent
            </option>
            <option value="success">
              Success
            </option>
            <option value="warning">
              Warning
            </option>
            <option value="error">
              Error
            </option>
            <option value="info">
              Info
            </option>
          </select>
        </div>

        <ColorGenerator
          onApply={handleApplyColor}
        />
      </section>

      {/* GRADIENT */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <GradientGenerator
          value={currentTheme.gradient}
          onApply={handleApplyGradient}
        />
      </section>

      {/* TYPOGRAPHY */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <TypographyGenerator
          value={currentTheme.typography}
          onApply={handleApplyTypography}
        />
      </section>

      {/* RADIUS */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <RadiusGenerator
          value={currentTheme.radius}
          onApply={handleApplyRadius}
        />
      </section>

      {/* SHADOW */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <ShadowGenerator
          value={currentTheme.shadows}
          onApply={handleApplyShadows}
        />
      </section>

      {/* SPACING */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <SpacingGenerator
          value={currentTheme.spacing}
          onApply={handleApplySpacing}
        />
      </section>

      {/* GENERATOR */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <ThemeGenerator
          onGenerate={handleGenerateTheme}
        />
      </section>

      {/* PRESETS */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Presets
          </span>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Theme Presets
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Choose from your design systems.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map(
            (preset, presetIndex) => {
              const presetTheme =
                normalizeTheme(
                  preset,
                );

              return (
                <button
                  key={`${preset.name}-${presetIndex}`}
                  type="button"
                  onClick={() =>
                    handlePresetSelect(
                      preset,
                    )
                  }
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:-translate-y-1 hover:border-white/20"
                >
                  <div
                    className="h-32"
                    style={{
                      background:
                        presetTheme.gradient ||
                        presetTheme.background,
                    }}
                  />

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-white">
                        {
                          presetTheme.name
                        }
                      </h3>

                      <span className="text-xs text-white/30">
                        Use
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-white/40">
                      {
                        presetTheme.description
                      }
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {savedColors(
                        presetTheme,
                      ).map(
                        (
                          color,
                          colorIndex,
                        ) => (
                          <span
                            key={`${presetTheme.name}-${color}-${colorIndex}`}
                            className="h-5 w-5 rounded-full border border-white/10"
                            style={{
                              backgroundColor:
                                color,
                            }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </button>
              );
            },
          )}
        </div>
      </section>

      {/* LIVE PREVIEW */}
      <section
        id="live-preview"
        className="mx-auto max-w-7xl px-6 pb-12 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Live Preview
            </span>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {currentTheme.name}
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Your complete visual design system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {saveStatus === "saving" && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" />
                Saving theme...
              </div>
            )}

            {saveStatus === "saved" && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-300">
                ✓ Theme saved successfully
              </div>
            )}

            {copied && (
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300">
                CSS copied
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                void copyCss()
              }
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Copy CSS
            </button>

            <button
              type="button"
              onClick={() =>
                void saveTheme()
              }
              disabled={
                saveStatus === "saving"
              }
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                saveStatus === "saved"
                  ? "border border-emerald-400/30 bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/20"
                  : "bg-white text-black hover:bg-white/90"
              }`}
            >
              {saveStatus ===
              "saving"
                ? "Saving..."
                : saveStatus ===
                    "saved"
                  ? "Saved ✓"
                  : "Save Theme"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-red-300/70 transition hover:text-red-300"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div
          className="overflow-hidden border border-white/10"
          style={{
            backgroundColor:
              currentTheme.background,
            color:
              currentTheme.text,
            borderRadius: `${currentTheme.radius.xl}px`,
            boxShadow:
              currentTheme.shadows.lg,
          }}
        >
          <div
            className="p-8 sm:p-10"
            style={{
              background:
                currentTheme.gradient ||
                currentTheme.surface,
            }}
          >
            <span
              className="inline-flex px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor:
                  currentTheme.primary,
                color:
                  currentTheme.background,
                borderRadius: `${currentTheme.radius.custom}px`,
              }}
            >
              Theme Studio
            </span>

            <h3
              className="mt-6 font-bold leading-tight"
              style={{
                color:
                  currentTheme.text,
                fontFamily:
                  currentTheme.typography
                    .fontFamily,
                fontSize:
                  `${currentTheme.typography.headingSize}px`,
                fontWeight:
                  currentTheme.typography
                    .headingWeight,
                letterSpacing:
                  `${currentTheme.typography.letterSpacing}px`,
              }}
            >
              Build beautiful interfaces.
            </h3>

            <p
              className="mt-4 max-w-xl"
              style={{
                color:
                  currentTheme.text,
                fontFamily:
                  currentTheme.typography
                    .fontFamily,
                fontSize:
                  `${currentTheme.typography.bodySize}px`,
                fontWeight:
                  currentTheme.typography
                    .bodyWeight,
                lineHeight:
                  currentTheme.typography
                    .lineHeight,
              }}
            >
              Preview your colors,
              typography, radius,
              shadows, spacing and
              semantic states together.
            </p>

            <div
              className="mt-8 flex flex-wrap"
              style={{
                gap: `${currentTheme.spacing.sm}px`,
              }}
            >
              <button
                type="button"
                className="px-5 py-3 text-sm font-semibold"
                style={{
                  backgroundColor:
                    currentTheme.primary,
                  color:
                    currentTheme.background,
                  borderRadius: `${currentTheme.radius.md}px`,
                  boxShadow:
                    currentTheme.shadows.sm,
                }}
              >
                Primary Action
              </button>

              <button
                type="button"
                className="border px-5 py-3 text-sm font-semibold"
                style={{
                  borderColor:
                    currentTheme.secondary,
                  color:
                    currentTheme.text,
                  borderRadius: `${currentTheme.radius.md}px`,
                }}
              >
                Secondary
              </button>
            </div>

            <div
              className="mt-8 grid sm:grid-cols-4"
              style={{
                gap: `${currentTheme.spacing.sm}px`,
              }}
            >
              {[
                {
                  label: "Success",
                  color:
                    currentTheme.success,
                },
                {
                  label: "Warning",
                  color:
                    currentTheme.warning,
                },
                {
                  label: "Error",
                  color:
                    currentTheme.error,
                },
                {
                  label: "Info",
                  color:
                    currentTheme.info,
                },
              ].map(
                (
                  item,
                  itemIndex,
                ) => (
                  <div
                    key={`${item.label}-${item.color}-${itemIndex}`}
                    className="border border-white/10 bg-black/10 p-4"
                    style={{
                      borderRadius: `${currentTheme.radius.md}px`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            item.color,
                        }}
                      />

                      <span className="text-xs font-medium">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMIZER */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <ThemeCustomizer
          theme={currentTheme}
          onChange={handleCustomizeTheme}
          onReset={() => handlePresetSelect(themes[0])}
        />
      </section>

      {/* SAVED THEMES */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            MongoDB
          </span>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Saved Themes
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Themes saved in MongoDB.
          </p>
        </div>

        {loadingThemes ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/40">
            Loading saved themes...
          </div>
        ) : savedThemes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
            No saved themes yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedThemes.map(
              (savedTheme) => {
                const normalized =
                  normalizeTheme(
                    savedTheme,
                  );

                return (
                  <article
                    key={savedTheme._id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    <div
                      className="h-28"
                      style={{
                        background:
                          normalized.gradient ||
                          normalized.background,
                      }}
                    />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-white">
                            {
                              normalized.name
                            }
                          </h3>

                          <p className="mt-1 text-xs text-white/40">
                            {
                              normalized.description
                            }
                          </p>
                        </div>

                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">
                          Saved
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {savedColors(
                          normalized,
                        ).map(
                          (
                            color,
                            colorIndex,
                          ) => (
                            <span
                              key={`${savedTheme._id}-${color}-${colorIndex}`}
                              className="h-5 w-5 rounded-full border border-white/10"
                              style={{
                                backgroundColor:
                                  color,
                              }}
                            />
                          ),
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            loadSavedTheme(
                              savedTheme,
                            )
                          }
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                          Use Theme
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void deleteTheme(
                              savedTheme._id,
                            )
                          }
                          disabled={
                            deletingId !== null
                          }
                          className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          savedTheme._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>
    </>
  );
}