"use client";

import type { ShadowSettings } from "@/types/theme";

interface ShadowGeneratorProps {
  value: ShadowSettings;
  onApply?: (
    shadows: ShadowSettings,
  ) => void;
}

const defaultShadows: ShadowSettings = {
  none: "none",
  sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
  md: "0 4px 10px rgba(0, 0, 0, 0.10)",
  lg: "0 10px 25px rgba(0, 0, 0, 0.14)",
  xl: "0 20px 45px rgba(0, 0, 0, 0.18)",
  custom: "0 18px 50px rgba(0, 0, 0, 0.25)",
};

const items: {
  key: keyof ShadowSettings;
  label: string;
}[] = [
  ["none", "None"],
  ["sm", "Small"],
  ["md", "Medium"],
  ["lg", "Large"],
  ["xl", "Extra Large"],
  ["custom", "Custom"],
].map(([key, label]) => ({
  key: key as keyof ShadowSettings,
  label,
}));

const presets: {
  name: string;
  values: ShadowSettings;
}[] = [
  {
    name: "Soft",
    values: {
      none: "none",
      sm: "0 1px 3px rgba(0,0,0,0.06)",
      md: "0 4px 12px rgba(0,0,0,0.08)",
      lg: "0 10px 28px rgba(0,0,0,0.10)",
      xl: "0 20px 45px rgba(0,0,0,0.12)",
      custom:
        "0 16px 36px rgba(0,0,0,0.10)",
    },
  },
  {
    name: "Material",
    values: {
      none: "none",
      sm: "0 2px 4px rgba(0,0,0,0.12)",
      md: "0 4px 8px rgba(0,0,0,0.16)",
      lg: "0 8px 16px rgba(0,0,0,0.18)",
      xl: "0 16px 32px rgba(0,0,0,0.22)",
      custom:
        "0 12px 28px rgba(0,0,0,0.20)",
    },
  },
  {
    name: "Glow",
    values: {
      none: "none",
      sm: "0 0 10px rgba(124,58,237,0.15)",
      md: "0 0 20px rgba(124,58,237,0.20)",
      lg: "0 0 35px rgba(124,58,237,0.25)",
      xl: "0 0 55px rgba(124,58,237,0.30)",
      custom:
        "0 0 40px rgba(124,58,237,0.24)",
    },
  },
  {
    name: "Strong",
    values: {
      none: "none",
      sm: "0 2px 6px rgba(0,0,0,0.15)",
      md: "0 6px 14px rgba(0,0,0,0.20)",
      lg: "0 12px 28px rgba(0,0,0,0.25)",
      xl: "0 24px 50px rgba(0,0,0,0.30)",
      custom:
        "0 18px 40px rgba(0,0,0,0.28)",
    },
  },
];

export default function ShadowGenerator({
  value,
  onApply,
}: ShadowGeneratorProps) {
  const shadows = value ?? defaultShadows;

  const updateShadow = (
    key: keyof ShadowSettings,
    nextValue: string,
  ) => {
    onApply?.({
      ...shadows,
      [key]: nextValue,
    });
  };

  return (
    <section>
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Shadow Studio
        </span>

        <h2 className="mt-2 text-2xl font-bold">
          Shadows
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-white/40">
          Create consistent elevation tokens for
          cards, buttons and modals.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="space-y-4">
            {items.map(({ key, label }) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <label
                  htmlFor={`shadow-${key}`}
                  className="text-sm font-medium"
                >
                  {label}
                </label>

                <input
                  id={`shadow-${key}`}
                  type="text"
                  value={shadows[key]}
                  onChange={(event) =>
                    updateShadow(
                      key,
                      event.target.value,
                    )
                  }
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:border-white/25"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onApply?.(defaultShadows)
            }
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Reset Shadows
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-lg font-semibold">
            Shadow Preview
          </h3>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {[
              {
                label: "Small",
                shadow: shadows.sm,
              },
              {
                label: "Medium",
                shadow: shadows.md,
              },
              {
                label: "Large",
                shadow: shadows.lg,
              },
              {
                label: "Extra Large",
                shadow: shadows.xl,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[#181A20] p-6"
                style={{
                  boxShadow: item.shadow,
                }}
              >
                <span className="text-xs uppercase tracking-wider text-white/30">
                  {item.label}
                </span>

                <p className="mt-3 font-semibold">
                  Elevation Surface
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-8 rounded-2xl border border-white/10 bg-[#181A20] p-6"
            style={{
              boxShadow: shadows.custom,
            }}
          >
            <span className="text-xs uppercase tracking-wider text-white/30">
              Custom
            </span>

            <p className="mt-3 text-lg font-semibold">
              Custom Elevation
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-lg font-semibold">
          Shadow Presets
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="h-16 rounded-xl bg-[#181A20]"
                  style={{
                    boxShadow:
                      preset.values.sm,
                  }}
                />

                <div
                  className="h-16 rounded-xl bg-[#181A20]"
                  style={{
                    boxShadow:
                      preset.values.md,
                  }}
                />

                <div
                  className="h-16 rounded-xl bg-[#181A20]"
                  style={{
                    boxShadow:
                      preset.values.lg,
                  }}
                />

                <div
                  className="h-16 rounded-xl bg-[#181A20]"
                  style={{
                    boxShadow:
                      preset.values.xl,
                  }}
                />
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