"use client";

import type { SpacingSettings } from "@/types/theme";

interface SpacingGeneratorProps {
  value: SpacingSettings;
  onApply?: (
    spacing: SpacingSettings,
  ) => void;
}

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

const items: {
  key: keyof SpacingSettings;
  label: string;
}[] = [
  {
    key: "xs",
    label: "Extra Small",
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
    key: "xxl",
    label: "2XL",
  },
  {
    key: "huge",
    label: "Huge",
  },
  {
    key: "custom",
    label: "Custom",
  },
];

const presets: {
  name: string;
  values: SpacingSettings;
}[] = [
  {
    name: "Compact",
    values: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
      huge: 40,
      custom: 20,
    },
  },
  {
    name: "Balanced",
    values: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
      huge: 48,
      custom: 20,
    },
  },
  {
    name: "Comfort",
    values: {
      xs: 6,
      sm: 10,
      md: 14,
      lg: 20,
      xl: 28,
      xxl: 40,
      huge: 56,
      custom: 24,
    },
  },
  {
    name: "Generous",
    values: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      huge: 64,
      custom: 28,
    },
  },
];

export default function SpacingGenerator({
  value,
  onApply,
}: SpacingGeneratorProps) {
  const spacing = value;

  const updateSpacing = (
    key: keyof SpacingSettings,
    nextValue: number,
  ) => {
    const safeValue = Math.max(
      0,
      Math.min(128, nextValue),
    );

    onApply?.({
      ...spacing,
      [key]: safeValue,
    });
  };

  return (
    <section>
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Spacing Studio
        </span>

        <h2 className="mt-2 text-2xl font-bold">
          Spacing
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-white/40">
          Create a consistent spacing scale for
          padding, margin and layout gaps.
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
                    htmlFor={`spacing-${key}`}
                    className="text-sm font-medium"
                  >
                    {label}
                  </label>

                  <span className="text-xs text-white/30">
                    {spacing[key]}px
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  <input
                    id={`spacing-${key}`}
                    type="range"
                    min="0"
                    max="128"
                    value={spacing[key]}
                    onChange={(event) =>
                      updateSpacing(
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
                    max="128"
                    value={spacing[key]}
                    onChange={(event) =>
                      updateSpacing(
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
              onApply?.(defaultSpacing)
            }
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Reset Spacing
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-lg font-semibold">
            Spacing Preview
          </h3>

          <div className="mt-6 space-y-4">
            {[
              ["XS", spacing.xs],
              ["SM", spacing.sm],
              ["MD", spacing.md],
              ["LG", spacing.lg],
              ["XL", spacing.xl],
              ["2XL", spacing.xxl],
              ["Huge", spacing.huge],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center gap-4"
              >
                <span className="w-10 text-xs font-semibold text-white/50">
                  {label}
                </span>

                <div
                  className="h-8 rounded-lg bg-violet-400/20"
                  style={{
                    width: `${Math.max(
                      Number(value),
                      4,
                    )}px`,
                  }}
                />

                <span className="text-xs text-white/30">
                  {value}px
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-8 rounded-2xl border border-white/10 bg-black/20"
            style={{
              padding: `${spacing.lg}px`,
            }}
          >
            <div
              className="rounded-xl border border-white/10 bg-white/[0.03]"
              style={{
                padding: `${spacing.md}px`,
              }}
            >
              <div className="h-4 w-28 rounded bg-white/10" />

              <div className="mt-3 h-3 w-48 rounded bg-white/5" />

              <div
                className="mt-4 grid grid-cols-2"
                style={{
                  gap: `${spacing.sm}px`,
                }}
              >
                <div className="h-12 rounded-lg bg-white/10" />
                <div className="h-12 rounded-lg bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-lg font-semibold">
          Spacing Presets
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() =>
                onApply?.(
                  preset.values,
                )
              }
              className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:border-white/20 hover:bg-white/5"
            >
              <div className="space-y-2">
                {[
                  preset.values.xs,
                  preset.values.sm,
                  preset.values.md,
                  preset.values.lg,
                  preset.values.xl,
                ].map((value, index) => (
                  <div
                    key={`${preset.name}-${index}`}
                    className="h-2 rounded-full bg-white/10"
                    style={{
                      width: `${Math.max(
                        value * 2,
                        8,
                      )}px`,
                    }}
                  />
                ))}
              </div>

              <p className="mt-5 text-sm font-semibold">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}