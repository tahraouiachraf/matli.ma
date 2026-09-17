"use client";

import { ArrowRight, BadgeCheck, Building2, MapPin, RefreshCw, Wrench } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getCompaniesStrict } from "@/services/api/matli";
import type { Company } from "@/types";

function DirectorySkeleton() {
  return (
    <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="min-h-64 animate-pulse rounded-md border border-neutral-200 bg-white p-5">
          <div className="size-14 rounded-md bg-orange-100" />
          <div className="mt-5 h-6 w-2/3 rounded bg-neutral-200" />
          <div className="mt-3 h-4 w-full rounded bg-neutral-100" />
          <div className="mt-2 h-4 w-4/5 rounded bg-neutral-100" />
          <div className="mt-8 h-11 rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

export function CompaniesDirectory({ initialCompanies }: { initialCompanies: Company[] }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [loading, setLoading] = useState(initialCompanies.length === 0);
  const [failed, setFailed] = useState(false);

  const loadCompanies = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setFailed(false);

    try {
      setCompanies(await getCompaniesStrict());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getCompaniesStrict()
      .then((items) => {
        if (!active) return;
        setCompanies(items);
        setFailed(false);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cities = new Set(companies.map((company) => company.city)).size;
  const equipmentCount = companies.reduce((total, company) => total + company.equipmentCount, 0);

  return (
    <main className="bg-neutral-50">
      <section className="border-b border-orange-100 bg-orange-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black text-orange-700">
              <BadgeCheck size={18} aria-hidden /> Réseau MATLI
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-neutral-950 sm:text-5xl">
              Entreprises de location de matériel BTP
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
              Consultez les parcs des propriétaires vérifiés, comparez leurs machines disponibles et trouvez un partenaire près de votre chantier.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              [String(companies.length), "Entreprises"],
              [String(equipmentCount), "Machines"],
              [String(cities), "Villes"],
            ].map(([value, label]) => (
              <div key={label} className="min-w-24 rounded-md border border-orange-200 bg-white p-3 text-center sm:min-w-28">
                <dt className="text-xs font-bold text-neutral-500">{label}</dt>
                <dd className="mt-1 text-2xl font-black text-neutral-950">{loading ? "–" : value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black text-orange-600">Propriétaires vérifiés</p>
            <h2 className="mt-1 text-2xl font-black text-neutral-950">Parcs disponibles sur MATLI</h2>
          </div>
          {!loading && !failed ? (
            <p className="text-sm font-semibold text-neutral-500">{companies.length} résultat{companies.length > 1 ? "s" : ""}</p>
          ) : null}
        </div>

        {loading ? <DirectorySkeleton /> : null}

        {!loading && failed && companies.length === 0 ? (
          <div className="mt-7 rounded-md border border-red-200 bg-white p-8 text-center shadow-sm" role="alert">
            <Building2 className="mx-auto text-orange-500" size={32} aria-hidden />
            <p className="mt-3 font-black text-neutral-950">Impossible de charger les entreprises</p>
            <p className="mt-2 text-sm text-neutral-600">Merci de réessayer dans quelques instants.</p>
            <button
              type="button"
              onClick={() => void loadCompanies()}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              <RefreshCw size={17} aria-hidden /> Réessayer
            </button>
          </div>
        ) : null}

        {!loading && companies.length > 0 ? (
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <article key={company.slug} className="flex min-h-64 flex-col rounded-md border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-md bg-orange-500 text-lg font-black text-white">{company.logo}</div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-black text-emerald-700">
                    <BadgeCheck size={14} aria-hidden /> Vérifiée
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black text-neutral-950">{company.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{company.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-neutral-600">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={16} className="text-orange-500" aria-hidden />{company.city}</span>
                  <span className="inline-flex items-center gap-1.5"><Wrench size={16} className="text-orange-500" aria-hidden />{company.equipmentCount} machine{company.equipmentCount > 1 ? "s" : ""}</span>
                </div>
                <Link href={`/entreprise/${company.slug}`} className="mt-auto inline-flex min-h-11 items-center justify-between border-t border-neutral-100 pt-4 text-sm font-black text-orange-700 hover:text-orange-800">
                  Voir le parc matériel <ArrowRight size={17} aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        ) : null}

        {!loading && !failed && companies.length === 0 ? (
          <div className="mt-7 rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center">
            <Building2 className="mx-auto text-orange-500" size={32} aria-hidden />
            <p className="mt-3 font-black text-neutral-950">Aucune entreprise publiée pour le moment</p>
            <p className="mt-2 text-sm text-neutral-600">Les entreprises vérifiées apparaîtront prochainement ici.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
