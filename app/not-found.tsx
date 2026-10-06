import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#08090d] px-5 text-center text-white">
      <div>
        <p className="font-mono text-sm text-violet-200/70">404 / NOT FOUND</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">This page took another route.</h1>
        <p className="mt-3 text-sm text-white/50">The link may be old, or the page may have moved.</p>
        <Link href="/" className="nav-primary mt-6">Back to home ↗</Link>
      </div>
    </main>
  );
}
