"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";
import ThemeCard from "@/components/ThemeCard";
import { useAuth } from "@/lib/auth";
import type { Theme } from "@/types/theme";
import { API_URL } from "@/lib/config";

interface SavedTheme extends Theme {
  _id: string;
  createdAt?: string;
}

const isSavedTheme = (value: unknown): value is SavedTheme =>
  typeof value === "object" &&
  value !== null &&
  "_id" in value &&
  typeof value._id === "string" &&
  "name" in value &&
  typeof value.name === "string" &&
  "background" in value &&
  typeof value.background === "string" &&
  "surface" in value &&
  typeof value.surface === "string" &&
  "primary" in value &&
  typeof value.primary === "string" &&
  "secondary" in value &&
  typeof value.secondary === "string" &&
  "text" in value &&
  typeof value.text === "string" &&
  "accent" in value &&
  typeof value.accent === "string";

function DashboardContent() {
  const { user } = useAuth();
  const [themes, setThemes] = useState<SavedTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadThemes = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/themes`, {
        credentials: "include",
        cache: "no-store",
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : "Could not load saved themes.";
        throw new Error(message);
      }
      if (!Array.isArray(data) || !data.every(isSavedTheme)) {
        throw new Error("The server returned an invalid theme list.");
      }
      setThemes(data);
    } catch (loadError) {
      setError(
        loadError instanceof TypeError
          ? `Could not connect to ${API_URL}.`
          : loadError instanceof Error
            ? loadError.message
            : "Could not load saved themes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadThemes();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadThemes]);

  const deleteTheme = async (id: string) => {
    setDeleting(id);
    setError("");
    try {
      const response = await fetch(`${API_URL}/themes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : "Could not delete this theme.";
        throw new Error(message);
      }
      setThemes((current) => current.filter((theme) => theme._id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof TypeError
          ? `Could not connect to ${API_URL}.`
          : deleteError instanceof Error
            ? deleteError.message
            : "Could not delete this theme.",
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="min-h-[75vh] bg-[#08090d] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">Your workspace</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Good to see you, {user?.name.split(" ")[0]}.</h1>
            <p className="mt-3 text-sm text-white/50">Your saved systems, ready when you are.</p>
          </div>
          <Link href="/studio" className="nav-primary">Create a new theme <span aria-hidden="true">↗</span></Link>
        </div>

        {error && (
          <div role="alert" className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            {error}
            <button type="button" onClick={() => void loadThemes(true)} className="underline underline-offset-4">Try again</button>
          </div>
        )}

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs text-white/45">Saved themes</p>
            <p className="mt-3 text-3xl font-semibold">{loading ? "—" : themes.length}</p>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs text-white/45">Workspace</p>
            <p className="mt-3 text-lg font-medium">Private library</p>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs text-white/45">Account</p>
            <p className="mt-3 truncate text-sm font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">My themes</h2>
            <p className="mt-1 text-xs text-white/45">Your saved design systems, newest first.</p>
          </div>
          <Link href="/themes" className="text-xs text-white/65 transition hover:text-white">Explore library ↗</Link>
        </div>

        {loading ? (
          <div role="status" className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-12 text-center text-sm text-white/45">
            <span className="mx-auto mb-3 block h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-violet-200" />
            Loading your themes…
          </div>
        ) : themes.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
            <h3 className="text-lg font-medium">A blank canvas is a good place to start.</h3>
            <p className="mt-2 text-sm text-white/45">Create a theme or explore the library for inspiration.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/studio" className="nav-primary">Create a theme ↗</Link>
              <Link href="/themes" className="nav-secondary">Explore themes</Link>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themes.map((theme, index) => (
              <div key={theme._id} className="relative">
                <ThemeCard theme={theme} index={index} />
                <div className="absolute right-4 top-[10.6rem] z-10">
                  <button
                    type="button"
                    onClick={() => void deleteTheme(theme._id)}
                    disabled={deleting !== null}
                    className="rounded-lg border border-rose-300/20 bg-[#0c0c11]/90 px-2.5 py-1.5 text-[10px] text-rose-200 backdrop-blur transition hover:bg-rose-400/15 disabled:opacity-50"
                  >
                    {deleting === theme._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <ProtectedPage>
      <DashboardContent />
    </ProtectedPage>
  );
}
