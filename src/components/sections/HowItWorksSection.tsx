import { CalendarCheck, ClipboardCheck, Handshake, Search, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

const steps: Array<[LucideIcon, string, string]> = [
  [Search, "Rechercher", "Le client choisit une machine, une ville et compare les offres disponibles."],
  [SlidersHorizontal, "Comparer", "Prix, propriétaire, livraison, opérateur et état de la machine sont visibles."],
  [CalendarCheck, "Disponibilité", "Les dates et le statut évitent les doubles réservations."],
  [ClipboardCheck, "Demander", "Le client envoie une demande ou réserve selon les règles du propriétaire."],
  [Handshake, "Louer", "Le propriétaire confirme, prépare la machine et suit la location."],
];

export function HowItWorksSection() {
  return (
    <section id="fonctionnement" className="scroll-mt-20 bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-orange-700">Le parcours</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">
              Cinq étapes, sans détour.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 sm:leading-8">
              De la recherche au retour du matériel, les informations essentielles restent visibles pour le client et le propriétaire.
            </p>
          </div>
          <ButtonLink href="/rentals" className="w-full bg-orange-600 text-white hover:bg-orange-700 sm:w-auto">Voir les offres</ButtonLink>
        </div>

        <div className="relative mt-10">
          <div className="absolute bottom-8 left-[23px] top-8 w-0.5 overflow-hidden bg-orange-200 lg:hidden" aria-hidden>
            <span className="process-flow-progress block h-24 w-full bg-orange-500" />
          </div>
          <div className="absolute left-[10%] right-[10%] top-6 hidden h-0.5 overflow-hidden bg-orange-200 lg:block" aria-hidden>
            <span className="process-flow-progress-horizontal block h-full w-28 bg-orange-500" />
          </div>
          <div className="grid gap-3 lg:grid-cols-5">
            {steps.map(([Icon, title, text], index) => (
              <article key={title} className="group relative rounded-lg border border-neutral-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 lg:pt-5">
                <div className="flex gap-4 lg:block">
                  <div className="relative z-10 grid size-12 shrink-0 place-items-center rounded-md bg-orange-500 text-white transition duration-300 group-hover:bg-orange-600 lg:mx-auto">
                    <Icon size={22} aria-hidden />
                  </div>
                  <div className="min-w-0 lg:mt-5 lg:text-center">
                    <p className="text-xs font-black uppercase text-orange-700">Étape {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-lg font-black text-neutral-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
