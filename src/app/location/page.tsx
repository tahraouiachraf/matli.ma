import type { Metadata } from "next";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd, marketplaceJsonLd } from "@/lib/seo";
import { getCategoriesStrict, getEquipmentListStrict } from "@/services/api/matli";
import type { Equipment } from "@/types";

export const dynamic = "force-dynamic";

type LocationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: LocationPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = singleParam(params?.category);
  const city = singleParam(params?.city);
  const titleParts = [
    "Location matériel BTP",
    category ? readableSlug(category) : null,
    city ? `à ${city}` : "au Maroc",
  ].filter(Boolean);
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (city) query.set("city", city);
  const canonical = query.toString() ? `/location?${query.toString()}` : "/location";

  return {
    title: `${titleParts.join(" ")} - Engins disponibles`,
    description: city
      ? `Comparez les prix des machines BTP disponibles à ${city}: tractopelles, mini-pelles, chariots télescopiques, pelles et chargeuses.`
      : "Comparez les prix de tractopelles, mini-pelles, chariots télescopiques, pelles et chargeuses à louer au Maroc.",
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${titleParts.join(" ")} | MATLI`,
      description: "Trouvez des machines BTP disponibles, comparez les prix et contactez les propriétaires au Maroc.",
      url: canonical,
      type: "website",
      images: ["/equipment/jcb-3cx-yard.png"],
    },
  };
}

export default async function LocationPage({ searchParams }: LocationPageProps) {
  const params = await searchParams;
  const active = {
    category: singleParam(params?.category),
    city: singleParam(params?.city),
    price: singleParam(params?.price),
    available: singleParam(params?.available),
    operator: singleParam(params?.operator),
    delivery: singleParam(params?.delivery),
    verified: singleParam(params?.verified),
  };

  const [apiEquipment, categories] = await Promise.all([
    getEquipmentListStrict({
      perPage: 30,
      category: active.category,
      city: active.city,
      status: active.available === "1" ? "available" : undefined,
    }),
    getCategoriesStrict(),
  ]);
  const equipment = applyLocalFilters(apiEquipment, active);

  return (
    <div>
      <JsonLd data={marketplaceJsonLd()} />
      <section className="bg-neutral-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black">Location de matériel BTP au Maroc</h1>
          <p className="mt-4 max-w-2xl text-neutral-300">
            Comparez les prix de plusieurs propriétaires, vérifiez les options et envoyez une demande de réservation.
          </p>
          <div className="mt-8">
            <MarketplaceSearch />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <FilterSidebar items={categories} active={active} />
        <div>
          <SectionHeading
            title="Offres disponibles"
            description={`${equipment.length} offre${equipment.length > 1 ? "s" : ""} trouvée${equipment.length > 1 ? "s" : ""} selon vos filtres.`}
          />
          {equipment.length ? (
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {equipment.map((item) => (
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

function applyLocalFilters(items: Equipment[], active: Record<string, string | undefined>) {
  return items.filter((item) => {
    if (active.price === "under-1000" && item.priceDay >= 1000) return false;
    if (active.price === "1000-1700" && (item.priceDay < 1000 || item.priceDay > 1700)) return false;
    if (active.price === "over-1700" && item.priceDay <= 1700) return false;
    if (active.operator === "1" && !item.operator) return false;
    if (active.delivery === "1" && !item.delivery) return false;
    if (active.verified === "1" && !item.companyVerified) return false;

    return true;
  });
}
