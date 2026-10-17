import type { Metadata } from "next";
import { BadgeCheck, HardHat, Truck } from "lucide-react";
import Link from "next/link";
import { CommercialEventTracker } from "@/components/analytics/CommercialEventTracker";
import { ActiveFilters } from "@/components/marketplace/ActiveFilters";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { ResponsiveFilters } from "@/components/marketplace/ResponsiveFilters";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd, collectionJsonLd } from "@/lib/seo";
import { getCatalogMetaStrict, getCategoriesStrict, getEquipmentPageStrict } from "@/services/api/matli";
import { filterHref } from "@/lib/marketplace-filters";

export const dynamic = "force-dynamic";

type LocationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: LocationPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = singleParam(params?.category);
  const city = singleParam(params?.city);
  const brand = singleParam(params?.brand);
  const model = singleParam(params?.model);
  const search = singleParam(params?.q);
  const machineName = [brand, model].filter(Boolean).join(" ") || search;
  const titleParts = [
    machineName ? `Location ${machineName}` : "Location matériel BTP",
    category ? readableSlug(category) : null,
    city ? `à ${city}` : "au Maroc",
  ].filter(Boolean);
  const hasFilters = Boolean(params && Object.values(params).some((value) => Array.isArray(value) ? value.length : value));
  const canonical = "/rentals";
  const description = machineName
    ? `Comparez les offres de ${machineName} disponibles ${city ? `à ${city}` : "au Maroc"}, les prix par jour, la livraison et les options avec ou sans opérateur.`
    : city
      ? `Comparez les prix des machines BTP disponibles à ${city}: tractopelles, mini-pelles, chariots télescopiques, pelles et chargeuses.`
      : "Comparez les prix de tractopelles, mini-pelles, chariots télescopiques, pelles et chargeuses à louer au Maroc.";

  return {
    title: `${titleParts.join(" ")} - Engins disponibles`,
    description,
    keywords: [
      "location matériel BTP Maroc",
      "matériel BTP",
      "JCB 3CX",
      "location mini pelle",
      "location telescopic",
      "location chargeuse",
      machineName ? `location ${machineName} Maroc` : "machines BTP à louer",
      category ? `location ${readableSlug(category)} Maroc` : "engins de chantier Maroc",
      city ? `location matériel BTP ${city}` : "location machines BTP Maroc",
    ],
    alternates: {
      canonical,
    },
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: `${titleParts.join(" ")} | MATLI`,
      description,
      url: canonical,
      type: "website",
      images: ["/matli-thumbnail-v2.jpg"],
    },
  };
}

