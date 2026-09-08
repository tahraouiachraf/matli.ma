import { Check, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { categories as fallbackCategories, cities } from "@/lib/data";
import type { Category } from "@/types";
import { filterHref } from "@/lib/marketplace-filters";

const priceRanges = [
  { label: "Tous les prix", value: "" },
  { label: "Moins de 1 000 DH", value: "under-1000" },
  { label: "1 000 - 1 700 DH", value: "1000-1700" },
  { label: "Plus de 1 700 DH", value: "over-1700" },
];

const quickFilters = [
  { label: "Disponible maintenant", key: "available" },
  { label: "Livraison possible", key: "delivery" },
  { label: "Propriétaire vérifié", key: "verified" },
];

type FilterSidebarProps = {
  items?: Category[];
  active?: Record<string, string | undefined>;
  brands?: string[];
  models?: string[];
};

export function FilterSidebar({ active = {}, brands = [], items = fallbackCategories, models = [] }: FilterSidebarProps) {
  const activeCount = [
    active.q,
    active.category,
    active.city,
    active.price,
    active.available,
    active.operator,
    active.delivery,
    active.verified,
    active.brand,
    active.model,
    active.sort,
  ].filter(Boolean).length;

  return (
    <aside className="h-fit rounded-lg border border-orange-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-md bg-orange-50 text-orange-600">
            <SlidersHorizontal size={18} aria-hidden />
          </span>
          <div>
            <h2 className="font-black text-neutral-950">Filtres</h2>
            <p className="text-xs font-semibold text-neutral-500">Affinez les offres</p>
          </div>
        </div>
        <Link
          href="/location"
          className="inline-flex h-9 items-center gap-1 rounded-md border border-neutral-200 px-3 text-xs font-black text-neutral-700 transition hover:border-orange-300 hover:text-orange-700"
        >
          <X size={14} aria-hidden />
          Réinitialiser
        </Link>
      </div>

      {activeCount ? (
        <div className="mt-4 rounded-md bg-orange-50 px-3 py-2 text-xs font-black text-orange-700">
          {activeCount} filtre{activeCount > 1 ? "s" : ""} actif{activeCount > 1 ? "s" : ""}
        </div>
      ) : null}

      <div className="mt-5 grid gap-6">
        <FilterGroup
          badge={`${items.length} types`}
          title="Catégorie"
          options={[
            { label: "Toutes les machines", href: filterHref(active, { category: null }) },
            ...items.map((category) => ({
              label: category.name,
              href: filterHref(active, { category: category.slug }),
              active: active.category === category.slug,
            })),
          ]}
          activeFirst={!active.category}
        />

        <FilterGroup
          title="Ville"
          scroll
          options={[
            { label: "Toutes les villes", href: filterHref(active, { city: null }) },
            ...cities.map((city) => ({
              label: city,
              href: filterHref(active, { city }),
              active: active.city === city,
            })),
          ]}
          activeFirst={!active.city}
        />

        <FilterGroup
          title="Prix par jour"
          options={priceRanges.map((range) => ({
            label: range.label,
            href: filterHref(active, { price: range.value || null }),
            active: active.price === range.value,
          }))}
          activeFirst={!active.price}
        />

        <FilterGroup
          title="Opérateur"
          options={[
            { label: "Avec ou sans opérateur", href: filterHref(active, { operator: null }) },
            { label: "Avec opérateur", href: filterHref(active, { operator: "1" }), active: active.operator === "1" },
            { label: "Sans opérateur", href: filterHref(active, { operator: "0" }), active: active.operator === "0" },
          ]}
          activeFirst={active.operator === undefined}
        />

        {brands.length ? (
          <FilterGroup
            title="Marque"
            scroll
            options={[
              { label: "Toutes les marques", href: filterHref(active, { brand: null }) },
              ...brands.map((brand) => ({ label: brand, href: filterHref(active, { brand }), active: active.brand === brand })),
            ]}
            activeFirst={!active.brand}
          />
        ) : null}

        {models.length ? (
          <FilterGroup
            title="Modèle"
            scroll
            options={[
              { label: "Tous les modèles", href: filterHref(active, { model: null }) },
              ...models.map((model) => ({ label: model, href: filterHref(active, { model }), active: active.model === model })),
            ]}
            activeFirst={!active.model}
          />
        ) : null}

        <FilterGroup
          title="Trier"
          options={[
            { label: "Plus récentes", href: filterHref(active, { sort: null }) },
            { label: "Prix croissant", href: filterHref(active, { sort: "price_asc" }), active: active.sort === "price_asc" },
            { label: "Prix décroissant", href: filterHref(active, { sort: "price_desc" }), active: active.sort === "price_desc" },
          ]}
          activeFirst={!active.sort || active.sort === "recent"}
        />

        <div>
          <p className="mb-3 text-xs font-black uppercase text-neutral-500">Options</p>
          <div className="grid gap-2">
            {quickFilters.map((filter) => {
              const selected = active[filter.key] === "1";

              return (
                <Link
                  key={filter.key}
                  href={filterHref(active, { [filter.key]: selected ? null : "1" })}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm font-bold leading-5 transition ${
                    selected
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`grid size-5 place-items-center rounded border ${selected ? "border-orange-500 bg-orange-500 text-white" : "border-neutral-300"}`}>
                    {selected ? <Check size={13} aria-hidden /> : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({
  activeFirst,
  badge,
  options,
  scroll = false,
  title,
}: {
  activeFirst?: boolean;
  badge?: string;
  options: Array<{ active?: boolean; href: string; label: string }>;
  scroll?: boolean;
  title: string;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-neutral-500">{title}</p>
        {badge ? <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-black text-neutral-500">{badge}</span> : null}
      </div>
      <div className={`grid gap-2 ${scroll ? "max-h-52 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-1" : ""}`}>
        {options.map((option, index) => {
          const selected = option.active || (index === 0 && activeFirst);

          return (
            <Link
              key={`${title}-${option.label}`}
              href={option.href}
              className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left text-sm leading-5 transition ${
                selected
                  ? "border-orange-500 bg-orange-50 font-black text-orange-800"
                  : "border-neutral-200 bg-white font-bold text-neutral-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              <span className="min-w-0 flex-1">{option.label}</span>
              {selected ? <Check size={16} className="shrink-0" aria-hidden /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
