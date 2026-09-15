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
    <section id="fonctionnement" className="bg-neutral-100 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-sm font-black uppercase text-orange-700">Le parcours</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Cinq étapes, sans détour.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:leading-8">
              De la recherche au retour du matériel, les informations essentielles restent visibles pour le client et le propriétaire.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/location" className="bg-orange-600 text-white hover:bg-orange-700">Voir les offres</ButtonLink>
            </div>
          </div>

          <div className="process-flow-line relative">
            <div className="absolute bottom-8 left-[23px] top-8 w-0.5 overflow-hidden bg-orange-200" aria-hidden>
              <span className="process-flow-progress block h-24 w-full bg-orange-500" />
            </div>
            <div className="grid gap-4">
              {steps.map(([Icon, title, text], index) => (
                <article key={title} className="group relative rounded-lg border border-neutral-200 bg-white p-4 transition duration-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 sm:p-5">
                  <div className="flex gap-4">
                    <div className="relative z-10 grid size-12 shrink-0 place-items-center rounded-md bg-orange-500 text-white transition duration-300 group-hover:scale-105 group-hover:bg-orange-600">
                      <Icon size={22} aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase text-orange-700">Étape {String(index + 1).padStart(2, "0")}</p>
                      <h3 className="mt-1 text-xl font-black text-neutral-950">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
