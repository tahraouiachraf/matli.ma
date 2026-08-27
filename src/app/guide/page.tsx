import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide MATLI",
  description: "Conseils, prix et comparatifs pour louer, acheter et entretenir du matériel BTP au Maroc.",
};

const articles = [
  ["Prix location mini-pelle Maroc", "Comprendre les prix par jour, semaine, transport et opérateur."],
  ["Location avec ou sans opérateur ?", "Quand choisir un conducteur certifié pour sécuriser le chantier."],
  ["Quand faire une vidange ?", "Repères de maintenance par heures moteur et calendrier."],
  ["Combien coûte le transport d'un engin ?", "Distance, gabarit, autorisations et frais réels."],
];

export default function GuidePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Guide MATLI</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
        Une base éditoriale SEO pour aider les professionnels à choisir, louer et entretenir leur matériel.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {articles.map(([title, description]) => (
          <Link key={title} href="#" className="rounded-md border border-neutral-200 bg-white p-6 hover:border-amber-500">
            <p className="text-sm font-bold text-amber-700">Conseils BTP</p>
            <h2 className="mt-3 text-2xl font-black text-neutral-950">{title}</h2>
            <p className="mt-3 text-neutral-600">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
