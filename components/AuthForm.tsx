"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export default function AuthForm({
  mode,
}: Readonly<{ mode: "login" | "signup" }>) {
  const router = useRouter();
  const { acceptUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/${mode === "signup" ? "register" : "login"}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup" ? { name, email, password } : { email, password },
        ),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The authentication service returned an invalid response. Please try again.",
        );
      }
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "Could not authenticate your account.";
        throw new Error(message);
      }

      const user =
        typeof result === "object" &&
        result !== null &&
        "user" in result
          ? result.user
          : null;
      if (
        typeof user !== "object" ||
        user === null ||
        !("id" in user) ||
        typeof user.id !== "string" ||
        !("name" in user) ||
        typeof user.name !== "string" ||
        !("email" in user) ||
        typeof user.email !== "string"
      ) {
        throw new Error("The server returned an invalid account response.");
      }

      acceptUser({ id: user.id, name: user.name, email: user.email });
      const next = new URLSearchParams(window.location.search).get("next");
      const destination =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/dashboard";
      router.replace(destination);
    } catch (submitError) {
      setError(
        submitError instanceof TypeError
          ? `Can't connect to the authentication service at ${API_URL}. Check that the backend is running, then try again.`
          : submitError instanceof Error
            ? submitError.message
            : "Could not authenticate your account.",
      );
    } finally {
      setPending(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <main className="hero-glow flex min-h-[calc(100vh-76px)] items-center justify-center px-5 py-14 text-white sm:px-8">
      <div className="surface-card w-full max-w-md rounded-[1.7rem] p-6 shadow-2xl sm:p-9">
        <Link href="/" className="brand-mark flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black">TS</Link>
        <p className="mt-8 text-xs font-medium uppercase tracking-[.18em] text-violet-200/70">{isSignup ? "Start building" : "Welcome back"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{isSignup ? "Create your account" : "Sign in to your studio"}</h1>
        <p className="mt-2 text-sm leading-6 text-white/50">{isSignup ? "Your design workspace, ready when you are." : "Pick up where your best ideas left off."}</p>

        <form className="mt-8 space-y-4" onSubmit={(event) => void submit(event)}>
          {isSignup && (
            <label className="block text-xs font-medium text-white/70">
              Name
              <input
                autoComplete="name"
                maxLength={80}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-300/50"
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block text-xs font-medium text-white/70">
            Email address
            <input
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-300/50"
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-xs font-medium text-white/70">
            Password
            <input
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              maxLength={128}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-300/50"
              placeholder={isSignup ? "At least 8 characters" : "Your password"}
            />
          </label>
          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm leading-5 text-rose-200">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="nav-primary mt-2 w-full justify-center py-3.5 disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
            {!pending && <span aria-hidden="true">↗</span>}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/45">
          {isSignup ? "Already have an account?" : "New to Theme Studio?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-white/85 underline decoration-white/25 underline-offset-4 hover:text-white">
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
        <p className="mt-6 text-center text-[10px] leading-5 text-white/30">Your password is securely hashed and never returned by our API.</p>
      </div>
    </main>
  );
}
