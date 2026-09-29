"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getWorkspaceRole, isAdminWorkspaceRole } from "@/lib/workspace-access";

export function AdminOnlyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { connected, ready, user } = useAuth();
  const allowed = connected && isAdminWorkspaceRole(getWorkspaceRole(user));

  useEffect(() => {
    if (ready && connected && !allowed) router.replace("/dashboard");
  }, [allowed, connected, ready, router]);

  if (!ready || !allowed) {
    return (
      <section className="mx-auto grid min-h-[60vh] max-w-7xl place-items-center px-4 py-16" aria-live="polite">
        <div className="size-12 animate-pulse rounded-full bg-orange-200" aria-label="Vérification des droits d’accès" />
      </section>
    );
  }

  return children;
}
