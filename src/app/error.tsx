"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="max-w-xl">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={30} aria-hidden />
        </div>
        <p className="mt-6 text-sm font-black uppercase text-red-600">500</p>
        <h1 className="mt-2 text-4xl font-black text-neutral-950">Une erreur est survenue</h1>
        <p className="mt-4 text-neutral-600">
          MATLI n&apos;a pas pu charger cette page correctement. Vous pouvez réessayer ou revenir à l&apos;accueil.
        </p>
        {error.digest ? <p className="mt-3 text-xs text-neutral-400">Référence: {error.digest}</p> : null}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600"
          >
            <RotateCcw size={17} aria-hidden />
            Réessayer
          </button>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 px-5 text-sm font-bold text-neutral-800 hover:border-orange-400">
            Accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
