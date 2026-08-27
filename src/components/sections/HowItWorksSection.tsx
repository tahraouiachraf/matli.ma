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
    <section id="fonctionnement" className="bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-bold text-orange-600">Workflow</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-neutral-950 md:text-5xl">
              Rechercher, comparer, réserver. Simple pour le client, puissant pour le propriétaire.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-neutral-600">
              MATLI montre plusieurs offres pour une même machine. Le client voit les prix, contacte le propriétaire et peut réserver. Le propriétaire garde le contrôle sur ses locations.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/location">Voir les offres</ButtonLink>
              <ButtonLink href="/deposer" variant="secondary">
                Déposer une machine
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-orange-200 md:block" />
            <div className="grid gap-4">
              {steps.map(([Icon, title, text], index) => (
                <article key={title} className="relative rounded-xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-950/5 transition hover:-translate-y-1 hover:border-orange-300">
                  <div className="flex gap-4">
                    <div className="relative z-10 grid size-12 shrink-0 place-items-center rounded-lg bg-orange-500 text-white">
                      <Icon size={22} aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase text-orange-600">Étape {String(index + 1).padStart(2, "0")}</p>
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
