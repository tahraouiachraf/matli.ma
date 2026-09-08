import { Search } from "lucide-react";
import { categories, cities } from "@/lib/data";

export function MarketplaceSearch({ active = {} }: { active?: Record<string, string | undefined> }) {
  return (
    <form action="/location" className="grid min-w-0 gap-3 rounded-lg border border-orange-100 bg-white p-3 shadow-lg shadow-orange-900/5 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Recherche</span>
        <input name="q" defaultValue={active.q} placeholder="Marque, modèle ou machine" className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Machine</span>
        <select name="category" defaultValue={active.category ?? ""} className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100">
          <option value="">Toutes les machines</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Ville</span>
        <select name="city" defaultValue={active.city ?? ""} className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100">
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <button className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-600 px-5 text-sm font-black text-white shadow-sm hover:bg-orange-700 lg:mt-5">
        <Search size={18} aria-hidden />
        Chercher
      </button>
    </form>
  );
}
