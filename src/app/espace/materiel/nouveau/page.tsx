import { ArrowLeft, Camera, CircleCheckBig } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";
import { DepositMachineForm } from "@/components/forms/DepositMachineForm";

export const metadata: Metadata = {
  title: "Ajouter un matériel",
  robots: { index: false, follow: false },
};

export default function NewEquipmentPage() {
  return (
    <OwnerWorkspace activeHref="/dashboard/equipment">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard/equipment" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 transition hover:text-orange-700">
          <ArrowLeft size={17} aria-hidden /> Retour à mon matériel
        </Link>

        <div className="mt-5 border-b border-neutral-200 pb-6">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-orange-700"><Camera size={18} aria-hidden /> Nouvelle annonce</p>
          <h1 className="mt-2 text-3xl font-black text-neutral-950 sm:text-4xl">Ajouter un matériel</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">Renseignez les caractéristiques, les conditions de location et des photos nettes. L’annonce sera envoyée à l’administration pour validation avant sa publication.</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-neutral-600 sm:text-sm">
            <span className="inline-flex items-center gap-2"><CircleCheckBig size={16} className="text-orange-600" aria-hidden /> Photo principale obligatoire</span>
            <span className="inline-flex items-center gap-2"><CircleCheckBig size={16} className="text-orange-600" aria-hidden /> Jusqu’à 7 images supplémentaires</span>
            <span className="inline-flex items-center gap-2"><CircleCheckBig size={16} className="text-orange-600" aria-hidden /> Validation avant publication</span>
          </div>
        </div>

        <div className="mt-6">
          <DepositMachineForm />
        </div>
      </div>
    </OwnerWorkspace>
  );
}
