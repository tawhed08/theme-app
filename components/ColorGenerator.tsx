"use client";

import { useMemo, useState } from "react";

interface ColorGeneratorProps {
  onApply?: (color: string) => void;
}

type ColorHarmony =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split"
  | "monochromatic";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const value = Number.parseInt(full, 16);

  if (Number.isNaN(value)) {
    return {
      r: 0,
      g: 0,
      b: 0,
    };
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        clamp(Math.round(value), 0, 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  let h = 0;
  let s = 0;

  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;

    s =
      l > 0.5
        ? delta / (2 - max - min)
        : delta / (max + min);

    switch (max) {
      case red:
        h =
          ((green - blue) / delta +
            (green < blue ? 6 : 0)) /
          6;
        break;

      case green:
        h =
          ((blue - red) / delta + 2) /
          6;
        break;

      case blue:
        h =
          ((red - green) / delta + 4) /
          6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  const saturation = s / 100;
  const lightness = l / 100;

  const chroma =
    (1 - Math.abs(2 * lightness - 1)) *
    saturation;

  const x =
    chroma *
    (1 -
      Math.abs(((h / 60) % 2) - 1));

  const m = lightness - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) {
    red = chroma;
    green = x;
  } else if (h < 120) {
    red = x;
    green = chroma;
  } else if (h < 180) {
    green = chroma;
    blue = x;
  } else if (h < 240) {
    green = x;
    blue = chroma;
  } else if (h < 300) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return {
    r: Math.round((red + m) * 255),
    g: Math.round((green + m) * 255),
    b: Math.round((blue + m) * 255),
  };
}

function shiftHue(hex: string, degrees: number) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const hue = (hsl.h + degrees + 360) % 360;

  const result = hslToRgb(
    hue,
    hsl.s,
    hsl.l,
  );

  return rgbToHex(
    result.r,
    result.g,
    result.b,
  );
}

function changeLightness(hex: string, amount: number) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const lightness = clamp(
    hsl.l + amount,
    0,
    100,
  );

  const result = hslToRgb(
    hsl.h,
    hsl.s,
    lightness,
  );

  return rgbToHex(
    result.r,
    result.g,
    result.b,
  );
}

function randomHex() {
  const value = Math.floor(
    Math.random() * 0xffffff,
  );

  return `#${value
    .toString(16)
    .padStart(6, "0")
    .toUpperCase()}`;
}

function getHarmony(
  color: string,
  type: ColorHarmony,
) {
  switch (type) {
    case "complementary":
      return [
        color,
        shiftHue(color, 180),
      ];

    case "analogous":
      return [
        shiftHue(color, -30),
        color,
        shiftHue(color, 30),
      ];

    case "triadic":
      return [
        color,
        shiftHue(color, 120),
        shiftHue(color, 240),
      ];

    case "split":
      return [
        color,
        shiftHue(color, 150),
        shiftHue(color, 210),
      ];

    case "monochromatic":
      return [
        changeLightness(color, 30),
        changeLightness(color, 15),
        color,
        changeLightness(color, -15),
        changeLightness(color, -30),
      ];

    default:
      return [color];
  }
}

