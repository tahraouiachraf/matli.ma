import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="max-w-xl">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-orange-50 text-orange-600">
          <SearchX size={30} aria-hidden />
        </div>
        <p className="mt-6 text-sm font-black uppercase text-orange-600">404</p>
        <h1 className="mt-2 text-4xl font-black text-neutral-950">Page introuvable</h1>
        <p className="mt-4 text-neutral-600">
          La page demandée n&apos;existe pas ou a été déplacée. Vous pouvez revenir à la marketplace et continuer votre recherche.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
            Accueil
          </Link>
          <Link href="/location" className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 px-5 text-sm font-bold text-neutral-800 hover:border-orange-400">
            Voir les machines
          </Link>
        </div>
      </div>
    </section>
  );
}
