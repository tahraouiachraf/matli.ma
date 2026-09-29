import { X } from "lucide-react";
import Link from "next/link";
import { filterHref } from "@/lib/marketplace-filters";
import type { Category } from "@/types";

export function ActiveFilters({ active, categories }: { active: Record<string, string | undefined>; categories: Category[] }) {
  const labels: Array<[string, string]> = [];
  if (active.q) labels.push(["q", `Recherche : ${active.q}`]);
  if (active.category) labels.push(["category", categories.find((item) => item.slug === active.category)?.name ?? active.category]);
  if (active.city) labels.push(["city", active.city]);
  if (active.brand) labels.push(["brand", active.brand]);
  if (active.model) labels.push(["model", active.model]);
  if (active.price) labels.push(["price", active.price === "under-1000" ? "Moins de 1 000 DH" : active.price === "over-1700" ? "Plus de 1 700 DH" : "1 000 à 1 700 DH"]);
  if (active.operator) labels.push(["operator", active.operator === "1" ? "Avec opérateur" : "Sans opérateur"]);
  if (active.available === "1") labels.push(["available", "Disponible maintenant"]);
  if (active.delivery === "1") labels.push(["delivery", "Livraison possible"]);
  if (active.verified === "1") labels.push(["verified", "Propriétaire vérifié"]);

  if (!labels.length) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Filtres actifs">
      {labels.map(([key, label]) => (
        <Link key={key} href={filterHref(active, { [key]: null })} className="inline-flex min-h-9 items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 text-xs font-bold text-orange-800 hover:bg-orange-100">
          {label}<X size={13} aria-hidden />
        </Link>
      ))}
      <Link href="/rentals" className="inline-flex min-h-9 items-center px-2 text-xs font-black text-neutral-600 hover:text-orange-700">Tout effacer</Link>
    </div>
  );
}
