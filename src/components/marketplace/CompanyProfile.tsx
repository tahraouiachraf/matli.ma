"use client";

import { BadgeCheck, Building2, MapPin, RefreshCw, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { JsonLd, absoluteUrl } from "@/lib/seo";
import { ApiError } from "@/services/api/client";
import { getCompanyDetailStrict } from "@/services/api/matli";
import type { Company, Equipment } from "@/types";

export type CompanyDetailPayload = {
  company: Company;
  equipment: Equipment[];
};

function ProfileSkeleton() {
  return (
    <main className="bg-neutral-50" aria-busy="true">
      <p className="sr-only" role="status">Chargement de l’entreprise</p>
      <section className="border-b border-neutral-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="size-16 rounded-md bg-orange-200" />
          <div className="mt-5 h-4 w-44 rounded bg-orange-200" />
          <div className="mt-4 h-11 max-w-xl rounded bg-neutral-200" />
          <div className="mt-4 h-5 max-w-2xl rounded bg-neutral-200" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-9 w-72 animate-pulse rounded bg-neutral-200" />
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-[4/5] animate-pulse rounded-lg border border-neutral-200 bg-white" />
          ))}
        </div>
      </section>
    </main>
  );
}

export function CompanyProfile({ slug, initialPayload }: { slug: string; initialPayload: CompanyDetailPayload | null }) {
  const [payload, setPayload] = useState(initialPayload);
  const [loading, setLoading] = useState(initialPayload === null);
  const [failed, setFailed] = useState(false);
  const [missing, setMissing] = useState(false);

  const loadCompany = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    setMissing(false);

    try {
      setPayload(await getCompanyDetailStrict(slug));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setMissing(true);
        setPayload(null);
      } else {
        setFailed(true);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    let active = true;

    getCompanyDetailStrict(slug)
      .then((companyPayload) => {
        if (!active) return;
        setPayload(companyPayload);
        setFailed(false);
        setMissing(false);
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 404) {
          setMissing(true);
          setPayload(null);
        } else {
          setFailed(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading && !payload) return <ProfileSkeleton />;

  if (missing) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-neutral-50 px-4 py-16">
        <div className="max-w-xl text-center">
          <Building2 className="mx-auto text-orange-500" size={42} aria-hidden />
          <p className="mt-5 text-sm font-black uppercase text-orange-700">Entreprise introuvable</p>
          <h1 className="mt-2 text-3xl font-black text-neutral-950">Cette entreprise n’est plus disponible</h1>
          <p className="mt-3 text-neutral-600">Consultez les autres propriétaires vérifiés présents sur MATLI.</p>
          <Link href="/companies" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
            Voir les entreprises
          </Link>
        </div>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-neutral-50 px-4 py-16">
        <div className="max-w-xl rounded-md border border-red-200 bg-white p-8 text-center shadow-sm" role="alert">
          <Building2 className="mx-auto text-orange-500" size={38} aria-hidden />
          <h1 className="mt-4 text-2xl font-black text-neutral-950">Impossible de charger cette entreprise</h1>
          <p className="mt-2 text-sm text-neutral-600">Merci de réessayer dans quelques instants.</p>
          <button type="button" onClick={() => void loadCompany()} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
            <RefreshCw size={17} aria-hidden /> Réessayer
          </button>
        </div>
      </main>
    );
  }

  const { company, equipment: items } = payload;

  return (
    <main className="bg-neutral-50">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: company.name,
          description: company.description,
          url: absoluteUrl(`/company/${company.slug}`),
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
      <section className="border-b border-neutral-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="grid size-16 place-items-center rounded-md bg-orange-500 text-xl font-black text-white shadow-sm">{company.logo}</div>
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
          <Link href={`/rentals?city=${encodeURIComponent(company.city)}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-orange-300 bg-white px-4 text-sm font-black text-orange-700 hover:bg-orange-50">
            <Building2 size={17} aria-hidden /> Voir les offres à {company.city}
          </Link>
        </div>
        {failed ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            <span>Les informations affichées n’ont pas pu être actualisées.</span>
            <button type="button" onClick={() => void loadCompany()} className="inline-flex min-h-9 items-center gap-2 font-black text-amber-950">
              <RefreshCw size={15} aria-hidden /> Actualiser
            </button>
          </div>
        ) : null}
        {items.length ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => <EquipmentCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-md border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
            <ShieldCheck className="mx-auto text-orange-500" size={34} aria-hidden />
            <h2 className="mt-4 text-xl font-black text-neutral-950">Aucune machine publiée actuellement</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-600">Le parc de cette entreprise est en cours de mise à jour. Consultez les autres offres disponibles près de votre chantier.</p>
            <Link href="/rentals" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">Explorer les machines</Link>
          </div>
        )}
      </section>
    </main>
  );
}
