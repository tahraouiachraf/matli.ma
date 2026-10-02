"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { demoAccount } from "@/lib/data";
import { apiRequest } from "@/services/api/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  roles?: Array<{
    id?: string;
    name: string;
    description?: string | null;
  }>;
  phone?: string | null;
  company_name?: string | null;
  city?: string | null;
  description?: string | null;
};

type AuthContextValue = {
  connected: boolean;
  ready: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ message: string; email: string; verification_email_sent?: boolean }>;
  resendVerification: (email: string) => Promise<string>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
};

type AuthPayload = {
  access_token: string;
  token_type: "Bearer";
  user: AuthUser;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  city?: string;
  company_name?: string;
  account_type: "owner" | "client";
};

const AuthContext = createContext<AuthContextValue | null>(null);

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("matli-auth-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("matli-auth-change", callback);
  };
}

function getConnectedSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.localStorage.getItem("matli-api-token"));
}

function getServerConnectedSnapshot() {
  return false;
}

function getUserSnapshot() {
  return window.localStorage.getItem("matli-user") ?? "null";
}

function getServerUserSnapshot() {
  return "null";
}

function subscribeReady() {
  return () => {};
}

function getReadySnapshot() {
  return true;
}

function getServerReadySnapshot() {
  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const connected = useSyncExternalStore(subscribeAuth, getConnectedSnapshot, getServerConnectedSnapshot);
  const userSnapshot = useSyncExternalStore(subscribeAuth, getUserSnapshot, getServerUserSnapshot);
  const hydrated = useSyncExternalStore(subscribeReady, getReadySnapshot, getServerReadySnapshot);
  const token = typeof window === "undefined" ? null : window.localStorage.getItem("matli-api-token");
  const [checkedToken, setCheckedToken] = useState<string | null>(null);
  const ready = hydrated && (!connected || checkedToken === token);
  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot) as AuthUser | null;
    } catch {
      return null;
    }
  }, [userSnapshot]);

  useEffect(() => {
    if (!token) return;

    let active = true;

    apiRequest<{ user: AuthUser }>("/auth/me", { token })
      .then((payload) => {
        if (!active) return;
        const serializedUser = JSON.stringify(payload.user);
        if (window.localStorage.getItem("matli-user") !== serializedUser) {
          window.localStorage.setItem("matli-user", serializedUser);
          window.dispatchEvent(new Event("matli-auth-change"));
        }
        setCheckedToken(token);
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof Error && "status" in error && error.status === 401) {
          window.localStorage.removeItem("matli-authenticated");
          window.localStorage.removeItem("matli-api-token");
          window.localStorage.removeItem("matli-user");
          window.dispatchEvent(new Event("matli-auth-change"));
          return;
        }
        setCheckedToken(token);
      });

    return () => {
      active = false;
    };
  }, [token]);

  function persistAuth(payload: AuthPayload) {
    window.localStorage.setItem("matli-api-token", payload.access_token);
    window.localStorage.setItem("matli-user", JSON.stringify(payload.user));
    window.localStorage.setItem("matli-authenticated", "true");
    window.dispatchEvent(new Event("matli-auth-change"));
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      connected,
      ready,
      user,
      token,
      async login(email: string, password: string) {
        const payload = await apiRequest<AuthPayload>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        persistAuth(payload);
      },
      async register(payload: RegisterPayload) {
        return apiRequest<{ message: string; email: string; verification_email_sent?: boolean }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      },
      async resendVerification(email: string) {
        const response = await apiRequest<{ message: string }>("/auth/email/resend", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        return response.message;
      },
      async loginDemo() {
        const payload = await apiRequest<AuthPayload>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: demoAccount.email, password: demoAccount.password }),
        });
        persistAuth(payload);
        window.localStorage.setItem("matli-demo-account", JSON.stringify(demoAccount));
      },
      async logout() {
        const currentToken = window.localStorage.getItem("matli-api-token");
        if (currentToken) {
          await apiRequest("/auth/logout", { method: "POST", token: currentToken }).catch(() => null);
        }
        window.localStorage.removeItem("matli-authenticated");
        window.localStorage.removeItem("matli-demo-account");
        window.localStorage.removeItem("matli-api-token");
        window.localStorage.removeItem("matli-user");
        window.dispatchEvent(new Event("matli-auth-change"));
      },
      updateUser(nextUser: AuthUser) {
        window.localStorage.setItem("matli-user", JSON.stringify(nextUser));
        window.dispatchEvent(new Event("matli-auth-change"));
      },
    }),
    [connected, ready, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
