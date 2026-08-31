import type { Metadata } from "next";
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
    <div className="bg-white">
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
      <section className="bg-neutral-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="grid size-20 place-items-center rounded-md bg-amber-400 text-2xl font-black text-neutral-950">
              {company.logo}
            </div>
            <h1 className="mt-6 text-4xl font-black">{company.name}</h1>
            <p className="mt-3 max-w-3xl text-neutral-300">{company.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md border border-white/15 p-4">
              <p className="text-2xl font-black">{company.rating}</p>
              <p className="text-xs text-neutral-300">Note</p>
            </div>
            <div className="rounded-md border border-white/15 p-4">
              <p className="text-2xl font-black">{company.equipmentCount}</p>
              <p className="text-xs text-neutral-300">Matériels</p>
            </div>
            <div className="rounded-md border border-white/15 p-4">
              <p className="text-2xl font-black">{company.city}</p>
              <p className="text-xs text-neutral-300">Ville</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black">Matériels disponibles</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
