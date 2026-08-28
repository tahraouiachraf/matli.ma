import Link from "next/link";
import { seoLandingPages } from "@/lib/data";

export function SeoPagesSection() {
  return (
    <section className="bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="font-bold text-orange-600">SEO prêt pour l’API</p>
        <h2 className="mt-2 text-3xl font-black text-neutral-950">Pages de recherche à connecter ensuite.</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {seoLandingPages.map((page) => (
            <Link key={page.href} href={page.href} className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 hover:border-orange-400 hover:text-orange-600">
              {page.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
