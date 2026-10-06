"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function ProtectedPage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { status, sessionError, retrySession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      const next = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#08090d] text-white">
        <div className="flex items-center gap-3 text-sm text-white/55" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-violet-300" />
          Checking your secure session…
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#08090d] px-6 text-center text-white">
        <div>
          <p className="text-white/55">Sign in to continue to your private workspace.</p>
          <Link href="/login" className="nav-primary mt-5 inline-flex">Log in</Link>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#08090d] px-6 text-white">
        <div className="max-w-lg text-center">
          <p className="text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">
            Connection issue
          </p>
          <h1 className="mt-3 text-2xl font-semibold">We couldn&apos;t verify your session.</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-rose-200/85">
            {sessionError}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => void retrySession()}
              className="nav-secondary"
            >
              Try again
            </button>
            <Link href="/login" className="nav-primary">Go to login</Link>
          </div>
        </div>
      </main>
    );
  }

  return children;
}
