import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CalendarCheck, CalendarDays, ChevronRight, CircleHelp, ClipboardCheck, Clock3, HardHat, MapPin, Search, ShieldCheck, Truck, UserRoundCheck } from "lucide-react";
import { FunctioningExperience } from "@/components/sections/FunctioningExperience";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/lib/seo";

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

const faq = [
  ["Quand une réservation est-elle confirmée ?", "La demande devient confirmée après validation du propriétaire. Le client reçoit alors une notification et retrouve le nouveau statut dans son espace."],
  ["Les dates déjà réservées restent-elles disponibles ?", "Non. Les périodes confirmées apparaissent dans le calendrier et ne doivent plus être proposées pour une nouvelle réservation."],
  ["La livraison et l'opérateur sont-ils toujours inclus ?", "Non. Chaque annonce indique séparément si la livraison et un opérateur sont disponibles. Les conditions doivent être vérifiées avant confirmation."],
  ["Comment suivre ou annuler une demande ?", "Le client consulte ses locations depuis son espace. Les actions disponibles dépendent du statut de la demande et des conditions convenues avec le propriétaire."],
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <section className="relative isolate min-h-[610px] overflow-hidden bg-neutral-950 text-white sm:min-h-[640px]">
        <Image
          src="/equipment/jcb-excavator-quarry.jpg"
          alt="Pelle sur chenilles en activité sur un chantier"
          fill
          priority
          sizes="100vw"
          className="function-hero-image -z-20 object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-neutral-950/70" />
        <div className="mx-auto flex min-h-[610px] max-w-7xl items-center px-4 py-12 sm:min-h-[640px] sm:px-6 sm:py-16 lg:px-8">
          <div className="min-w-0 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-neutral-950/35 px-3 py-1.5 text-xs font-black uppercase text-orange-300 backdrop-blur-sm">
              <HardHat size={15} aria-hidden /> Comment fonctionne MATLI ?
            </p>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-5xl lg:text-[3.5rem]">
              Louer du matériel BTP devient simple et transparent.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-200 sm:text-lg sm:leading-8">
              Trouvez une machine, comparez les conditions et envoyez votre demande. Le propriétaire confirme la disponibilité et organise la location avec vous.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/rentals" className="bg-orange-500 text-white hover:bg-orange-600">
                <Search size={18} aria-hidden /> Trouver une machine
              </ButtonLink>
              <ButtonLink href="/register" className="border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                Créer mon compte <ChevronRight size={18} aria-hidden />
              </ButtonLink>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-sm font-bold text-white/90">
              <span className="inline-flex items-center gap-2"><BadgeCheck size={18} className="text-orange-300" aria-hidden /> Offres comparables</span>
              <span className="inline-flex items-center gap-2"><CalendarCheck size={18} className="text-orange-300" aria-hidden /> Dates suivies</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={18} className="text-orange-300" aria-hidden /> Échanges centralisés</span>
            </div>
          </div>
        </div>
      </section>

      <FunctioningExperience />

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-black uppercase text-orange-700">Exemple indicatif</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">Une demande compréhensible avant de confirmer.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600">
              MATLI rassemble les informations essentielles dans un même récapitulatif. Le propriétaire peut répondre rapidement et le client sait précisément ce qui reste à valider.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                [HardHat, "Machine", "Mini-pelle 2,7 T"],
                [MapPin, "Chantier", "Casablanca"],
                [CalendarDays, "Période", "5 jours"],
                [Truck, "Transport", "Sur devis"],
              ].map(([Icon, label, value]) => {
                const SummaryIcon = Icon as typeof HardHat;
                return (
                  <div key={label as string} className="flex items-center gap-3 border-b border-neutral-200 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-700"><SummaryIcon size={18} aria-hidden /></span>
                    <span>
                      <span className="block text-xs font-bold uppercase text-neutral-500">{label as string}</span>
                      <strong className="mt-0.5 block text-sm text-neutral-950">{value as string}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-xl shadow-neutral-950/5">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white p-5 sm:p-6">
              <div>
                <p className="text-xs font-black uppercase text-orange-700">Récapitulatif estimatif</p>
                <h3 className="mt-1 text-xl font-black text-neutral-950">Mini-pelle compacte</h3>
              </div>
              <span className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800">Disponible</span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-4"><span className="text-neutral-600">Prix journalier indicatif</span><strong>950 DH</strong></div>
                <div className="flex items-center justify-between gap-4"><span className="text-neutral-600">Durée demandée</span><strong>5 jours</strong></div>
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4"><span className="text-neutral-600">Livraison</span><strong>À confirmer</strong></div>
                <div className="flex items-end justify-between gap-4 pt-1"><span className="font-bold text-neutral-700">Estimation location</span><strong className="text-2xl text-neutral-950">4 750 DH</strong></div>
              </div>
              <p className="mt-5 flex items-start gap-2 rounded-md bg-orange-50 p-3 text-xs font-semibold leading-5 text-orange-900">
                <Clock3 className="mt-0.5 size-4 shrink-0" aria-hidden /> Le prix final, le transport et les conditions sont confirmés avec le propriétaire.
              </p>
            </div>
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
        <div className="mt-16 grid gap-8 border-t border-neutral-200 pt-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <span className="grid size-11 place-items-center rounded-md bg-orange-50 text-orange-700"><CircleHelp size={22} aria-hidden /></span>
            <h2 className="mt-4 text-2xl font-black text-neutral-950 sm:text-3xl">Questions fréquentes</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Les réponses essentielles avant votre première demande.</p>
          </div>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {faq.map(([question, answer], index) => (
              <details key={question} className="group py-1" open={index === 0}>
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-black text-neutral-950 marker:hidden">
                  <span>{question}</span>
                  <ChevronRight className="size-5 shrink-0 text-orange-700 transition group-open:rotate-90" aria-hidden />
                </summary>
                <p className="max-w-3xl pb-5 pr-8 text-sm leading-6 text-neutral-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-lg bg-neutral-950 p-5 text-white sm:flex-row sm:items-center sm:p-7">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Votre chantier peut avancer.</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-300">Consultez les machines disponibles et comparez les offres proches de vous.</p>
          </div>
          <ButtonLink href="/rentals" className="w-full shrink-0 bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
            Voir les machines <ChevronRight size={18} aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
