import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { JsonLd, absoluteUrl } from "@/lib/seo";
import { getLocalSeoPage } from "@/lib/local-seo";
import { getEquipmentListStrict } from "@/services/api/matli";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ seoSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getLocalSeoPage((await params).seoSlug);
  if (!page) return {};

  const canonical = `/location/${page.slug}`;
  const title = `Location ${page.categoryName.toLowerCase()} à ${page.city}`;
  const description = `Comparez les ${page.categoryName.toLowerCase()} disponibles à ${page.city}, les prix par jour, la livraison et les offres avec ou sans opérateur.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: `${title} | MATLI`, description, url: canonical, type: "website" },
  };
}

export default async function LocalLocationPage({ params }: PageProps) {
  const page = getLocalSeoPage((await params).seoSlug);
  if (!page) notFound();

  const equipment = await getEquipmentListStrict({
    category: page.category,
    city: page.city,
    perPage: 30,
  });
  if (!equipment.length) notFound();

  const canonical = absoluteUrl(`/location/${page.slug}`);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Location ${page.categoryName.toLowerCase()} à ${page.city}`,
      description: `Offres de ${page.categoryName.toLowerCase()} disponibles à la location à ${page.city}.`,
      url: canonical,
      inLanguage: "fr-MA",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Location", item: absoluteUrl("/location") },
        { "@type": "ListItem", position: 3, name: `${page.categoryName} à ${page.city}`, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: equipment.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: absoluteUrl(`/materiel/${item.slug}`),
      })),
    },
  ];

  return (
    <main>
      <JsonLd data={structuredData} />
      <section className="bg-neutral-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Fil d’Ariane" className="text-sm text-neutral-300">
            <Link href="/" className="hover:text-orange-400">Accueil</Link> / <Link href="/location" className="hover:text-orange-400">Location</Link> / {page.city}
          </nav>
          <h1 className="mt-5 max-w-4xl text-3xl font-black sm:text-5xl">Location de {page.categoryName.toLowerCase()} à {page.city}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-neutral-300">
            Trouvez une machine adaptée à votre chantier à {page.city}. Comparez les tarifs journaliers, la disponibilité, la livraison et la présence d’un opérateur avant d’envoyer votre demande.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-orange-600">Offres locales vérifiées</p>
            <h2 className="mt-1 text-2xl font-black">{equipment.length} machine{equipment.length > 1 ? "s" : ""} à comparer</h2>
          </div>
          <Link href={`/location?category=${page.category}&city=${encodeURIComponent(page.city)}`} className="font-bold text-orange-700 hover:text-orange-800">Afficher tous les filtres</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {equipment.map((item) => <EquipmentCard key={item.backendId ?? item.id} item={item} />)}
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8 text-neutral-700">
          <h2 className="text-2xl font-black text-neutral-950">Préparer une location à {page.city}</h2>
          <p className="mt-4 max-w-4xl leading-8">
            Indiquez les dates du chantier, l’adresse de livraison et le besoin d’opérateur. Le propriétaire confirme ensuite la disponibilité et le prix final selon la durée, le transport et les accessoires demandés.
          </p>
        </div>
      </section>
    </main>
  );
}
