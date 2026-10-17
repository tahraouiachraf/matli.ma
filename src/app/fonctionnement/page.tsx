import type { Metadata } from "next";
import { BadgeCheck, CalendarCheck, CalendarDays, ChevronRight, CircleHelp, ClipboardCheck, Clock3, Handshake, HardHat, MapPin, Search, ShieldCheck, Truck, UserRoundCheck } from "lucide-react";
import { FunctioningExperience } from "@/components/sections/FunctioningExperience";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd, pageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Fonctionnement et conseils",
  description: "Découvrez comment louer, comparer, déposer et gérer du matériel BTP sur MATLI.",
  alternates: { canonical: "/how-it-works" },
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
  "@id": "https://www.matli.ma/how-it-works#faq",
  isPartOf: { "@id": "https://www.matli.ma/how-it-works#webpage" },
  mainEntity: faq.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={[faqJsonLd, pageJsonLd("/how-it-works", "Fonctionnement et conseils", metadata.description ?? "")]} />
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Accueil", path: "/" }, { name: "Comment ça marche ?", path: "/how-it-works" }]} />
      </div>
      <section className="bg-white px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl border border-orange-400 bg-orange-500 text-white shadow-2xl shadow-orange-950/10">
          <div className="relative px-5 py-9 sm:px-9 sm:py-12 lg:px-12 lg:py-14">
            <div className="min-w-0 max-w-4xl animate-fade-up">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-white/90">
                <HardHat size={16} aria-hidden /> Le mode d&apos;emploi MATLI
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl font-black leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                La bonne machine, au bon moment, avec un suivi clair.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/90 sm:text-lg sm:leading-8">
                Recherchez, comparez et demandez une location en quelques étapes. Chaque échange, date et décision reste accessible depuis votre espace.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/rentals" className="bg-white text-neutral-950 hover:bg-orange-50">
                  <Search size={18} aria-hidden /> Voir les machines
                </ButtonLink>
                <ButtonLink href="/register" className="border border-white/60 bg-transparent text-white hover:bg-white/10">
                  Proposer mon matériel <ChevronRight size={18} aria-hidden />
                </ButtonLink>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/25 pt-5 text-center sm:max-w-xl sm:text-left">
                {[["2", "parcours"], ["5", "étapes guidées"], ["1", "espace de suivi"]].map(([value, label]) => (
                  <div key={label} className="min-w-0">
                    <strong className="block text-xl font-black sm:text-2xl">{value}</strong>
                    <span className="mt-0.5 block text-[11px] font-bold leading-4 text-white/80 sm:text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50" aria-label="Les cinq étapes MATLI">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-5 lg:px-8">
          {[
            [Search, "01", "Rechercher"],
            [BadgeCheck, "02", "Comparer"],
            [CalendarDays, "03", "Choisir les dates"],
            [ClipboardCheck, "04", "Demander"],
            [Handshake, "05", "Louer"],
          ].map(([Icon, number, label], index) => {
            const StepIcon = Icon as typeof Search;
            return (
              <div key={label as string} className={`flex min-w-0 items-center gap-3 border-neutral-200 py-4 sm:py-5 md:px-4 ${index > 0 ? "md:border-l" : ""} ${index === 4 ? "col-span-2 border-t md:col-span-1 md:border-t-0" : index > 1 ? "border-t md:border-t-0" : ""}`}>
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-orange-100 text-orange-700"><StepIcon size={17} aria-hidden /></span>
                <div className="min-w-0">
                  <span className="block text-[10px] font-black text-orange-700">ÉTAPE {number as string}</span>
                  <strong className="block truncate text-sm text-neutral-950">{label as string}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FunctioningExperience />

      <section className="border-y border-neutral-200 bg-neutral-100">
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

          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl shadow-orange-950/5">
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
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-xl bg-orange-500 p-6 text-white shadow-xl shadow-orange-950/10 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Votre chantier peut avancer.</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/90">Consultez les machines disponibles et comparez les offres proches de vous.</p>
          </div>
          <ButtonLink href="/rentals" className="w-full shrink-0 bg-white text-neutral-950 hover:bg-orange-50 sm:w-auto">
            Voir les machines <ChevronRight size={18} aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
