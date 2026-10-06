import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-16 text-white sm:px-8">
      <p className="text-xs uppercase tracking-[.18em] text-violet-200/70">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold">Terms of use</h1>
      <p className="mt-6 text-sm leading-7 text-white/60">
        Use Theme Studio responsibly and keep your account credentials private. You retain responsibility for content saved to your workspace and for reviewing exported design tokens before production use. Service availability and generated previews are provided without a guarantee of uninterrupted operation.
      </p>
      <p className="mt-4 text-xs text-white/35">This project terms notice is a starting point and should be reviewed before public deployment.</p>
    </main>
  );
}
