import { ArrowLeft, PencilLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { OwnerWorkspace } from "@/components/dashboard/OwnerWorkspace";
import { EditEquipmentForm } from "@/components/forms/EditEquipmentForm";

export const metadata: Metadata = {
  title: "Modifier un matériel",
  robots: { index: false, follow: false },
};

export default async function EditEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <OwnerWorkspace activeHref="/dashboard/equipment">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard/equipment" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 transition hover:text-orange-700"><ArrowLeft size={17} aria-hidden /> Retour à mon matériel</Link>
        <div className="mt-5 border-b border-neutral-200 pb-6">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-orange-700"><PencilLine size={18} aria-hidden /> Modification</p>
          <h1 className="mt-2 text-3xl font-black text-neutral-950 sm:text-4xl">Modifier le matériel</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">Mettez à jour les informations, les tarifs ou les photos. Les changements seront publiés immédiatement.</p>
        </div>
        <div className="mt-6"><EditEquipmentForm equipmentId={id} /></div>
      </div>
    </OwnerWorkspace>
  );
}
