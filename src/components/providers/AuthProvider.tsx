"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { demoAccount } from "@/lib/data";

type AuthContextValue = {
  connected: boolean;
  ready: boolean;
  loginDemo: () => void;
  logout: () => void;
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

  return window.localStorage.getItem("matli-authenticated") === "true";
}

function getServerConnectedSnapshot() {
  return false;
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
  const ready = useSyncExternalStore(subscribeReady, getReadySnapshot, getServerReadySnapshot);

  const value = useMemo<AuthContextValue>(
    () => ({
      connected,
      ready,
      loginDemo() {
        window.localStorage.setItem("matli-authenticated", "true");
        window.localStorage.setItem("matli-demo-account", JSON.stringify(demoAccount));
        window.dispatchEvent(new Event("matli-auth-change"));
      },
      logout() {
        window.localStorage.removeItem("matli-authenticated");
        window.localStorage.removeItem("matli-demo-account");
        window.dispatchEvent(new Event("matli-auth-change"));
      },
    }),
    [connected, ready],
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
