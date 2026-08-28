import type { Metadata } from "next";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { RequestsPreviewSection } from "@/components/sections/RequestsPreviewSection";
import { SeoPagesSection } from "@/components/sections/SeoPagesSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { equipment } from "@/lib/data";

export const metadata: Metadata = {
  title: "Location matériel BTP au Maroc",
  description: "Recherchez et filtrez les engins et matériels professionnels disponibles à la location au Maroc.",
};

export default function LocationPage() {
  return (
    <div>
      <section className="bg-neutral-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black">Location de matériel BTP au Maroc</h1>
          <p className="mt-4 max-w-2xl text-neutral-300">
            Comparez les prix de plusieurs propriétaires, vérifiez les options et envoyez une demande de réservation.
          </p>
          <div className="mt-8">
            <MarketplaceSearch />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <FilterSidebar />
        <div>
          <SectionHeading title="Offres disponibles" description="Données statiques aujourd’hui, prêtes à être remplacées par l’API Laravel: prix, ville, disponibilité, opérateur et réservation." />
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      <RequestsPreviewSection />
      <SeoPagesSection />
    </div>
  );
}
