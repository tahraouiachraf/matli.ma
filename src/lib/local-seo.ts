import { categories } from "@/lib/data";

const cityMap: Record<string, string[]> = {
  tractopelles: ["Casablanca", "Rabat", "Fès", "Meknès"],
  "mini-pelles": ["Marrakech", "Tanger", "Agadir", "Oujda", "Tétouan", "Kénitra"],
  "chariots-telescopiques": ["Tanger", "Fès", "Meknès", "Kénitra", "El Jadida"],
  "nacelles-telescopiques-articules": ["Oujda", "Safi"],
  "pelles-sur-chenilles": ["Tétouan", "Kénitra", "Béni Mellal", "Casablanca"],
  "chargeuses-sur-pneumatiques": ["El Jadida", "Safi", "Rabat", "Marrakech"],
  "compacteurs-rouleaux-compresseurs": ["Casablanca", "Rabat"],
  grues: ["Béni Mellal", "Tanger"],
};

const categoryNames: Record<string, string> = {
  ...Object.fromEntries(categories.map((category) => [category.slug, category.name])),
  grues: "Grues mobiles",
};

export type SeoLandingPage = {
  slug: string;
  name: string;
  category?: string;
  categoryName?: string;
  city?: string;
  brand?: string;
  model?: string;
};

export const categorySeoPages: SeoLandingPage[] = Object.entries(categoryNames).map(([category, categoryName]) => ({
  slug: category,
  name: `Location ${categoryName.toLowerCase()} au Maroc`,
  category,
  categoryName,
}));

export const localSeoPages: SeoLandingPage[] = Object.entries(cityMap).flatMap(([category, cities]) =>
  cities.map((city) => ({
    slug: `${category}-${slugify(city)}`,
    name: `Location ${categoryNames[category].toLowerCase()} à ${city}`,
    category,
    categoryName: categoryNames[category],
    city,
  })),
);

export const featuredMachineSeoPages: SeoLandingPage[] = [
  {
    slug: "jcb-3cx",
    name: "Location JCB 3CX au Maroc",
    brand: "JCB",
    model: "3CX",
  },
];

export const seoLandingPages = [...categorySeoPages, ...featuredMachineSeoPages, ...localSeoPages];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}

export function equipmentMatchesLanding(
  item: { category: string; city: string; brand: string; model: string },
  page: SeoLandingPage,
) {
  const categoryMatches = !page.category
    || normalize(item.category) === normalize(page.categoryName ?? page.category);
  const cityMatches = !page.city || normalize(item.city) === normalize(page.city);
  const brandMatches = !page.brand || normalize(item.brand) === normalize(page.brand);
  const modelMatches = !page.model || normalize(item.model).includes(normalize(page.model));

  return categoryMatches && cityMatches && brandMatches && modelMatches;
}

function normalize(value: string) {
  return slugify(value);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
