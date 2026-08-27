import type { Metadata } from "next";
import { SlidersHorizontal } from "lucide-react";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { SearchPanel } from "@/components/marketplace/SearchPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, cities, equipment } from "@/lib/data";

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
            Filtrez par catégorie, ville, date, marque, prix, opérateur et livraison.
          </p>
          <div className="mt-8">
            <SearchPanel />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="h-fit rounded-md border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={19} aria-hidden />
            <h2 className="font-black">Filtres</h2>
          </div>
          <div className="mt-5 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold">
              Catégorie
              <select className="h-11 rounded-md border border-neutral-200 px-3 font-normal">
                {categories.map((category) => (
                  <option key={category.slug}>{category.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Ville
              <select className="h-11 rounded-md border border-neutral-200 px-3 font-normal">
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Rayon
              <select className="h-11 rounded-md border border-neutral-200 px-3 font-normal">
                {["10 km", "25 km", "50 km", "100 km", "200 km"].map((radius) => (
                  <option key={radius}>{radius}</option>
                ))}
              </select>
            </label>
          </div>
        </aside>
        <div>
          <SectionHeading title="Résultats" description="Pagination et recherche avancée seront alimentées par l'API Laravel REST." />
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
