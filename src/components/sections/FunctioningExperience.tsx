"use client";

import {
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  HardHat,
  Handshake,
  Search,
  SlidersHorizontal,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

type JourneyKey = "renter" | "owner";

type JourneyStep = {
  Icon: LucideIcon;
  title: string;
  description: string;
  checklist: string[];
  result: string;
};

const journeys: Record<JourneyKey, { label: string; title: string; steps: JourneyStep[] }> = {
  renter: {
    label: "Je veux louer",
    title: "Trouver et réserver la machine adaptée",
    steps: [
      { Icon: Search, title: "Rechercher", description: "Indiquez le type de machine et la ville du chantier pour afficher les offres pertinentes.", checklist: ["Catégorie ou modèle", "Ville du chantier", "Période souhaitée"], result: "Une sélection de machines réellement adaptées à votre besoin." },
      { Icon: SlidersHorizontal, title: "Comparer", description: "Comparez les prix, les équipements, la livraison et la présence éventuelle d’un opérateur.", checklist: ["Prix par jour", "Livraison disponible", "Avec ou sans opérateur"], result: "Des conditions lisibles avant toute prise de contact." },
      { Icon: CalendarCheck, title: "Choisir les dates", description: "Consultez le calendrier et choisissez une période qui ne chevauche aucune réservation confirmée.", checklist: ["Date de début", "Date de fin", "Durée totale"], result: "Une demande basée sur une période disponible." },
      { Icon: ClipboardCheck, title: "Envoyer la demande", description: "Vérifiez le récapitulatif, précisez le chantier et transmettez votre demande au propriétaire.", checklist: ["Coordonnées vérifiées", "Adresse du chantier", "Message complémentaire"], result: "Le propriétaire reçoit une demande complète et exploitable." },
      { Icon: Handshake, title: "Louer", description: "Suivez la confirmation, les dates et le statut de la location depuis votre espace client.", checklist: ["Confirmation reçue", "Conditions validées", "Machine préparée"], result: "Une location suivie jusqu’à la restitution du matériel." },
    ],
  },
  owner: {
    label: "Je propose mon matériel",
    title: "Publier et piloter son parc de machines",
    steps: [
      { Icon: UserRoundCheck, title: "Créer le profil", description: "Renseignez vos coordonnées et votre entreprise pour présenter un profil propriétaire complet.", checklist: ["Identité et téléphone", "Entreprise", "Ville principale"], result: "Un profil professionnel prêt à recevoir des demandes." },
      { Icon: HardHat, title: "Publier la machine", description: "Ajoutez une annonce précise avec plusieurs photos, son prix et ses caractéristiques essentielles.", checklist: ["Photos réelles", "Marque et modèle", "Prix et description"], result: "Une fiche claire que les clients peuvent facilement comparer." },
      { Icon: CalendarCheck, title: "Gérer la disponibilité", description: "Bloquez les périodes indisponibles et visualisez les réservations directement dans le calendrier.", checklist: ["Dates libres", "Maintenance prévue", "Réservations confirmées"], result: "Un calendrier fiable qui limite les doubles réservations." },
      { Icon: BadgeCheck, title: "Traiter les demandes", description: "Consultez chaque demande, vérifiez les informations puis acceptez ou refusez selon votre planning.", checklist: ["Profil du client", "Durée demandée", "Lieu du chantier"], result: "Une décision rapide avec un historique horodaté." },
      { Icon: Truck, title: "Suivre la location", description: "Organisez la livraison, suivez la période louée et conservez l’historique dans votre tableau de bord.", checklist: ["Départ de la machine", "Location en cours", "Retour enregistré"], result: "Votre parc et vos locations restent centralisés." },
    ],
  },
};

export function FunctioningExperience() {
  const [journeyKey, setJourneyKey] = useState<JourneyKey>("renter");
  const [activeStep, setActiveStep] = useState(0);
  const journey = journeys[journeyKey];
  const step = journey.steps[activeStep];
  const StepIcon = step.Icon;

  function selectJourney(value: JourneyKey) {
    setJourneyKey(value);
    setActiveStep(0);
  }

  return (
    <section id="fonctionnement" className="scroll-mt-20 border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-orange-700">Un parcours adapté à votre besoin</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">Vous savez toujours quelle est la prochaine étape.</h2>
            <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">Choisissez votre profil. MATLI vous montre les informations à préparer, l&apos;action à effectuer et le résultat attendu.</p>
          </div>
          <div className="inline-grid w-full grid-cols-2 rounded-lg border border-neutral-200 bg-neutral-100 p-1 sm:w-auto" role="tablist" aria-label="Choisir un parcours">
            {(Object.keys(journeys) as JourneyKey[]).map((key) => (
              <button key={key} type="button" role="tab" aria-selected={journeyKey === key} aria-controls="journey-panel" onClick={() => selectJourney(key)} className={`min-h-11 rounded-md px-3 text-sm font-black transition sm:px-5 ${journeyKey === key ? "bg-orange-500 text-white shadow-sm" : "text-neutral-600 hover:bg-white hover:text-orange-800"}`}>
                {journeys[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-9">
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm sm:grid-cols-5" role="tablist" aria-label={journey.title}>
            {journey.steps.map(({ Icon, title }, index) => {
              const selected = activeStep === index;
              return (
                <button
                  key={title}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="journey-panel"
                  onClick={() => setActiveStep(index)}
                  className={`group relative flex min-h-[86px] min-w-0 items-center gap-3 px-3 text-left transition sm:min-h-[104px] sm:flex-col sm:items-start sm:justify-center sm:px-4 ${index === 4 ? "col-span-2 sm:col-span-1" : ""} ${index < 4 && index % 2 === 0 ? "border-r border-neutral-200" : ""} ${index < 4 ? "border-b border-neutral-200 sm:border-b-0 sm:border-r" : ""} ${selected ? "bg-orange-500 text-white" : "bg-white text-neutral-700 hover:bg-orange-50"}`}
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-md transition ${selected ? "bg-white text-orange-600" : "bg-neutral-100 text-neutral-500 group-hover:bg-white group-hover:text-orange-700"}`}><Icon size={18} aria-hidden /></span>
                  <span className="min-w-0">
                    <span className={`block text-[10px] font-black uppercase ${selected ? "text-white/80" : "text-orange-700"}`}>Étape {String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-1 block text-sm font-black leading-5">{title}</span>
                  </span>
                  {selected ? <span className="absolute inset-x-0 bottom-0 h-1 bg-white/90" aria-hidden /> : null}
                </button>
              );
            })}
          </div>

          <article id="journey-panel" role="tabpanel" aria-live="polite" key={`${journeyKey}-${activeStep}`} className="mt-4 animate-panel-in overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-xl shadow-neutral-950/5 sm:mt-5">
            <div className="h-1 bg-neutral-100" aria-hidden>
              <span className="block h-full bg-orange-500 transition-all duration-300" style={{ width: `${((activeStep + 1) / journey.steps.length) * 100}%` }} />
            </div>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border-b border-neutral-200 bg-white p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-black uppercase text-orange-700">{journey.label} · Étape {activeStep + 1} sur {journey.steps.length}</p>
                    <h3 className="mt-2 text-2xl font-black text-neutral-950 sm:text-3xl">{step.title}</h3>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-700 sm:size-14"><StepIcon size={24} aria-hidden /></span>
                </div>
                <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">{step.description}</p>
              </div>
              <div className="p-5 sm:p-8">
                <p className="text-xs font-black uppercase text-neutral-500">À préparer</p>
                <ul className="mt-4 grid gap-3">
                    {step.checklist.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-neutral-700">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check size={14} strokeWidth={3} aria-hidden /></span>
                        {item}
                      </li>
                    ))}
                </ul>
                <div className="mt-6 border-l-4 border-orange-500 bg-white p-4">
                  <p className="text-[10px] font-black uppercase text-orange-700">Résultat attendu</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-neutral-800">{step.result}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 bg-white p-4 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold text-neutral-500">Étape {activeStep + 1} sur {journey.steps.length}</p>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={activeStep === 0} onClick={() => setActiveStep((value) => value - 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-black text-neutral-700 transition hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-40">
                    <ChevronLeft size={17} aria-hidden /><span className="hidden sm:inline">Précédente</span>
                  </button>
                  {activeStep < journey.steps.length - 1 ? (
                    <button type="button" onClick={() => setActiveStep((value) => value + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600">Étape suivante <ChevronRight size={17} aria-hidden /></button>
                  ) : (
                    <ButtonLink href={journeyKey === "renter" ? "/rentals" : "/register"} className="bg-orange-500 text-white hover:bg-orange-600">
                      {journeyKey === "renter" ? "Voir les machines" : "Créer mon compte"} <ChevronRight size={17} aria-hidden />
                    </ButtonLink>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
