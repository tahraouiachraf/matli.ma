import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Gauge, MapPin, MessageCircle, Scale, Share2, Star, Truck, UserRoundCheck, Wrench } from "lucide-react";
import { CommercialEventTracker } from "@/components/analytics/CommercialEventTracker";
import { EquipmentReservationForm } from "@/components/forms/EquipmentReservationForm";
import { EquipmentReportForm } from "@/components/forms/EquipmentReportForm";
import { EquipmentGallery } from "@/components/marketplace/EquipmentGallery";
import { EquipmentAvailabilityCalendar } from "@/components/marketplace/EquipmentAvailabilityCalendar";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { statusLabels } from "@/lib/data";
import { formatDh } from "@/lib/format";
import { JsonLd, absoluteUrl, equipmentJsonLd } from "@/lib/seo";
import { ApiError } from "@/services/api/client";
import { getEquipmentDetailStrict, getSimilarEquipment } from "@/services/api/matli";

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
  const [item, similar] = await Promise.all([getEquipmentDetailStrict(slug).catch((error) => {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }), getSimilarEquipment(slug).catch(() => [])]);

  if (!item) notFound();

  return (
    <div className="bg-white">
      <JsonLd data={equipmentJsonLd(item)} />
      <CommercialEventTracker eventName="equipment_viewed" equipmentId={item.backendId} city={item.city} category={item.category} pagePath={`/materiel/${item.slug}`} />
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
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-neutral-200 p-4"><Wrench className="text-orange-600" size={20} /><p className="mt-3 text-xs font-bold uppercase text-neutral-500">État</p><p className="mt-1 font-black">{({ excellent: "Excellent", very_good: "Très bon", good: "Bon", fair: "Correct" } as const)[item.technicalCondition ?? "good"]}</p></div>
            <div className="rounded-md border border-neutral-200 p-4"><Gauge className="text-orange-600" size={20} /><p className="mt-3 text-xs font-bold uppercase text-neutral-500">Puissance</p><p className="mt-1 font-black">{item.powerHp ? `${item.powerHp} ch` : "À confirmer"}</p></div>
            <div className="rounded-md border border-neutral-200 p-4"><Scale className="text-orange-600" size={20} /><p className="mt-3 text-xs font-bold uppercase text-neutral-500">Tonnage</p><p className="mt-1 font-black">{item.tonnage ? `${item.tonnage} t` : "À confirmer"}</p></div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {item.specs.map((spec) => (
              <div key={spec} className="rounded-md border border-neutral-200 p-4 text-sm font-semibold">
                {spec}
              </div>
            ))}
          </div>
          <div className="mt-10"><EquipmentAvailabilityCalendar periods={item.availabilityPeriods} /></div>
          <div className="mt-10 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
            <h2 className="text-xl font-black">Conditions de livraison</h2>
            <p className="mt-3 leading-7 text-neutral-700">{item.delivery ? item.deliveryTerms || "Livraison possible. Le délai, la zone et le tarif sont confirmés par le propriétaire avant validation." : "Cette machine est à retirer auprès du propriétaire."}</p>
          </div>
          <div className="mt-10">
            <div className="flex items-end justify-between gap-3"><h2 className="text-2xl font-black">Avis clients</h2><span className="inline-flex items-center gap-1 font-black text-neutral-900"><Star size={18} className="fill-amber-400 text-amber-400" />{item.reviewsCount ? `${item.rating}/5 · ${item.reviewsCount} avis` : "Nouveau propriétaire"}</span></div>
            <div className="mt-4 grid gap-3">
              {item.reviews?.length ? item.reviews.map((review) => <article key={review.id} className="rounded-md border border-neutral-200 p-4"><div className="flex justify-between gap-3"><p className="font-black">{review.author}</p><span className="font-black text-amber-600">{review.rating}/5</span></div><p className="mt-2 text-sm leading-6 text-neutral-600">{review.comment || "Location réalisée avec succès."}</p></article>) : <p className="rounded-md bg-neutral-50 p-4 text-sm text-neutral-600">Aucun avis publié pour le moment.</p>}
            </div>
          </div>
        </div>
        <aside className="rounded-md border border-neutral-200 p-5">
          <h2 className="font-black">Propriétaire</h2>
          <p className="mt-3 text-xl font-bold">{item.companyName}</p>
          <p className="mt-2 text-sm text-neutral-600">{item.companyVerified ? "Entreprise vérifiée" : "Identité en cours de vérification"} · {item.reviewsCount ? `Avis ${item.rating}/5` : "Nouveau sur MATLI"}</p>
          <ButtonLink href={`/entreprise/${item.companySlug}`} variant="secondary" className="mt-5 w-full">
            Voir l&apos;entreprise
          </ButtonLink>
          <button className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-200 text-sm font-semibold">
            <Share2 size={17} aria-hidden />
            Copier le lien
          </button>
          <EquipmentReportForm equipmentId={item.backendId} />
        </aside>
      </section>
      {similar.length ? <section className="border-t border-neutral-200 bg-neutral-50"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-black">Machines similaires</h2><p className="mt-2 text-neutral-600">Autres offres de la même catégorie ou disponibles dans la même ville.</p><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{similar.map((machine) => <EquipmentCard key={machine.id} item={machine} />)}</div></div></section> : null}
    </div>
  );
}
