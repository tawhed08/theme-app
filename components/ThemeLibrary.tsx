"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ThemeCard from "@/components/ThemeCard";
import { themes } from "@/data/themes";

export default function ThemeLibrary() {
  const [search, setSearch] = useState("");
  const filteredThemes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return themes.filter(
      (theme) =>
        !query ||
        theme.name.toLowerCase().includes(query) ||
        theme.description.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <main className="min-h-[75vh] bg-[#08090d] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-9 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">The theme library</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">A considered place to begin.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Browse {themes.length} original color directions, then take any one into the full studio.</p>
          </div>
          <label className="block w-full text-xs font-medium text-white/55 sm:max-w-xs">
            Search themes
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Try “ocean” or “violet”…" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-300/40" />
          </label>
        </div>
        <div aria-live="polite" className="mt-6 flex items-center justify-between text-xs text-white/40">
          <span>{filteredThemes.length} {filteredThemes.length === 1 ? "theme" : "themes"}</span>
          <Link href="/generator" className="transition hover:text-white">Generate your own <span aria-hidden="true">↗</span></Link>
        </div>
        {filteredThemes.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
            <h2 className="font-medium">No themes match that search.</h2>
            <button type="button" onClick={() => setSearch("")} className="mt-3 text-sm text-violet-200 underline underline-offset-4">Clear search</button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredThemes.map((theme, index) => (
              <ThemeCard key={`${theme.name}-${theme.primary}-${index}`} theme={theme} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
