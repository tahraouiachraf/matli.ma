"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { canAccessWorkspacePath, getWorkspaceRole } from "@/lib/workspace-access";

export function WorkspaceAccessGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { connected, ready, user } = useAuth();
  const role = getWorkspaceRole(user);
  const allowed = !connected || canAccessWorkspacePath(role, pathname);

  useEffect(() => {
    if (ready && connected && !allowed) {
      router.replace("/espace");
    }
  }, [allowed, connected, ready, router]);

  if (ready && connected && !allowed) {
    return (
      <section className="mx-auto grid min-h-[60vh] max-w-7xl place-items-center px-4 py-16" aria-live="polite">
        <div className="h-12 w-12 animate-pulse rounded-full bg-orange-200" aria-label="Chargement de votre espace" />
      </section>
    );
  }

  return children;
}
