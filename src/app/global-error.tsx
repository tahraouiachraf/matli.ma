"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="grid min-h-screen place-items-center bg-neutral-50 p-6 text-center">
        <main className="max-w-xl rounded-lg border border-neutral-200 bg-white p-8 shadow-lg">
          <p className="text-sm font-black uppercase text-orange-600">Erreur applicative</p>
          <h1 className="mt-3 text-3xl font-black text-neutral-950">Merci de réessayer plus tard</h1>
          <p className="mt-4 leading-7 text-neutral-600">MATLI n’a pas pu afficher cette page correctement.</p>
        </main>
      </body>
    </html>
  );
}
