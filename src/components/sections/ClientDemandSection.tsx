import { TrendingDown, UsersRound } from "lucide-react";
import { clientWantedMachines } from "@/lib/data";
import { formatDh } from "@/lib/format";

export function ClientDemandSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-bold text-orange-600">Demande client</p>
          <h2 className="mt-2 text-3xl font-black text-neutral-950 md:text-4xl">
            Les demandes qui peuvent générer vos prochaines locations.
          </h2>
          <p className="mt-4 text-neutral-600">
            Le propriétaire ne publie pas seulement une annonce: il voit aussi les besoins du marché par machine, ville et budget. Cela aide à ajuster les prix et à répondre vite.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {clientWantedMachines.map((machine) => (
            <article key={machine.name} className="rounded-md border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <UsersRound className="text-orange-500" size={22} aria-hidden />
                <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-neutral-700">
                  {machine.requests} demandes
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black text-neutral-950">{machine.name}</h3>
              <p className="mt-2 text-sm text-neutral-600">{machine.city}</p>
              <div className="mt-4 rounded-md bg-white p-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-500">
                  <TrendingDown size={14} aria-hidden />
                  Prix observés
                </p>
                <p className="mt-1 font-black text-neutral-950">
                  {formatDh(machine.minPrice)} - {formatDh(machine.maxPrice)} / jour
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
