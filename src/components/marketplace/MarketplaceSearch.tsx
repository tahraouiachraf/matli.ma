import { Search } from "lucide-react";
import { categories, cities } from "@/lib/data";

export function MarketplaceSearch() {
  return (
    <form className="grid gap-3 rounded-md bg-white p-3 shadow-xl shadow-neutral-950/10 md:grid-cols-[1.2fr_1fr_1fr_auto]">
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Machine</span>
        <select defaultValue="" className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500">
          <option value="" disabled>Type de machine</option>
          {categories.map((category) => (
            <option key={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Ville</span>
        <select defaultValue="" className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500">
          <option value="" disabled>Choisir une ville</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Budget max / jour</span>
        <input inputMode="numeric" className="h-12 rounded-md border border-neutral-200 px-3 text-sm text-neutral-900 outline-none focus:border-orange-500" placeholder="Ex: 1700 DH" />
      </label>
      <button className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
        <Search size={18} aria-hidden />
        Chercher
      </button>
    </form>
  );
}
