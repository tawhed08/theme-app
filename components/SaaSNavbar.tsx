"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const links = [
  { label: "Home", href: "/" },
  { label: "Themes", href: "/themes" },
  { label: "Dashboard", href: "/dashboard" },
];

const tools = [
  ["Colors", "/colors"],
  ["Fonts", "/fonts"],
  ["Gradients", "/gradients"],
  ["Radius", "/radius"],
  ["Shadows", "/shadows"],
  ["Spacing", "/spacing"],
  ["Theme generator", "/generator"],
];

export default function SaaSNavbar() {
  const { user, status, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMenuOpen(false);
      setSignOutError("");
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : "Could not sign out.",
      );
    }
  };

  return (
    <header
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setMenuOpen(false);
          setToolsOpen(false);
        }
      }}
      className="navbar-shell sticky top-0 z-50 border-b border-white/[0.08] bg-[#08090d]/85 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Theme Studio home">
          <span className="brand-mark flex h-10 w-10 items-center justify-center rounded-[14px] text-sm font-black text-white">
            TS
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight text-white">theme.studio</span>
            <span className="block text-[10px] tracking-[0.13em] text-white/40">DESIGN SYSTEMS</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-white/55 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white">
              Tools <span className="text-[10px] transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#111218] p-2 shadow-2xl">
              {tools.map(([label, href]) => (
                <Link key={href} href={href} className="block rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </details>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="nav-secondary">{user?.name.split(" ")[0] ?? "Dashboard"}</Link>
              <button type="button" onClick={() => void handleSignOut()} className="nav-secondary">
                Sign out
              </button>
              <Link href="/studio" className="nav-primary">Open Studio <span aria-hidden="true">↗</span></Link>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-secondary">Log in</Link>
              <Link href="/signup" className="nav-secondary">Sign up</Link>
              <Link href="/signup" className="nav-primary">Get started <span aria-hidden="true">↗</span></Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 text-white sm:hidden"
        >
          <span className={`menu-line ${menuOpen ? "menu-line-one-open" : ""}`} />
          <span className={`menu-line ${menuOpen ? "menu-line-two-open" : ""}`} />
          <span className={`menu-line ${menuOpen ? "menu-line-three-open" : ""}`} />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`mobile-nav-panel sm:hidden ${menuOpen ? "mobile-nav-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl gap-1 px-5 pb-5">
          {links.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="mobile-nav-link">
              {link.label}<span aria-hidden="true">↗</span>
            </Link>
          ))}
          <details className="group" open={toolsOpen} onToggle={(event) => setToolsOpen(event.currentTarget.open)}>
            <summary className="flex cursor-pointer list-none items-center justify-between border-b border-white/[0.07] py-3 text-sm text-white/75">
              Tools <span className="text-[10px] transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="grid grid-cols-2 gap-1 pt-2">
              {tools.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </details>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="nav-secondary justify-center">Dashboard</Link>
                <button type="button" onClick={() => void handleSignOut()} className="nav-secondary justify-center">Sign out</button>
                <Link href="/studio" onClick={() => setMenuOpen(false)} className="nav-primary col-span-2 justify-center">Open Studio ↗</Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="nav-secondary justify-center">Log in</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="nav-secondary justify-center">Sign up</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="nav-primary col-span-2 justify-center">Get started ↗</Link>
              </>
            )}
          </div>
        </nav>
      </div>
      {signOutError && (
        <p role="alert" className="mx-auto max-w-7xl px-5 pb-3 text-sm text-rose-200 sm:px-8">
          {signOutError}
        </p>
      )}
    </header>
  );
}
