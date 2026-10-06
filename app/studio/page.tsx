import type { Metadata } from "next";
import ThemeStudio from "@/components/ThemeStudio";
import ProtectedPage from "@/components/ProtectedPage";
import { themes } from "@/data/themes";
import type { Theme } from "@/types/theme";

export const metadata: Metadata = {
  title: "Full theme workspace",
  robots: { index: false, follow: false },
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string }>;
}) {
  const { preset } = await searchParams;
  const initialTheme: Theme | undefined = themes.find(
    (theme) => theme.name === preset,
  );

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-[#05070b] text-white">
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-violet-200/70">Your workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Full theme studio</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">Tune every token in one connected live preview, save it privately, and take the CSS with you.</p>
        </section>
        <ThemeStudio initialTheme={initialTheme} />
      </main>
    </ProtectedPage>
  );
}
