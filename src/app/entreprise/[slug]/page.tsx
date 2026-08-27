import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { companies, equipment } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = companies.find((entry) => entry.slug === slug);
  return company
    ? {
        title: `${company.name} - Location matériel à ${company.city}`,
        description: company.description,
      }
    : {};
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = companies.find((entry) => entry.slug === slug);

  if (!company) notFound();

  const items = equipment.filter((item) => item.companySlug === company.slug);

  return (
    <div className="bg-white">
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
