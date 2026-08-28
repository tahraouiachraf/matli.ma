import { Check, SlidersHorizontal } from "lucide-react";
import { categories, cities } from "@/lib/data";

const priceRanges = ["Tous les prix", "Moins de 1 000 DH", "1 000 - 1 700 DH", "Plus de 1 700 DH"];
const quickFilters = ["Disponible maintenant", "Avec opérateur", "Livraison possible", "Propriétaire vérifié"];

export function FilterSidebar() {
  return (
    <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md bg-orange-50 text-orange-600">
            <SlidersHorizontal size={18} aria-hidden />
          </span>
          <div>
            <h2 className="font-black">Filtres</h2>
            <p className="text-xs text-neutral-500">Affinez les offres</p>
          </div>
        </div>
        <button className="text-xs font-black text-orange-600">Réinitialiser</button>
      </div>

      <div className="mt-5 grid gap-6">
        <div>
          <p className="mb-3 text-xs font-black uppercase text-neutral-500">Catégorie</p>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-neutral-950 px-3 py-2 text-xs font-black text-white">Toutes</button>
            {categories.map((category) => (
              <button
                key={category.slug}
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:border-orange-400 hover:text-orange-600"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-black uppercase text-neutral-500">Ville</p>
          <div className="grid max-h-44 gap-2 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
            {["Toutes les villes", ...cities].map((city, index) => (
              <button
                key={city}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                  index === 0
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-orange-300"
                }`}
              >
                {city}
                {index === 0 ? <Check size={16} aria-hidden /> : null}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-black uppercase text-neutral-500">Prix par jour</p>
          <div className="grid gap-2">
            {priceRanges.map((range, index) => (
              <button
                key={range}
                className={`rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                  index === 0
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-orange-300"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-black uppercase text-neutral-500">Options</p>
          <div className="grid gap-2">
            {quickFilters.map((filter) => (
              <label key={filter} className="flex items-center gap-3 rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700">
                <input type="checkbox" className="size-4 accent-orange-500" />
                <span>{filter}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
