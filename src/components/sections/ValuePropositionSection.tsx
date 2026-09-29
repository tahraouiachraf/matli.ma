import { BadgeCheck, Banknote, CalendarRange, FileCheck2, MessagesSquare, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

const clientBenefits: Array<[LucideIcon, string, string]> = [
  [Banknote, "Comparer les prix réels", "Voir plusieurs offres pour la même machine et choisir le meilleur tarif par jour."],
  [CalendarRange, "Réserver plus vite", "Identifier les machines disponibles par ville, date, livraison et opérateur."],
  [MessagesSquare, "Contacter le bon propriétaire", "Envoyer une demande claire avec chantier, durée, budget et téléphone."],
];

const ownerBenefits: Array<[LucideIcon, string, string]> = [
  [BadgeCheck, "Présenter un parc crédible", "Photos, modèle, année, état, prix, ville et options visibles sur une fiche propre."],
  [FileCheck2, "Préparer la gestion", "Machines, devis, contrats, factures et maintenance déjà structurés côté interface."],
  [ShieldCheck, "Garder le contrôle", "Le propriétaire confirme les demandes et évite les locations non vérifiées."],
];

function BenefitCard({ Icon, title, text }: { Icon: LucideIcon; title: string; text: string }) {
  return (
    <article className="rounded-md border border-neutral-200 bg-white p-5">
      <div className="grid size-11 place-items-center rounded-md bg-orange-50 text-orange-600">
        <Icon size={22} aria-hidden />
      </div>
      <h3 className="mt-4 font-black text-neutral-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
    </article>
  );
}

export function ValuePropositionSection() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Pourquoi MATLI"
            title="Une marketplace claire pour louer, comparer et rentabiliser les machines BTP."
            description="Le but est simple: donner au client une vision claire des offres disponibles, et donner au propriétaire un espace professionnel pour publier son parc et recevoir des demandes qualifiées."
          />
          <div className="rounded-md border border-orange-200 bg-orange-50 p-5">
            <p className="text-sm font-black uppercase text-orange-700">Exemple de concurrence</p>
            <p className="mt-2 text-2xl font-black text-neutral-950">JCB 3CX à Casablanca</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Offre A", "1 700 DH/j", "avec opérateur"],
                ["Offre B", "1 500 DH/j", "livraison possible"],
                ["Décision client", "Comparer", "prix, ville et service"],
              ].map(([label, value, helper]) => (
                <div key={label} className="rounded-md bg-white p-3">
                  <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
                  <p className="mt-1 font-black text-neutral-950">{value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-neutral-950">Pour les clients</h3>
              <ButtonLink href="/rentals" variant="secondary" className="hidden sm:inline-flex">
                Louer
              </ButtonLink>
            </div>
            <div className="grid gap-4">
              {clientBenefits.map(([Icon, title, text]) => (
                <BenefitCard key={title} Icon={Icon} title={title} text={text} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-neutral-950">Pour les propriétaires</h3>
              <ButtonLink href="/dashboard" className="hidden sm:inline-flex">
                Mon espace
              </ButtonLink>
            </div>
            <div className="grid gap-4">
              {ownerBenefits.map(([Icon, title, text]) => (
                <BenefitCard key={title} Icon={Icon} title={title} text={text} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
