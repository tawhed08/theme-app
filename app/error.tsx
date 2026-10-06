"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#08090d] px-5 text-center text-white">
      <div className="max-w-md">
        <p className="text-xs uppercase tracking-[.18em] text-rose-200/70">Something went off track</p>
        <h1 className="mt-3 text-3xl font-semibold">We couldn’t load this page.</h1>
        <p className="mt-3 text-sm leading-6 text-white/50">{error.message || "An unexpected error occurred."}</p>
        <button type="button" onClick={reset} className="nav-primary mt-6">Try again</button>
      </div>
    </main>
  );
}
