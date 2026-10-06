"use client";

import type { Theme } from "@/types/theme";

interface ThemeCustomizerProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  onReset: () => void;
}

interface ColorControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorControl({
  label,
  value,
  onChange,
}: ColorControlProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">
            {label}
          </p>

          <p className="mt-1 text-xs text-white/40">
            {value}
          </p>
        </div>

        <label
          className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10"
          style={{
            backgroundColor: value,
          }}
        >
          <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={`${label} color`}
          />
        </label>
      </div>
    </div>
  );
}

export default function ThemeCustomizer({
  theme,
  onChange,
  onReset,
}: ThemeCustomizerProps) {
  const updateColor = (
    key: keyof Theme,
    value: string,
  ) => {
    onChange({
      ...theme,
      [key]: value,
    });
  };

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              color: theme.primary,
            }}
          >
            Theme Customizer
          </span>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Customize {theme.name}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Change the colors below and see your theme update instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          <ColorControl
            label="Background"
            value={theme.background}
            onChange={(value) =>
              updateColor("background", value)
            }
          />

          <ColorControl
            label="Surface"
            value={theme.surface}
            onChange={(value) =>
              updateColor("surface", value)
            }
          />

          <ColorControl
            label="Primary"
            value={theme.primary}
            onChange={(value) =>
              updateColor("primary", value)
            }
          />

          <ColorControl
            label="Secondary"
            value={theme.secondary}
            onChange={(value) =>
              updateColor("secondary", value)
            }
          />

          <ColorControl
            label="Text"
            value={theme.text}
            onChange={(value) =>
              updateColor("text", value)
            }
          />

          <ColorControl
            label="Accent"
            value={theme.accent}
            onChange={(value) =>
              updateColor("accent", value)
            }
          />
        </div>

        <div
          className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          style={{
            backgroundColor: theme.background,
            color: theme.text,
          }}
        >
          <div
            className="flex items-center justify-between border-b px-5 py-4"
            style={{
              borderColor: `${theme.text}12`,
              backgroundColor: theme.surface,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-xl"
                style={{
                  backgroundColor: theme.primary,
                }}
              />

              <div>
                <div
                  className="h-2.5 w-20 rounded-full"
                  style={{
                    backgroundColor: theme.text,
                    opacity: 0.85,
                  }}
                />

                <div
                  className="mt-2 h-2 w-12 rounded-full"
                  style={{
                    backgroundColor: theme.text,
                    opacity: 0.25,
                  }}
                />
              </div>
            </div>

            <div
              className="h-8 w-8 rounded-full"
              style={{
                backgroundColor: theme.secondary,
              }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <span
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: theme.accent,
              }}
            >
              Live Preview
            </span>

            <h3
              className="mt-3 text-3xl font-bold tracking-tight"
              style={{
                color: theme.text,
              }}
            >
              Your custom theme
            </h3>

            <p
              className="mt-3 max-w-lg text-sm leading-6"
              style={{
                color: theme.text,
                opacity: 0.55,
              }}
            >
              This preview changes instantly when you modify your
              theme colors.
            </p>

            <div
              className="mt-7 rounded-2xl border p-5"
              style={{
                backgroundColor: theme.surface,
                borderColor: `${theme.text}12`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: theme.text,
                    }}
                  >
                    Dashboard
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: theme.text,
                      opacity: 0.4,
                    }}
                  >
                    Your workspace
                  </p>
                </div>

                <div
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    color: theme.primary,
                  }}
                >
                  Active
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[theme.primary, theme.secondary, theme.accent].map(
                  (color, index) => (
                    <div
                      key={index}
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: theme.background,
                      }}
                    >
                      <div
                        className="h-2 w-8 rounded-full"
                        style={{
                          backgroundColor: color,
                        }}
                      />

                      <div
                        className="mt-4 h-2 w-full rounded-full"
                        style={{
                          backgroundColor: theme.text,
                          opacity: 0.12,
                        }}
                      />

                      <div
                        className="mt-2 h-2 w-2/3 rounded-full"
                        style={{
                          backgroundColor: theme.text,
                          opacity: 0.07,
                        }}
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.background,
                  }}
                >
                  Primary Button
                </button>

                <button
                  type="button"
                  className="rounded-xl border px-5 py-3 text-sm font-medium"
                  style={{
                    borderColor: `${theme.text}18`,
                    color: theme.text,
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}