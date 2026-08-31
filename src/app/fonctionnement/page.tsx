import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";

export const metadata: Metadata = {
  title: "Fonctionnement et conseils",
  description: "Découvrez comment louer, comparer, déposer et gérer du matériel BTP sur MATLI.",
};

const tips = [
  ["Comparer un prix de location", "Regardez le prix par jour, la durée, le transport, l'opérateur et l'état de la machine avant de choisir."],
  ["Louer avec ou sans opérateur", "Un opérateur certifié réduit les risques sur chantier, surtout pour levage, terrassement lourd et accès difficiles."],
  ["Préparer une demande efficace", "Indiquez la ville, la date, la durée, le type de chantier, le budget et votre téléphone pour obtenir une réponse rapide."],
  ["Déposer une annonce propre", "Ajoutez des photos réelles, modèle, année, disponibilité, zone de livraison, prix semaine et conditions de réservation."],
];

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksSection />
      <section id="conseils" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-bold text-orange-600">Conseils pratiques</p>
          <h1 className="mt-2 text-4xl font-black text-neutral-950">Louer ou publier une machine sans perdre du temps.</h1>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            Cette page remplace l&apos;ancien guide séparé. Elle regroupe le workflow MATLI et les conseils essentiels pour préparer les futures pages utiles au référencement.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tips.map(([title, description]) => (
            <article key={title} className="rounded-md border border-neutral-200 bg-white p-6">
              <p className="text-sm font-bold text-orange-600">Guide BTP</p>
              <h2 className="mt-3 text-2xl font-black text-neutral-950">{title}</h2>
              <p className="mt-3 leading-7 text-neutral-600">{description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/location" className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
            Voir les machines
          </Link>
          <Link href="/deposer" className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 px-5 text-sm font-bold text-neutral-800 hover:border-orange-400">
            Déposer un matériel
          </Link>
        </div>
      </section>
    </>
  );
}
