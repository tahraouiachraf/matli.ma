import type { Metadata } from "next";
import { BadgeCheck, CalendarCheck, Check, ChevronRight, ClipboardCheck, HardHat, Search, ShieldCheck, Truck, UserRoundCheck } from "lucide-react";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Fonctionnement et conseils",
  description: "Découvrez comment louer, comparer, déposer et gérer du matériel BTP sur MATLI.",
};

const tips = [
  [ClipboardCheck, "Décrivez précisément le besoin", "Indiquez le chantier, les dates, la ville et les contraintes d'accès pour recevoir une réponse adaptée."],
  [CalendarCheck, "Vérifiez les dates", "Consultez la disponibilité et prévoyez une marge pour la livraison, la prise en main et le retour de la machine."],
  [UserRoundCheck, "Choisissez l'opérateur", "Selon la machine et le chantier, comparez une location avec opérateur à une location seule."],
  [ShieldCheck, "Validez avant le départ", "Confirmez le prix, le transport, l'état du matériel, les responsabilités et les conditions d'annulation."],
];

const renterPoints = [
  "Comparer les offres, prix et options au même endroit",
  "Choisir des dates compatibles avec le chantier",
  "Envoyer une demande claire au propriétaire",
  "Suivre la confirmation et l'historique de location",
];

const ownerPoints = [
  "Publier une fiche complète avec plusieurs photos",
  "Définir prix, livraison, opérateur et disponibilité",
  "Accepter, refuser ou annuler une demande",
  "Piloter le calendrier et les locations en cours",
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-orange-100 bg-orange-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
          <div className="min-w-0 animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-md border border-orange-200 bg-white px-3 py-1.5 text-xs font-black uppercase text-orange-700">
              <HardHat size={15} aria-hidden /> Comment fonctionne MATLI ?
            </p>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Louer du matériel BTP devient simple et transparent.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
              Trouvez une machine, comparez les conditions et envoyez votre demande. Le propriétaire confirme la disponibilité et organise la location avec vous.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/location" className="bg-orange-600 text-white hover:bg-orange-700">
                <Search size={18} aria-hidden /> Trouver une machine
              </ButtonLink>
              <ButtonLink href="/inscription" variant="secondary">
                Créer mon compte <ChevronRight size={18} aria-hidden />
              </ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-orange-200 pt-5 text-sm font-bold text-neutral-700">
              <span className="inline-flex items-center gap-2"><BadgeCheck size={18} className="text-orange-600" aria-hidden /> Offres comparables</span>
              <span className="inline-flex items-center gap-2"><CalendarCheck size={18} className="text-orange-600" aria-hidden /> Dates suivies</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={18} className="text-orange-600" aria-hidden /> Échanges centralisés</span>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-xl sm:block" aria-hidden>
            <div className="workflow-visual relative overflow-hidden rounded-lg border border-orange-200 bg-white p-5 shadow-xl shadow-orange-950/8 sm:p-7">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-orange-700">Une demande MATLI</p>
                  <p className="mt-1 text-lg font-black text-neutral-950">Du besoin à la location</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-orange-500 text-white"><HardHat size={22} /></span>
              </div>
              <div className="relative grid gap-4">
                <span className="absolute bottom-6 left-5 top-6 w-px bg-orange-200" />
                {[
                  [Search, "Besoin renseigné", "Casablanca · 5 jours"],
                  [Truck, "Machine sélectionnée", "Livraison disponible"],
                  [CalendarCheck, "Dates confirmées", "Prête pour le chantier"],
                ].map(([Icon, title, detail], index) => {
                  const StepIcon = Icon as typeof Search;
                  return (
                    <div key={title as string} className="workflow-visual-step relative flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-4" style={{ animationDelay: `${index * 220}ms` }}>
                      <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-700"><StepIcon size={19} /></span>
                      <span className="min-w-0 flex-1">
                        <strong className="block text-sm text-neutral-950">{title as string}</strong>
                        <span className="mt-1 block text-xs font-semibold text-neutral-500">{detail as string}</span>
                      </span>
                      <Check className="size-5 shrink-0 text-emerald-600" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksSection />

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-orange-700">Un espace pour chaque usage</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">Chacun voit les informations et les actions qui le concernent.</h2>
          </div>
          <div className="mt-10 grid overflow-hidden rounded-lg border border-neutral-200 lg:grid-cols-2">
            {[
              [Search, "Je cherche une machine", "Locataire", renterPoints],
              [HardHat, "Je propose mon matériel", "Propriétaire", ownerPoints],
            ].map(([Icon, title, label, points], index) => {
              const AudienceIcon = Icon as typeof Search;
              return (
                <article key={label as string} className={`p-5 sm:p-8 ${index === 1 ? "border-t border-neutral-200 lg:border-l lg:border-t-0" : ""}`}>
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-700"><AudienceIcon size={23} aria-hidden /></span>
                    <div>
                      <p className="text-xs font-black uppercase text-orange-700">{label as string}</p>
                      <h3 className="mt-1 text-xl font-black text-neutral-950 sm:text-2xl">{title as string}</h3>
                    </div>
                  </div>
                  <ul className="mt-6 grid gap-3">
                    {(points as string[]).map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm font-semibold leading-6 text-neutral-600">
                        <Check className="mt-1 size-4 shrink-0 text-orange-600" strokeWidth={3} aria-hidden />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="conseils" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-orange-700">Avant de confirmer</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">Les bons réflexes pour une location réussie.</h2>
          <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            Quelques vérifications simples permettent d&apos;éviter les imprévus et d&apos;accélérer la réponse du propriétaire.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tips.map(([Icon, title, description], index) => {
            const TipIcon = Icon as typeof Search;
            return (
              <article key={title as string} className="group rounded-lg border border-neutral-200 bg-white p-5 transition duration-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-700 transition group-hover:bg-orange-500 group-hover:text-white"><TipIcon size={21} aria-hidden /></span>
                  <div>
                    <p className="text-xs font-black uppercase text-neutral-500">Conseil {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 text-lg font-black text-neutral-950 sm:text-xl">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{description as string}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-lg bg-neutral-950 p-5 text-white sm:flex-row sm:items-center sm:p-7">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Votre chantier peut avancer.</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-300">Consultez les machines disponibles et comparez les offres proches de vous.</p>
          </div>
          <ButtonLink href="/location" className="w-full shrink-0 bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
            Voir les machines <ChevronRight size={18} aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
