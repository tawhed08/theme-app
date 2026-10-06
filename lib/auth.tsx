"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_URL } from "@/lib/config";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  sessionError: string;
  acceptUser: (user: AuthUser) => void;
  retrySession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [sessionError, setSessionError] = useState("");

  const loadSession = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        cache: "no-store",
        signal,
      });
      let data: unknown;
      try {
        data = await response.json();
      } catch {
        throw new Error("The authentication service returned an invalid response.");
      }
      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : `The authentication service returned HTTP ${response.status}.`;
        throw new Error(message);
      }

      if (signal?.aborted) return;
      const currentUser =
        typeof data === "object" && data !== null && "user" in data
          ? data.user
          : null;
      if (currentUser === null) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }
      if (
        typeof currentUser !== "object" ||
        !("id" in currentUser) ||
        typeof currentUser.id !== "string" ||
        !("name" in currentUser) ||
        typeof currentUser.name !== "string" ||
        !("email" in currentUser) ||
        typeof currentUser.email !== "string"
      ) {
        throw new Error("The authentication service returned an invalid account.");
      }
      if (signal?.aborted) return;
      setUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      });
      setStatus("authenticated");
    } catch (error) {
      if (signal?.aborted) return;
      setUser(null);
      setStatus("error");
      setSessionError(
        error instanceof TypeError
          ? `Can't connect to the authentication service at ${API_URL}. Check that the backend is running, then try again.`
          : error instanceof Error
            ? error.message
            : "Could not verify your session.",
      );
    }
  }, []);

  const retrySession = useCallback(() => {
    setStatus("loading");
    setSessionError("");
    return loadSession();
  }, [loadSession]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void loadSession(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadSession]);

  const acceptUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    setSessionError("");
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(async () => {
    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          `Can't connect to the authentication service at ${API_URL}. Check that the backend is running, then try again.`,
        );
      }
      throw error;
    }
    if (!response.ok) {
      let message = `Could not sign out (HTTP ${response.status}). Please try again.`;
      try {
        const data: unknown = await response.json();
        if (
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
        ) {
          message = data.message;
        }
      } catch {
        throw new Error(message);
      }
      throw new Error(message);
    }
    setUser(null);
    setSessionError("");
    setStatus("unauthenticated");
  }, []);

  const contextValue = useMemo(
    () => ({ user, status, sessionError, acceptUser, retrySession, signOut }),
    [user, status, sessionError, acceptUser, retrySession, signOut],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
