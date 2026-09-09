"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getWorkspaceRole, isOwnerWorkspaceRole } from "@/lib/workspace-access";

export function OwnerOnlyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { connected, ready, user } = useAuth();
  const allowed = !connected || isOwnerWorkspaceRole(getWorkspaceRole(user));

  useEffect(() => {
    if (ready && connected && !allowed) {
      router.replace("/espace");
    }
  }, [allowed, connected, ready, router]);

  if (!ready || (connected && !allowed)) {
    return (
      <section className="mx-auto grid min-h-[60vh] max-w-7xl place-items-center px-4 py-16" aria-live="polite">
        <div className="h-12 w-12 animate-pulse rounded-full bg-orange-200" aria-label="Chargement de votre espace" />
      </section>
    );
  }

  return children;
}
