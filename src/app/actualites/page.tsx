import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { getNewsArticlesStrict } from "@/services/api/matli";

export const metadata: Metadata = {
  title: "Actualités du matériel BTP et de la location au Maroc",
  description: "Conseils, tendances et informations utiles pour louer, exploiter et gérer du matériel BTP au Maroc avec MATLI.ma.",
  alternates: { canonical: "/news" },
};

export const revalidate = 300;

const fallbackImage = "/equipment/jcb-excavator-quarry.jpg";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("fr-MA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default async function NewsPage() {
  const articles = await getNewsArticlesStrict(18).catch(() => []);

  return (
    <main>
      <section className="border-b border-orange-100 bg-orange-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 text-sm font-black uppercase text-orange-700"><Newspaper size={18} aria-hidden /> Actualités MATLI</span>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-neutral-950 sm:text-5xl">Le terrain, les machines et la location BTP au Maroc.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-650 sm:text-lg">Des informations concrètes pour choisir le bon matériel, préparer vos locations et mieux piloter vos chantiers.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {articles.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <article key={article.id} className={`group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg ${index === 0 ? "md:col-span-2 lg:grid lg:grid-cols-2" : ""}`}>
                <div className="min-h-56 bg-neutral-100 bg-cover bg-center" role="img" aria-label={`Illustration de ${article.title}`} style={{ backgroundImage: `url(${article.imageUrl ?? fallbackImage})` }} />
                <div className="flex flex-col p-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-500"><CalendarDays size={15} aria-hidden /> {dateLabel(article.publishedAt)}</div>
                  <h2 className="mt-4 text-xl font-black leading-snug text-neutral-950 group-hover:text-orange-700">{article.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">{article.excerpt}</p>
                  <Link href={`/news/${article.slug}`} className="mt-6 inline-flex items-center gap-2 self-start text-sm font-black text-orange-700" aria-label={`Lire l’article : ${article.title}`}>Lire l&apos;article <ArrowRight size={17} aria-hidden /></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
            <Newspaper className="mx-auto text-orange-600" size={34} aria-hidden />
            <h2 className="mt-4 text-xl font-black text-neutral-950">Les premières actualités arrivent bientôt.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-600">Retrouvez prochainement nos conseils sur la location, la disponibilité et l’entretien des machines BTP.</p>
          </div>
        )}
      </section>
    </main>
  );
}
