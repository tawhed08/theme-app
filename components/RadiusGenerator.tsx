"use client";

import type { RadiusSettings } from "@/types/theme";

interface RadiusGeneratorProps {
  value: RadiusSettings;
  onApply?: (radius: RadiusSettings) => void;
}

const defaultRadius: RadiusSettings = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  custom: 16,
};

const items: {
  key: keyof RadiusSettings;
  label: string;
}[] = [
  {
    key: "none",
    label: "None",
  },
  {
    key: "sm",
    label: "Small",
  },
  {
    key: "md",
    label: "Medium",
  },
  {
    key: "lg",
    label: "Large",
  },
  {
    key: "xl",
    label: "Extra Large",
  },
  {
    key: "custom",
    label: "Custom",
  },
];

const presets: {
  name: string;
  values: RadiusSettings;
}[] = [
  {
    name: "Sharp",
    values: {
      none: 0,
      sm: 2,
      md: 4,
      lg: 6,
      xl: 8,
      custom: 6,
    },
  },
  {
    name: "Soft",
    values: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 20,
      custom: 16,
    },
  },
  {
    name: "Rounded",
    values: {
      none: 0,
      sm: 6,
      md: 12,
      lg: 18,
      xl: 28,
      custom: 20,
    },
  },
  {
    name: "Pill",
    values: {
      none: 0,
      sm: 999,
      md: 999,
      lg: 999,
      xl: 999,
      custom: 999,
    },
  },
];

export default function RadiusGenerator({
  value,
  onApply,
}: RadiusGeneratorProps) {
  const radius = value;

  const updateRadius = (
    key: keyof RadiusSettings,
    nextValue: number,
  ) => {
    const safeValue = Math.max(
      0,
      Math.min(999, nextValue),
    );

    onApply?.({
      ...radius,
      [key]: safeValue,
    });
  };

  return (
    <section>
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Radius Studio
        </span>

        <h2 className="mt-2 text-2xl font-bold">
          Border Radius
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-white/40">
          Create a consistent corner-radius system.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map(({ key, label }) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`radius-${key}`}
                    className="text-sm font-medium"
                  >
                    {label}
                  </label>

                  <span className="text-xs text-white/30">
                    {radius[key]}px
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  <input
                    id={`radius-${key}`}
                    type="range"
                    min="0"
                    max="999"
                    value={radius[key]}
                    onChange={(event) =>
                      updateRadius(
                        key,
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="min-w-0 flex-1"
                  />

                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={radius[key]}
                    onChange={(event) =>
                      updateRadius(
                        key,
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center text-xs text-white outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onApply?.(defaultRadius)
            }
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Reset Radius
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-lg font-semibold">
            Radius Preview
          </h3>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div
              className="border border-white/10 bg-violet-500/20 p-5"
              style={{
                borderRadius: `${radius.sm}px`,
              }}
            >
              <span className="text-xs text-white/40">
                Small
              </span>

              <p className="mt-2 font-semibold">
                Button
              </p>
            </div>

            <div
              className="border border-white/10 bg-cyan-500/20 p-5"
              style={{
                borderRadius: `${radius.md}px`,
              }}
            >
              <span className="text-xs text-white/40">
                Medium
              </span>

              <p className="mt-2 font-semibold">
                Input
              </p>
            </div>

            <div
              className="border border-white/10 bg-emerald-500/20 p-5"
              style={{
                borderRadius: `${radius.lg}px`,
              }}
            >
              <span className="text-xs text-white/40">
                Large
              </span>

              <p className="mt-2 font-semibold">
                Card
              </p>
            </div>

            <div
              className="border border-white/10 bg-orange-500/20 p-5"
              style={{
                borderRadius: `${radius.xl}px`,
              }}
            >
              <span className="text-xs text-white/40">
                Extra Large
              </span>

              <p className="mt-2 font-semibold">
                Modal
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 overflow-hidden rounded-2xl border border-white/10">
            {[
              ["None", radius.none],
              ["SM", radius.sm],
              ["MD", radius.md],
              ["LG", radius.lg],
              ["XL", radius.xl],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-r border-white/10 p-3 last:border-r-0"
              >
                <div
                  className="h-12 bg-white/10"
                  style={{
                    borderRadius: `${value}px`,
                  }}
                />

                <p className="mt-2 text-center text-[9px] text-white/40">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-lg font-semibold">
          Radius Presets
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() =>
                onApply?.(preset.values)
              }
              className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex gap-2">
                {[
                  preset.values.sm,
                  preset.values.md,
                  preset.values.lg,
                  preset.values.xl,
                ].map((value, index) => (
                  <span
                    key={`${preset.name}-${index}`}
                    className="h-8 w-8 bg-white/10"
                    style={{
                      borderRadius: `${value}px`,
                    }}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm font-semibold">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}