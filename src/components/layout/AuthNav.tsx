"use client";

import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("matli-auth-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("matli-auth-change", callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem("matli-authenticated") === "true";
}

function getServerSnapshot() {
  return false;
}

export function AuthNav({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const connected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (connected) {
    return (
      <ButtonLink href="/profil" className={mobile ? "mt-2 w-full" : ""} onClick={onNavigate}>
        Profil
      </ButtonLink>
    );
  }

  return (
    <ButtonLink href="/connexion" variant="secondary" className={mobile ? "mt-2 w-full" : ""} onClick={onNavigate}>
      Se connecter
    </ButtonLink>
  );
}
