"use client";

import { useEffect, useMemo, useState } from "react";
import type { TypographySettings } from "@/types/theme";

interface TypographyGeneratorProps {
  value: TypographySettings;
  onApply?: (typography: TypographySettings) => void;
}

interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  files: Record<string, string>;
  version?: string;
  lastModified?: string;
}

const fallbackFonts: GoogleFont[] = [
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["400", "500", "600", "700", "800"],
    subsets: ["latin"],
    files: {},
  },
  {
    family: "Roboto",
    category: "sans-serif",
    variants: ["400", "500", "700"],
    subsets: ["latin"],
    files: {},
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["latin"],
    files: {},
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["latin"],
    files: {},
  },
  {
    family: "Merriweather",
    category: "serif",
    variants: ["400", "700"],
    subsets: ["latin"],
    files: {},
  },
  {
    family: "Bebas Neue",
    category: "display",
    variants: ["400"],
    subsets: ["latin"],
    files: {},
  },
  {
    family: "Noto Sans Bengali",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["bengali", "latin"],
    files: {},
  },
  {
    family: "Noto Serif Bengali",
    category: "serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["bengali", "latin"],
    files: {},
  },
];

const categoryOptions = [
  "all",
  "sans-serif",
  "serif",
  "display",
  "handwriting",
  "monospace",
];

const subsetOptions = [
  "all",
  "latin",
  "bengali",
  "arabic",
  "devanagari",
  "hebrew",
  "greek",
  "cyrillic",
  "vietnamese",
  "japanese",
  "korean",
  "chinese-simplified",
  "chinese-traditional",
];

const isGoogleFont = (font: unknown): font is GoogleFont =>
  typeof font === "object" &&
  font !== null &&
  "family" in font &&
  typeof font.family === "string" &&
  "category" in font &&
  typeof font.category === "string" &&
  "variants" in font &&
  Array.isArray(font.variants) &&
  font.variants.every(
    (variant: unknown) => typeof variant === "string",
  ) &&
  "subsets" in font &&
  Array.isArray(font.subsets) &&
  font.subsets.every(
    (subset: unknown) => typeof subset === "string",
  ) &&
  "files" in font &&
  typeof font.files === "object" &&
  font.files !== null &&
  Object.values(font.files).every(
    (file) => typeof file === "string",
  );

