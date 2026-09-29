"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categories, cities } from "@/lib/data";
import { getSearchSuggestions, type SearchSuggestions } from "@/services/api/matli";

export function MarketplaceSearch({ active = {} }: { active?: Record<string, string | undefined> }) {
  const [query, setQuery] = useState(active.q ?? "");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = window.setTimeout(() => {
      getSearchSuggestions(query.trim()).then(setSuggestions).catch(() => setSuggestions(null));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  const hasSuggestions = focused && query.trim().length >= 2 && suggestions && (
    suggestions.machines.length || suggestions.brands.length || suggestions.cities.length || suggestions.categories.length
  );

  return (
    <form action="/rentals" className="grid min-w-0 gap-3 rounded-lg border border-orange-100 bg-white p-3 shadow-lg shadow-orange-900/5 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
      <label className="relative grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Recherche</span>
        <input name="q" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} autoComplete="off" placeholder="Marque, modèle ou machine" className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" />
        {hasSuggestions ? (
          <div className="absolute inset-x-0 top-[74px] z-40 max-h-80 overflow-auto rounded-md border border-neutral-200 bg-white p-2 shadow-xl">
            {suggestions.machines.map((item) => (
              <Link key={item.slug} href={`/equipment/${item.slug}`} className="block rounded-md px-3 py-2 text-sm hover:bg-orange-50">
                <span className="block font-black text-neutral-950">{item.title}</span>
                <span className="text-xs text-neutral-500">{item.brand} {item.model} · {item.city}</span>
              </Link>
            ))}
            {[...suggestions.categories.map((item) => ({ label: item.name, href: `/rentals?category=${item.slug}` })), ...suggestions.brands.map((brand) => ({ label: brand, href: `/rentals?brand=${encodeURIComponent(brand)}` })), ...suggestions.cities.map((city) => ({ label: city, href: `/rentals?city=${encodeURIComponent(city)}` }))].map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm font-bold text-neutral-700 hover:bg-orange-50 hover:text-orange-700">{item.label}</Link>
            ))}
          </div>
        ) : null}
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
