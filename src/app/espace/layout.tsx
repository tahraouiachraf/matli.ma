import { AuthGuard } from "@/components/auth/AuthGuard";
import { WorkspaceAccessGuard } from "@/components/auth/WorkspaceAccessGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function OwnerSpaceLayout({ children }: LayoutProps<"/espace">) {
  return (
    <AuthGuard
      title="Connectez-vous pour accéder à votre espace"
      message="Retrouvez les fonctionnalités et les informations disponibles selon votre type de compte MATLI."
    >
      <WorkspaceAccessGuard>{children}</WorkspaceAccessGuard>
    </AuthGuard>
  );
}