export default async function LocationPage({ searchParams }: LocationPageProps) {
  const params = await searchParams;
  const active = {
    q: singleParam(params?.q),
    category: singleParam(params?.category),
    city: singleParam(params?.city),
    price: singleParam(params?.price),
    available: singleParam(params?.available),
    operator: singleParam(params?.operator),
    delivery: singleParam(params?.delivery),
    verified: singleParam(params?.verified),
    brand: singleParam(params?.brand),
    model: singleParam(params?.model),
    sort: singleParam(params?.sort),
    page: singleParam(params?.page),
  };
  const price = priceBounds(active.price);
  const activeCount = Object.entries(active).filter(([key, value]) => value && key !== "sort").length;
  const hasSearchIntent = Object.entries(active).some(([key, value]) => value && !["sort", "page"].includes(key));
  const analyticsQuery = new URLSearchParams(
    Object.entries(active).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  const [catalog, categories, meta] = await Promise.all([
    getEquipmentPageStrict({
      perPage: 12,
      page: Math.max(1, Number(active.page) || 1),
      q: active.q,
      category: active.category,
      city: active.city,
      availableNow: active.available === "1",
      minPrice: price.min,
      maxPrice: price.max,
      operator: active.operator === "1" ? true : active.operator === "0" ? false : undefined,
      delivery: active.delivery === "1",
      verified: active.verified === "1",
      brand: active.brand,
      model: active.model,
      sort: ["price_asc", "price_desc", "availability", "proximity"].includes(active.sort ?? "") ? active.sort as "price_asc" | "price_desc" | "availability" | "proximity" : "recent",
      nearCity: active.city,
    }),
    getCategoriesStrict(),
    getCatalogMetaStrict(),
  ]);

  return (
    <div>
      <JsonLd data={collectionJsonLd(
        `/rentals${analyticsQuery ? `?${analyticsQuery}` : ""}`,
        "Machines BTP disponibles à la location",
        "Comparez les matériels disponibles près de votre chantier et envoyez une demande directement au propriétaire.",
        catalog.items.map((item) => ({ name: item.title, path: `/equipment/${item.slug}` })),
        (catalog.currentPage - 1) * 12,
      )} />
      {hasSearchIntent ? (
        <CommercialEventTracker
          eventName="search_performed"
          searchQuery={active.q}
          city={active.city}
          category={active.category}
          resultCount={catalog.total}
          pagePath={`/rentals${analyticsQuery ? `?${analyticsQuery}` : ""}`}
        />
      ) : null}
      {hasSearchIntent && catalog.total === 0 ? (
        <CommercialEventTracker
          eventName="search_no_results"
          searchQuery={active.q ?? [active.category, active.city].filter(Boolean).join(" ")}
          city={active.city}
          category={active.category}
          resultCount={0}
          pagePath={`/rentals${analyticsQuery ? `?${analyticsQuery}` : ""}`}
        />
      ) : null}
      <section className="border-b border-neutral-200 bg-white px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6"><Breadcrumbs items={[{ name: "Accueil", path: "/" }, { name: "Location", path: "/rentals" }]} /></div>
          <div className="max-w-4xl lg:mx-auto lg:text-center">
            <p className="inline-flex items-center gap-2 rounded-md border border-orange-200 bg-white px-3 py-1.5 text-xs font-black uppercase text-orange-700">
              <HardHat size={15} aria-hidden /> Marketplace BTP au Maroc
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-neutral-950 sm:mt-5 sm:text-5xl lg:text-6xl">Trouvez la bonne machine, au bon endroit, au bon prix.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg lg:mx-auto">
              Comparez les matériels disponibles près de votre chantier et envoyez une demande directement au propriétaire.
            </p>
          </div>
          <div className="mt-6 sm:mt-7">
            <MarketplaceSearch active={active} />
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-neutral-700">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={17} className="text-orange-600" aria-hidden /> Propriétaires identifiés</span>
            <span className="inline-flex items-center gap-2"><Truck size={17} className="text-orange-600" aria-hidden /> Livraison selon l’offre</span>
            <Link href="#offres" className="font-black text-orange-700 hover:text-orange-800">Voir les machines disponibles</Link>
          </div>
        </div>
      </section>
      <section id="offres" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="sticky top-16 z-30 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
          <ResponsiveFilters count={activeCount}>
            <FilterSidebar items={categories} active={active} brands={meta.brands} models={meta.models} />
          </ResponsiveFilters>
          <span className="text-sm font-bold text-neutral-600">{catalog.total} résultat{catalog.total > 1 ? "s" : ""}</span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <FilterSidebar items={categories} active={active} brands={meta.brands} models={meta.models} />
          </div>
          <div className="min-w-0">
            <SectionHeading
              title="Machines disponibles"
              description={`${catalog.total} offre${catalog.total > 1 ? "s" : ""} trouvée${catalog.total > 1 ? "s" : ""} selon vos critères.`}
            />
            <div className="mt-5"><ActiveFilters active={active} categories={categories} /></div>
          {catalog.items.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {catalog.items.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
              <p className="text-xl font-black text-neutral-950">Aucune machine ne correspond à ces filtres.</p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Essayez une autre catégorie, une autre ville ou réinitialisez les filtres pour afficher toutes les offres disponibles.
              </p>
            </div>
          )}
          {catalog.lastPage > 1 ? (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination des résultats">
              {Array.from({ length: catalog.lastPage }, (_, index) => index + 1).map((page) => (
                <Link key={page} href={filterHref(active, { page: String(page) })} aria-current={page === catalog.currentPage ? "page" : undefined} className={`grid size-11 place-items-center rounded-md border text-sm font-black ${page === catalog.currentPage ? "border-orange-500 bg-orange-500 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-orange-300"}`}>
                  {page}
                </Link>
              ))}
            </nav>
          ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function singleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readableSlug(value: string) {
  return value.replaceAll("-", " ");
}

function priceBounds(price?: string) {
  if (price === "under-1000") return { max: 999 };
  if (price === "1000-1700") return { min: 1000, max: 1700 };
  if (price === "over-1700") return { min: 1701 };
  return {};
}
