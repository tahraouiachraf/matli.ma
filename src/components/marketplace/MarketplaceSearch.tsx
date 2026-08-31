import { Search } from "lucide-react";
import { categories, cities } from "@/lib/data";

export function MarketplaceSearch() {
  return (
    <form action="/location" className="grid gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-neutral-950/10 md:grid-cols-[1.2fr_1fr_auto]">
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Machine</span>
        <select name="category" defaultValue="" className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500">
          <option value="">Toutes les machines</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Ville</span>
        <select name="city" defaultValue="" className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500">
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <button className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
        <Search size={18} aria-hidden />
        Chercher
      </button>
    </form>
  );
}
