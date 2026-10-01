import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { WorkspaceAccessGuard } from "@/components/auth/WorkspaceAccessGuard";
import { DepositMachineForm } from "@/components/forms/DepositMachineForm";
import { DepositSection } from "@/components/sections/DepositSection";
import { RequestsPreviewSection } from "@/components/sections/RequestsPreviewSection";
import { getMarketplaceRequestsStrict } from "@/services/api/matli";

export const metadata: Metadata = {
  title: "Déposer un matériel",
  description: "Publiez votre tractopelle, pelle, chargeuse ou nacelle sur MATLI et recevez des demandes de location.",
  robots: { index: false, follow: false },
};

export default async function DepositPage() {
  const requests = await getMarketplaceRequestsStrict().catch(() => []);

  return (
    <AuthGuard
      title="Connectez-vous avec un compte propriétaire"
      message="La publication de matériel est réservée aux propriétaires et à l’administration MATLI."
    >
      <WorkspaceAccessGuard>
        <DepositSection />
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="font-bold text-orange-600">Publication rapide</p>
            <h1 className="mt-2 text-4xl font-black">Ajoutez votre machine à louer.</h1>
            <p className="mt-4 text-neutral-600">
              Ce formulaire prépare les informations nécessaires pour publier une machine: propriétaire, machine, ville, prix, options, photos et disponibilité.
            </p>
          </div>
          <DepositMachineForm />
        </section>
        <RequestsPreviewSection requests={requests} />
      </WorkspaceAccessGuard>
    </AuthGuard>
  );
}
