import { AuthGuard } from "@/components/auth/AuthGuard";
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
      title="Connectez-vous pour accéder au dashboard"
      message="Le tableau de bord propriétaire, les machines, les demandes, les finances et les documents sont réservés aux comptes connectés."
    >
      {children}
    </AuthGuard>
  );
}
