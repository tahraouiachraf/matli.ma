import { categories } from "@/lib/data";

const cityMap: Record<string, string[]> = {
  tractopelles: ["Casablanca", "Rabat", "Fès", "Meknès"],
  "mini-pelles": ["Marrakech", "Tanger", "Agadir", "Oujda", "Tétouan", "Kénitra"],
  "chariots-telescopiques": ["Tanger", "Fès", "Meknès", "Kénitra", "El Jadida"],
  "nacelles-telescopiques-articules": ["Oujda", "Safi"],
  "pelles-sur-chenilles": ["Tétouan", "Kénitra", "Béni Mellal", "Casablanca"],
  "chargeuses-sur-pneumatiques": ["El Jadida", "Safi", "Rabat", "Marrakech"],
  grues: ["Béni Mellal", "Tanger"],
};

const categoryNames: Record<string, string> = {
  ...Object.fromEntries(categories.map((category) => [category.slug, category.name])),
  grues: "Grues mobiles",
};

export type LocalSeoPage = {
  slug: string;
  category: string;
  categoryName: string;
  city: string;
};

export const localSeoPages: LocalSeoPage[] = Object.entries(cityMap).flatMap(([category, cities]) =>
  cities.map((city) => ({
    slug: `${category}-${slugify(city)}`,
    category,
    categoryName: categoryNames[category],
    city,
  })),
);

export function getLocalSeoPage(slug: string) {
  return localSeoPages.find((page) => page.slug === slug);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