export default function ColorGenerator({
  onApply,
}: ColorGeneratorProps) {
  const [color, setColor] = useState("#7C3AED");
  const [copied, setCopied] = useState(false);
  const [harmony, setHarmony] =
    useState<ColorHarmony>("monochromatic");

  const rgb = useMemo(
    () => hexToRgb(color),
    [color],
  );

  const hsl = useMemo(
    () => rgbToHsl(rgb.r, rgb.g, rgb.b),
    [rgb],
  );

  const palette = useMemo(
    () => getHarmony(color, harmony),
    [color, harmony],
  );

  const updateColor = (value: string) => {
    if (!value.startsWith("#")) {
      value = `#${value}`;
    }

    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setColor(value.toUpperCase());
    }
  };

  const applyColor = () => {
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      onApply?.(color);
    }
  };

  const copyColor = async (value = color) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  const generateRandomColor = () => {
    setColor(randomHex());
    setCopied(false);
  };

  const colorIsValid =
    /^#[0-9A-F]{6}$/i.test(color);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Color Studio
        </span>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Explore millions of colors.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
          Pick any color, generate harmonious palettes,
          create shades and tints, and use your color in
          the current theme.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div
            className="h-44 rounded-2xl border border-white/10 shadow-2xl"
            style={{
              backgroundColor: colorIsValid
                ? color
                : "#7C3AED",
            }}
          />

          <div className="mt-6">
            <label
              htmlFor="color-hex"
              className="mb-2 block text-xs font-medium text-white/50"
            >
              HEX Color
            </label>

            <div className="flex gap-3">
              <label
                className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10"
                style={{
                  backgroundColor: colorIsValid
                    ? color
                    : "#7C3AED",
                }}
              >
                <input
                  type="color"
                  value={
                    colorIsValid
                      ? color
                      : "#7C3AED"
                  }
                  onChange={(event) =>
                    setColor(
                      event.target.value.toUpperCase(),
                    )
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Choose color"
                />
              </label>

              <input
                id="color-hex"
                type="text"
                value={color}
                onChange={(event) =>
                  updateColor(event.target.value)
                }
                maxLength={7}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 text-sm font-medium uppercase text-white outline-none transition focus:border-white/30"
                placeholder="#7C3AED"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={generateRandomColor}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Random Color
            </button>

            <button
              type="button"
              onClick={() => void copyColor()}
              disabled={!colorIsValid}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? "Copied!" : "Copy HEX"}
            </button>
          </div>

          <button
            type="button"
            onClick={applyColor}
            disabled={!colorIsValid}
            className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply Color
          </button>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                RGB
              </p>

              <p className="mt-1 text-xs font-medium text-white/70">
                {rgb.r}, {rgb.g}, {rgb.b}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                HSL
              </p>

              <p className="mt-1 text-xs font-medium text-white/70">
                {hsl.h}°, {hsl.s}%, {hsl.l}%
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                HEX
              </p>

              <p className="mt-1 truncate text-xs font-medium text-white/70">
                {color}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Color Harmony
              </h3>

              <p className="mt-1 text-xs text-white/40">
                Generate professional palettes from your
                selected color.
              </p>
            </div>

            <select
              value={harmony}
              onChange={(event) =>
                setHarmony(
                  event.target.value as ColorHarmony,
                )
              }
              className="rounded-xl border border-white/10 bg-[#101217] px-4 py-2.5 text-sm text-white outline-none"
            >
              <option value="monochromatic">
                Monochromatic
              </option>
              <option value="complementary">
                Complementary
              </option>
              <option value="analogous">
                Analogous
              </option>
              <option value="triadic">
                Triadic
              </option>
              <option value="split">
                Split Complementary
              </option>
            </select>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {palette.map((paletteColor, index) => (
              <button
                key={`${paletteColor}-${index}`}
                type="button"
                onClick={() => setColor(paletteColor)}
                className="group overflow-hidden rounded-2xl border border-white/10 text-left transition hover:-translate-y-1 hover:border-white/25"
              >
                <div
                  className="h-28"
                  style={{
                    backgroundColor: paletteColor,
                  }}
                />

                <div className="bg-black/20 p-3">
                  <p className="text-xs font-semibold text-white/80">
                    {paletteColor}
                  </p>

                  <p className="mt-1 text-[10px] text-white/30">
                    Click to use
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">
              Shades & Tints
            </h3>

            <p className="mt-1 text-xs text-white/40">
              Light and dark variations of your current
              color.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-5">
                {[
                  changeLightness(color, 35),
                  changeLightness(color, 20),
                  changeLightness(color, 10),
                  color,
                  changeLightness(color, -20),
                ].map((shade, index) => (
                  <button
                    key={`${shade}-${index}`}
                    type="button"
                    onClick={() => setColor(shade)}
                    className="group relative h-24 transition hover:brightness-110"
                    style={{
                      backgroundColor: shade,
                    }}
                    title={shade}
                  >
                    <span className="absolute bottom-2 left-2 right-2 rounded-md bg-black/30 px-1 py-1 text-[9px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                      {shade}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">
                  Current Color
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {color}
                </p>
              </div>

              <div
                className="h-12 w-12 rounded-xl border border-white/10"
                style={{
                  backgroundColor: color,
                }}
              />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  RGB
                </p>

                <p className="mt-1 text-sm text-white/70">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  HSL
                </p>

                <p className="mt-1 text-sm text-white/70">
                  hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}