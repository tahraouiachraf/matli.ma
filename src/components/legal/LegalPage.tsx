import type { ReactNode } from "react";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="bg-neutral-50">
      <section className="border-b border-orange-100 bg-orange-50"><div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-black uppercase text-orange-700">Informations légales</p>
        <h1 className="mt-3 text-3xl font-black text-neutral-950 sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-700">{intro}</p>
      </div></section>
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 text-neutral-700">{children}</div>
        <p className="mt-10 border-t border-neutral-200 pt-5 text-sm text-neutral-500">Dernière mise à jour: 16 septembre 2026.</p>
      </article>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="text-xl font-black text-neutral-950">{title}</h2><div className="mt-3 grid gap-3 leading-7">{children}</div></section>;
}
