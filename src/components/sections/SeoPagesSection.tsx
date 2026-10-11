import Link from "next/link";
import { seoLandingPages } from "@/lib/data";

export function SeoPagesSection() {
  return (
    <section className="border-y border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="font-bold text-orange-700">Locations populaires</p>
        <h2 className="mt-2 text-3xl font-black text-neutral-950">Trouvez un engin près de votre chantier.</h2>
        <p className="mt-3 max-w-2xl leading-7 text-neutral-600">Accédez directement aux matériels les plus recherchés et comparez les offres disponibles dans les principales villes du Maroc.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {seoLandingPages.map((page) => (
            <Link key={page.href} href={page.href} className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-700 transition hover:border-orange-400 hover:text-orange-700">
              {page.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
