import type { Metadata } from "next";
import { OwnerPreview } from "@/components/dashboard/OwnerPreview";

export const metadata: Metadata = {
  title: "Espace propriétaire",
  description: "Dashboard propriétaire pour gérer matériel, locations, maintenance, clients et finances.",
};

const menu = [
  "Tableau de bord",
  "Mon matériel",
  "Locations",
  "Demandes",
  "Calendrier",
  "Maintenance",
  "Clients",
  "Opérateurs",
  "Finances",
  "Documents",
  "Équipe",
  "Statistiques",
  "Notifications",
  "Paramètres",
];

export default function OwnerSpacePage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="h-fit rounded-md border border-neutral-200 bg-white p-4">
        <h1 className="px-3 text-lg font-black">Espace propriétaire</h1>
        <nav className="mt-4 grid gap-1">
          {menu.map((item) => (
            <a key={item} className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100" href="#">
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <div>
        <h2 className="text-3xl font-black">Tableau de bord</h2>
        <p className="mt-3 text-neutral-600">
          Vue de pilotage pour comprendre immédiatement l&apos;état du parc, les retards, les paiements et la maintenance.
        </p>
        <div className="mt-8">
          <OwnerPreview />
        </div>
      </div>
    </section>
  );
}
