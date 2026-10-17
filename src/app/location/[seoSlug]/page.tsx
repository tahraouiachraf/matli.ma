import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getSeoLandingPage, seoLandingPages, type SeoLandingPage } from "@/lib/local-seo";
import { JsonLd, collectionJsonLd } from "@/lib/seo";
import { getEquipmentListStrict } from "@/services/api/matli";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ seoSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getSeoLandingPage((await params).seoSlug);
  if (!page) return {};

  const canonical = `/rentals/${page.slug}`;
  const title = landingTitle(page);
  const description = landingDescription(page);

  return {
    title,
    description,
    keywords: landingKeywords(page),
    alternates: { canonical },
    openGraph: {
      title: `${title} | MATLI`,
      description,
      url: canonical,
      type: "website",
      locale: "fr_MA",
      images: ["/matli-thumbnail-v2.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MATLI`,
      description,
      images: ["/matli-thumbnail-v2.jpg"],
    },
  };
}

export default async function SeoLocationPage({ params }: PageProps) {
  const page = getSeoLandingPage((await params).seoSlug);
  if (!page) notFound();

  const equipment = await getEquipmentListStrict({
    category: page.category,
    city: page.city,
    brand: page.brand,
    model: page.model,
    perPage: 30,
  });
  if (!equipment.length) notFound();

  const title = landingTitle(page);
  const description = landingDescription(page);
  const filterQuery = new URLSearchParams();
  if (page.category) filterQuery.set("category", page.category);
  if (page.city) filterQuery.set("city", page.city);
  if (page.brand) filterQuery.set("brand", page.brand);
  if (page.model) filterQuery.set("model", page.model);
  const relatedPages = seoLandingPages
    .filter((item) => item.slug !== page.slug && (
      (page.category && item.category === page.category)
      || (!page.city && !item.city && item.category)
    ))
    .slice(0, 6);

  const structuredData = collectionJsonLd(`/rentals/${page.slug}`, title, description,
    equipment.map((item) => ({ name: item.title, path: `/equipment/${item.slug}` })));

  return (
    <div>
      <JsonLd data={structuredData} />
      <section className="border-y border-neutral-200 bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ name: "Accueil", path: "/" }, { name: "Location", path: "/rentals" }, { name: title, path: `/rentals/${page.slug}` }]} />
          <p className="mt-8 text-xs font-black uppercase text-orange-700">Matériel BTP disponible au Maroc</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-neutral-950 sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-600 sm:text-lg">{description}</p>
          <Link
            href={`/rentals?${filterQuery.toString()}`}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-black text-neutral-950 transition hover:bg-orange-400"
          >
            Affiner cette recherche
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-orange-700">Offres disponibles</p>
            <h2 className="mt-1 text-2xl font-black text-neutral-950">
              {equipment.length} machine{equipment.length > 1 ? "s" : ""} à comparer
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-neutral-600">Prix journalier, disponibilité, livraison et opérateur sont indiqués sur chaque fiche.</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {equipment.map((item) => <EquipmentCard key={item.backendId ?? item.id} item={item} />)}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-950">Bien préparer votre location</h2>
            <p className="mt-4 leading-8 text-neutral-700">
              Précisez les dates du chantier, l’adresse, les contraintes d’accès et les accessoires nécessaires. Le propriétaire confirme ensuite la disponibilité, le transport, l’opérateur et le montant final avant toute validation.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-neutral-950">Comparer avant de demander</h2>
            <p className="mt-4 leading-8 text-neutral-700">
              Vérifiez l’état de la machine, sa puissance, son tonnage et les conditions de livraison. Une demande complète permet au propriétaire de répondre plus vite avec une offre adaptée au chantier.
            </p>
          </div>
        </div>
      </section>

      {relatedPages.length ? (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-neutral-950">Autres locations recherchées</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {relatedPages.map((item) => (
              <Link key={item.slug} href={`/rentals/${item.slug}`} className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-700 transition hover:border-orange-400 hover:text-orange-700">
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function landingTitle(page: SeoLandingPage) {
  if (page.brand && page.model) return `Location ${page.brand} ${page.model} au Maroc`;
  if (page.city) return `Location ${page.categoryName?.toLowerCase()} à ${page.city}`;
  return `Location ${page.categoryName?.toLowerCase()} au Maroc`;
}

function landingDescription(page: SeoLandingPage) {
  const machine = page.brand && page.model ? `${page.brand} ${page.model}` : page.categoryName?.toLowerCase();
  const place = page.city ? `à ${page.city}` : "au Maroc";
  return `Comparez les ${machine} disponibles à la location ${place}: prix par jour, disponibilité, livraison et offres avec ou sans opérateur.`;
}

function landingKeywords(page: SeoLandingPage) {
  const machine = page.brand && page.model ? `${page.brand} ${page.model}` : page.categoryName ?? "matériel BTP";
  const place = page.city ?? "Maroc";
  return [
    `location ${machine} ${place}`,
    `${machine} à louer ${place}`,
    `matériel BTP ${place}`,
    `engins de chantier ${place}`,
    "location matériel BTP Maroc",
  ];
}
