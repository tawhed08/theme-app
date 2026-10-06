import Link from "next/link";
import type { Theme } from "@/types/theme";

export default function ThemeCard({
  theme,
  index = 0,
}: Readonly<{ theme: Theme; index?: number }>) {
  const savedThemeId =
    "_id" in theme && typeof theme._id === "string"
      ? theme._id
      : null;
  const colorList = [
    theme.primary,
    theme.secondary,
    theme.accent,
    theme.success ?? "#22C55E",
    theme.warning ?? "#F59E0B",
  ];

  return (
    <article
      data-carousel-card
      className="surface-card group min-w-[min(84vw,340px)] snap-start overflow-hidden rounded-[1.4rem] transition duration-300 hover:-translate-y-1 hover:border-white/20"
    >
      <div
        className="theme-preview-sheen theme-card-preview relative h-44 overflow-hidden p-5"
        style={{
          background: theme.gradient || theme.background,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="relative flex items-center justify-between">
          <span className="rounded-full border border-white/25 bg-black/15 px-3 py-1 text-[10px] uppercase tracking-[.14em] text-white/80 backdrop-blur">
            Curated {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex gap-1.5">
            {colorList.slice(0, 3).map((color, colorIndex) => (
              <span
                key={`${theme.name}-preview-${colorIndex}`}
                className="h-5 w-5 rounded-full border border-white/35"
                style={{ backgroundColor: color }}
              />
            ))}
          </span>
        </div>
        <div
          className="absolute bottom-4 left-5 right-5 flex h-16 items-center gap-3 rounded-xl border border-white/15 bg-black/15 p-3 backdrop-blur-sm"
          style={{ color: theme.text }}
        >
          <span className="h-9 w-9 rounded-lg" style={{ backgroundColor: theme.primary }} />
          <span className="flex-1">
            <span className="block h-2 w-24 rounded-full bg-current/70" />
            <span className="mt-2 block h-1.5 w-16 rounded-full bg-current/30" />
          </span>
          <span className="h-7 w-7 rounded-full" style={{ backgroundColor: theme.accent }} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold tracking-tight text-white">{theme.name}</h3>
            <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-white/48">{theme.description}</p>
          </div>
          <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: theme.primary }} />
        </div>
        <div className="mt-4 flex gap-2">
          {colorList.map((color, colorIndex) => (
            <span
              key={`${theme.name}-swatch-${colorIndex}`}
              title={color}
              className="h-7 flex-1 rounded-md border border-white/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <Link
          href={
            savedThemeId
              ? `/studio?themeId=${encodeURIComponent(savedThemeId)}`
              : `/studio?preset=${encodeURIComponent(theme.name)}`
          }
          className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/75 transition group-hover:text-white"
        >
          Preview theme <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
        </Link>
      </div>
    </article>
  );
}
