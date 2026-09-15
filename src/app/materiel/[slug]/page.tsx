import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, MessageCircle, Share2, Truck, UserRoundCheck } from "lucide-react";
import { EquipmentReservationForm } from "@/components/forms/EquipmentReservationForm";
import { EquipmentGallery } from "@/components/marketplace/EquipmentGallery";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { statusLabels } from "@/lib/data";
import { formatDh } from "@/lib/format";
import { JsonLd, absoluteUrl, equipmentJsonLd } from "@/lib/seo";
import { ApiError } from "@/services/api/client";
import { getEquipmentDetailStrict } from "@/services/api/matli";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEquipmentDetailStrict(slug).catch(() => null);

  if (!item) return {};

  return {
    title: `${item.title} à louer à ${item.city} - ${formatDh(item.priceDay)}/jour`,
    description: `${item.title}, ${item.brand} ${item.model}, disponible à la location à ${item.city}. Demandez une location ou un devis sur MATLI.`,
    alternates: {
      canonical: `/materiel/${item.slug}`,
    },
    openGraph: {
      title: `${item.title} à louer à ${item.city}`,
      description: `${item.brand} ${item.model} à ${formatDh(item.priceDay)}/jour. ${statusLabels[item.status]} sur MATLI.`,
      url: `/materiel/${item.slug}`,
      type: "website",
      images: [
        {
          url: item.image.startsWith("http") ? item.image : absoluteUrl(item.image),
          width: 1200,
          height: 630,
          alt: `${item.title} à louer à ${item.city}`,
        },
      ],
    },
  };
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getEquipmentDetailStrict(slug).catch((error) => {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  });

  if (!item) notFound();

  return (
    <div className="bg-white">
      <JsonLd data={equipmentJsonLd(item)} />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <EquipmentGallery images={item.images?.length ? item.images : [item.image]} title={item.title} city={item.city} />
        </div>
        <aside className="h-fit rounded-md border border-neutral-200 bg-neutral-50 p-4 sm:p-6">
          {item.sponsored ? (
            <span className="rounded-md bg-amber-400 px-3 py-1 text-xs font-black text-neutral-950">Sponsorisé</span>
          ) : null}
          <h1 className="mt-4 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">{item.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-neutral-600">
            <MapPin size={18} aria-hidden />
            {item.city}, {item.region}
          </p>
          <p className="mt-6 text-2xl font-black sm:text-3xl">{formatDh(item.priceDay)} / jour</p>
          <p className="mt-1 text-sm text-neutral-600">{formatDh(item.priceWeek)} / semaine · {statusLabels[item.status]}</p>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-neutral-700">
            {item.operator ? (
              <span className="inline-flex items-center gap-2">
                <UserRoundCheck size={18} aria-hidden />
                Opérateur disponible
              </span>
            ) : null}
            {item.delivery ? (
              <span className="inline-flex items-center gap-2">
                <Truck size={18} aria-hidden />
                Livraison possible
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={18} aria-hidden />
              Calendrier de disponibilité prévu
            </span>
          </div>
          <div className="mt-8 grid gap-3">
            <ButtonLink href={`https://wa.me/?text=${encodeURIComponent(`Je souhaite louer ${item.title} sur MATLI`)}`} variant="ghost">
              <MessageCircle size={18} aria-hidden />
              Partager sur WhatsApp
            </ButtonLink>
          </div>
          <EquipmentReservationForm
            equipmentId={item.backendId}
            equipmentSlug={item.slug}
            equipmentTitle={item.title}
            priceDay={item.priceDay}
          />
        </aside>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <h2 className="text-2xl font-black">Description</h2>
          <p className="mt-4 leading-8 text-neutral-700">{item.description}</p>
          <h2 className="mt-10 text-2xl font-black">Caractéristiques</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {item.specs.map((spec) => (
              <div key={spec} className="rounded-md border border-neutral-200 p-4 text-sm font-semibold">
                {spec}
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-md border border-neutral-200 p-5">
          <h2 className="font-black">Propriétaire</h2>
          <p className="mt-3 text-xl font-bold">{item.companyName}</p>
          <p className="mt-2 text-sm text-neutral-600">Entreprise vérifiée · Avis {item.rating}/5</p>
          <ButtonLink href={`/entreprise/${item.companySlug}`} variant="secondary" className="mt-5 w-full">
            Voir l&apos;entreprise
          </ButtonLink>
          <button className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-200 text-sm font-semibold">
            <Share2 size={17} aria-hidden />
            Copier le lien
          </button>
        </aside>
      </section>
    </div>
  );
}
