import type { Metadata } from "next";
import { BadgeCheck, Building2, MapPin, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { JsonLd, absoluteUrl } from "@/lib/seo";
import { ApiError } from "@/services/api/client";
import { getCompanyDetailStrict } from "@/services/api/matli";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getCompanyDetailStrict(slug).catch(() => null);
  const company = payload?.company;
  return company
    ? {
        title: `${company.name} - Location matériel à ${company.city}`,
        description: company.description,
        alternates: {
          canonical: `/entreprise/${company.slug}`,
        },
        openGraph: {
          title: `${company.name} - Machines BTP à louer à ${company.city}`,
          description: company.description,
          url: `/entreprise/${company.slug}`,
          type: "profile",
        },
      }
    : {};
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const { company, equipment: items } = await getCompanyDetailStrict(slug).catch((error) => {
    if (error instanceof ApiError && error.status === 404) return { company: null, equipment: [] };
    throw error;
  });

  if (!company) notFound();

  return (
    <main className="bg-neutral-50">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: company.name,
          description: company.description,
          url: absoluteUrl(`/entreprise/${company.slug}`),
          address: {
            "@type": "PostalAddress",
            addressLocality: company.city,
            addressRegion: company.region,
            addressCountry: "MA",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: company.rating,
            reviewCount: Math.max(company.equipmentCount, 1),
          },
        }}
      />
      <section className="border-b border-orange-100 bg-orange-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="grid size-16 place-items-center rounded-md bg-orange-500 text-xl font-black text-white shadow-sm">
              {company.logo}
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-black text-orange-700">
              <BadgeCheck size={18} aria-hidden /> Propriétaire vérifié sur MATLI
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-neutral-950 sm:text-5xl">{company.name}</h1>
            <p className="mt-4 text-base leading-7 text-neutral-600">{company.description}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-neutral-700">
              <MapPin size={18} className="text-orange-600" aria-hidden /> {company.city}, {company.region}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-orange-200 bg-orange-200 text-center shadow-sm">
            <div className="min-w-32 bg-white p-5">
              <p className="text-2xl font-black text-neutral-950">{company.rating}/5</p>
              <p className="mt-1 text-xs font-bold text-neutral-600">Évaluation</p>
            </div>
            <div className="min-w-32 bg-white p-5">
              <p className="text-2xl font-black text-neutral-950">{items.length}</p>
              <p className="mt-1 text-xs font-bold text-neutral-600">Machines publiées</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-orange-700"><Wrench size={17} aria-hidden /> Parc matériel</p>
            <h2 className="mt-2 text-3xl font-black text-neutral-950">Machines disponibles</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Comparez les prix, les options et la disponibilité avant d’envoyer votre demande.</p>
          </div>
          <Link href={`/location?city=${encodeURIComponent(company.city)}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-orange-300 bg-white px-4 text-sm font-black text-orange-700 hover:bg-orange-50">
            <Building2 size={17} aria-hidden /> Voir les offres à {company.city}
          </Link>
        </div>
        {items.length ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => <EquipmentCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-md border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
            <ShieldCheck className="mx-auto text-orange-500" size={34} aria-hidden />
            <h2 className="mt-4 text-xl font-black text-neutral-950">Aucune machine publiée actuellement</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-600">Le parc de cette entreprise est en cours de mise à jour. Consultez les autres offres disponibles près de votre chantier.</p>
            <Link href="/location" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">Explorer les machines</Link>
          </div>
        )}
      </section>
    </main>
  );
}
