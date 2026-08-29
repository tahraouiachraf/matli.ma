import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DepositMachineForm } from "@/components/forms/DepositMachineForm";
import { DepositSection } from "@/components/sections/DepositSection";
import { RequestsPreviewSection } from "@/components/sections/RequestsPreviewSection";

export const metadata: Metadata = {
  title: "Déposer un matériel",
  description: "Publiez votre tractopelle, pelle, chargeuse ou nacelle sur MATLI et recevez des demandes de location.",
};

export default function DepositPage() {
  return (
    <AuthGuard
      title="Connectez-vous pour déposer une machine"
      message="La publication de matériel est réservée aux comptes connectés afin de protéger les propriétaires, les clients et les futures réservations."
    >
      <DepositSection />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="font-bold text-orange-600">Publication rapide</p>
          <h1 className="mt-2 text-4xl font-black">Ajoutez votre machine à louer.</h1>
          <p className="mt-4 text-neutral-600">
            Ce formulaire est statique pour l’instant. Il prépare exactement les champs que l’API Laravel recevra ensuite: propriétaire, machine, ville, prix, options, photos et disponibilité.
          </p>
        </div>
        <DepositMachineForm />
      </section>
      <RequestsPreviewSection />
    </AuthGuard>
  );
}