export default function TypographyGenerator({
  value,
  onApply,
}: TypographyGeneratorProps) {
  const [fonts, setFonts] =
    useState<GoogleFont[]>(fallbackFonts);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subset, setSubset] = useState("all");

  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const updateTypography = (
    updates: Partial<TypographySettings>,
  ) => {
    onApply?.({
      ...value,
      ...updates,
    });
    setApplied(false);
  };

  useEffect(() => {
    let cancelled = false;

    const loadFonts = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/fonts");

        if (!response.ok) {
          throw new Error("Google Fonts request failed.");
        }

        const data: unknown = await response.json();
        const apiFonts: unknown[] | null =
          typeof data === "object" &&
          data !== null &&
          "fonts" in data &&
          Array.isArray(data.fonts)
            ? data.fonts
            : null;

        const validFonts =
          apiFonts && apiFonts.every(isGoogleFont)
            ? apiFonts
            : null;

        if (!cancelled) {
          setFonts(
            validFonts && validFonts.length > 0
              ? validFonts
              : fallbackFonts,
          );
        }
      } catch {
        if (!cancelled) {
          setFonts(fallbackFonts);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFonts();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedFont = useMemo(
    () =>
      fonts.find(
        (font) => font.family === value.fontFamily,
      ),
    [fonts, value.fontFamily],
  );

  const filteredFonts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return fonts.filter((font) => {
      const matchesSearch =
        !query ||
        font.family.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" ||
        font.category === category;

      const matchesSubset =
        subset === "all" ||
        font.subsets.includes(subset);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubset
      );
    });
  }, [fonts, search, category, subset]);

  useEffect(() => {
    if (!selectedFont) {
      return;
    }

    const fontUrl = selectedFont.files?.["400"];

    if (!fontUrl) {
      return;
    }

    const styleId = "theme-studio-selected-font";

    let styleElement =
      document.getElementById(
        styleId,
      ) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement =
        document.createElement("style");

      styleElement.id = styleId;

      document.head.appendChild(
        styleElement,
      );
    }

    styleElement.textContent = `
      @font-face {
        font-family: "${selectedFont.family}";
        src: url("${fontUrl}") format("woff2");
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
      }
    `;
  }, [selectedFont]);

  const css = useMemo(() => {
    return `:root {
  --font-family: "${value.fontFamily}", sans-serif;
  --heading-size: ${value.headingSize}px;
  --body-size: ${value.bodySize}px;
  --heading-weight: ${value.headingWeight};
  --body-weight: ${value.bodyWeight};
  --line-height: ${value.lineHeight};
  --letter-spacing: ${value.letterSpacing}px;
}

body {
  font-family: var(--font-family);
  font-size: var(--body-size);
  font-weight: var(--body-weight);
  line-height: var(--line-height);
  letter-spacing: var(--letter-spacing);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-family);
  font-size: var(--heading-size);
  font-weight: var(--heading-weight);
}`;
  }, [
    value,
  ]);

  const copyCSS = () => {
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
            ? `Could not copy typography CSS: ${error.message}`
            : "Could not copy typography CSS. Check browser clipboard permissions.",
        );
      });
  };

  const applyTypography = () => {
    setApplied(true);

    window.setTimeout(() => {
      setApplied(false);
    }, 2000);
  };

  const resetTypography = () => {
    updateTypography({
      fontFamily: "Inter",
      headingSize: 48,
      bodySize: 16,
      headingWeight: 700,
      bodyWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
    });
    setSearch("");
    setCategory("all");
    setSubset("all");
    setCopied(false);
    setApplied(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Typography
          </span>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Global Font Library
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Search and explore fonts from the Google
            Fonts catalog, including multiple writing
            systems and languages.
          </p>
        </div>

        <button
          type="button"
          onClick={resetTypography}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Font Library */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Font Library
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {loading
                    ? "Loading fonts..."
                    : `${filteredFonts.length} fonts found`}
                </p>
              </div>

              {loading && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white" />
              )}
            </div>

          </div>

          {/* Search */}
          <div>
            <label
              htmlFor="font-search"
              className="sr-only"
            >
              Search fonts
            </label>

            <input
              id="font-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search fonts..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30"
            />
          </div>

          {/* Category */}
          <div className="mt-4">
            <label
              htmlFor="font-category"
              className="mb-2 block text-xs font-medium text-white/40"
            >
              Category
            </label>

            <select
              id="font-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-[#0d1017] px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            >
              {categoryOptions.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option === "all"
                      ? "All Categories"
                      : option}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Script */}
          <div className="mt-4">
            <label
              htmlFor="font-subset"
              className="mb-2 block text-xs font-medium text-white/40"
            >
              Language / Script
            </label>

            <select
              id="font-subset"
              value={subset}
              onChange={(event) =>
                setSubset(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-[#0d1017] px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            >
              {subsetOptions.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option === "all"
                      ? "All Languages"
                      : option}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Font List */}
          <div className="mt-5 max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {filteredFonts.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-sm font-medium">
                  No fonts found
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Try another search or filter.
                </p>
              </div>
            ) : (
              filteredFonts.map((font) => {
                const active =
                  font.family === value.fontFamily;

                return (
                  <button
                    key={font.family}
                    type="button"
                    onClick={() =>
                      updateTypography({
                        fontFamily: font.family,
                      })
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-white/30 bg-white/[0.08]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className="min-w-0 flex-1 truncate text-lg text-white"
                        style={{
                          fontFamily: `"${font.family}", sans-serif`,
                        }}
                      >
                        {font.family}
                      </div>

                      {active && (
                        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-black">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/40">
                        {font.category}
                      </span>

                      <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/40">
                        {font.variants.length} styles
                      </span>

                      {font.subsets
                        .slice(0, 3)
                        .map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/40"
                          >
                            {item}
                          </span>
                        ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Preview + Controls */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-sm font-semibold">
                Typography Preview
              </p>

              <p className="mt-1 text-xs text-white/40">
                {value.fontFamily}
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
              {selectedFont?.category ??
                "sans-serif"}
            </span>
          </div>

          <div
            className="p-6 sm:p-10"
            style={{
              fontFamily: `"${value.fontFamily}", sans-serif`,
              letterSpacing: `${value.letterSpacing}px`,
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Global Typography
            </span>

            <h3
              className="mt-4 tracking-tight text-white"
              style={{
                fontSize: `${value.headingSize}px`,
                fontWeight: value.headingWeight,
                lineHeight: 1.1,
              }}
            >
              Build beautiful interfaces.
            </h3>

            <p
              className="mt-6 max-w-2xl text-white/55"
              style={{
                fontSize: `${value.bodySize}px`,
                fontWeight: value.bodyWeight,
                lineHeight: value.lineHeight,
              }}
            >
              Typography creates hierarchy, personality,
              rhythm, and readability. Choose a font from
              the global library and customize your type
              scale in real time.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p
                  className="text-white"
                  style={{
                    fontSize: `${value.bodySize}px`,
                    fontWeight: value.headingWeight,
                  }}
                >
                  Heading Style
                </p>

                <p
                  className="mt-2 text-white/40"
                  style={{
                    fontSize: `${value.bodySize}px`,
                    fontWeight: value.bodyWeight,
                    lineHeight: value.lineHeight,
                  }}
                >
                  Primary text hierarchy
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p
                  className="text-white"
                  style={{
                    fontSize: `${value.bodySize}px`,
                    fontWeight: value.headingWeight,
                  }}
                >
                  Body Style
                </p>

                <p
                  className="mt-2 text-white/40"
                  style={{
                    fontSize: `${value.bodySize}px`,
                    fontWeight: value.bodyWeight,
                    lineHeight: value.lineHeight,
                  }}
                >
                  Supporting interface text
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="heading-size"
                    className="text-xs font-medium text-white/60"
                  >
                    Heading Size
                  </label>

                  <span className="text-xs text-white/40">
                    {value.headingSize}px
                  </span>
                </div>

                <input
                  id="heading-size"
                  type="range"
                  min="24"
                  max="96"
                  value={value.headingSize}
                  onChange={(event) =>
                    updateTypography({
                      headingSize: Number(event.target.value),
                    })
                  }
                  className="mt-3 w-full accent-white"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="body-size"
                    className="text-xs font-medium text-white/60"
                  >
                    Body Size
                  </label>

                  <span className="text-xs text-white/40">
                    {value.bodySize}px
                  </span>
                </div>

                <input
                  id="body-size"
                  type="range"
                  min="12"
                  max="28"
                  value={value.bodySize}
                  onChange={(event) =>
                    updateTypography({
                      bodySize: Number(event.target.value),
                    })
                  }
                  className="mt-3 w-full accent-white"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="line-height"
                    className="text-xs font-medium text-white/60"
                  >
                    Line Height
                  </label>

                  <span className="text-xs text-white/40">
                    {value.lineHeight}
                  </span>
                </div>

                <input
                  id="line-height"
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  value={value.lineHeight}
                  onChange={(event) =>
                    updateTypography({
                      lineHeight: Number(event.target.value),
                    })
                  }
                  className="mt-3 w-full accent-white"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="letter-spacing"
                    className="text-xs font-medium text-white/60"
                  >
                    Letter Spacing
                  </label>

                  <span className="text-xs text-white/40">
                    {value.letterSpacing}px
                  </span>
                </div>

                <input
                  id="letter-spacing"
                  type="range"
                  min="-2"
                  max="5"
                  step="0.1"
                  value={value.letterSpacing}
                  onChange={(event) =>
                    updateTypography({
                      letterSpacing: Number(event.target.value),
                    })
                  }
                  className="mt-3 w-full accent-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={applyTypography}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {applied
                  ? "Applied!"
                  : "Apply Typography"}
              </button>

              <button
                type="button"
                onClick={copyCSS}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {copied
                  ? "CSS Copied!"
                  : "Copy CSS"}
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
        </div>
      </div>

      {/* CSS Output */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">
            CSS Output
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Ready to copy into your project.
          </p>
        </div>

        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-5 text-xs leading-6 text-white/60">
          <code>{css}</code>
        </pre>
      </div>
    </section>
  );
}