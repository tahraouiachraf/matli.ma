import { BadgeCheck, Building2, CalendarCheck, Search, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HeroMachineAnimation } from "@/components/hero/HeroMachineAnimation";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { ClientDemandSection } from "@/components/sections/ClientDemandSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { MachinesSection } from "@/components/sections/MachinesSection";
import { RequestsPreviewSection } from "@/components/sections/RequestsPreviewSection";
import { ValuePropositionSection } from "@/components/sections/ValuePropositionSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd, marketplaceJsonLd } from "@/lib/seo";
import { getEquipmentListStrict, getMarketplaceRequestsStrict } from "@/services/api/matli";

const trustItems: Array<[LucideIcon, string, string]> = [
  [Building2, "Propriétaires visibles", "Chaque parc peut afficher machines, ville, prix, options et contact."],
  [CalendarCheck, "Disponibilité lisible", "Le client comprend rapidement si la machine est libre, réservée ou en maintenance."],
  [ShieldCheck, "Demandes qualifiées", "Budget, durée, chantier et téléphone avant de mobiliser la machine."],
  [BadgeCheck, "Données structurées", "Machines, demandes, réservations et devis suivent une logique claire pour préparer le lancement."],
];

export const revalidate = 60;

export default async function Home() {
  const [equipment, requests] = await Promise.all([
    getEquipmentListStrict({ perPage: 6 }).catch(() => []),
    getMarketplaceRequestsStrict().catch(() => []),
  ]);

  return (
    <>
      <JsonLd data={marketplaceJsonLd()} />
      <section className="bg-neutral-100 px-3 py-5 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-7 text-white shadow-2xl shadow-orange-950/20 sm:rounded-xl sm:px-8 md:px-12 lg:py-14">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="min-w-0 animate-fade-up">
              <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
                La marketplace pour louer et déposer vos machines{" "}
                <span className="text-white underline decoration-white decoration-8 underline-offset-[-4px]">
                  BTP
                </span>{" "}
                au Maroc
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white sm:text-lg">
                Trouvez une machine disponible, comparez les prix entre propriétaires et envoyez une demande claire. Les propriétaires déposent leur matériel et reçoivent des clients qualifiés.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
                {["Je veux louer", "Je veux déposer"].map((label) => (
                  <button
                    key={label}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/40 bg-white/10 px-3 text-center text-sm font-black text-white backdrop-blur hover:bg-white/20 sm:justify-start sm:gap-3 sm:px-4"
                  >
                    <span className="size-5 rounded border-2 border-white/70 bg-white/10" />
                    {label}
                  </button>
                ))}
              </div>

              <form action="/location" className="mt-6 grid min-w-0 gap-3 rounded-md bg-white p-3 shadow-xl shadow-orange-950/20 md:grid-cols-[1fr_0.8fr_auto]">
                <label className="relative min-w-0">
                  <span className="sr-only">Machine recherchée</span>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={19} aria-hidden />
                  <input
                    name="q"
                    className="h-12 min-w-0 w-full rounded-md border border-neutral-200 pl-10 pr-3 text-sm font-medium text-neutral-900 outline-none focus:border-orange-500"
                    placeholder="JCB 3CX, mini-pelle, chargeuse..."
                  />
                </label>
                <label className="min-w-0">
                  <span className="sr-only">Ville</span>
                  <select
                    name="city"
                    defaultValue=""
                    className="h-12 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 outline-none focus:border-orange-500"
                  >
                    <option value="" disabled>
                      Ville
                    </option>
                    <option>Casablanca</option>
                    <option>Rabat</option>
                    <option>Marrakech</option>
                    <option>Tanger</option>
                  </select>
                </label>
                <button type="submit" className="inline-flex h-12 items-center justify-center rounded-md bg-orange-600 px-8 text-sm font-black text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200">
                  Rechercher
                </button>
              </form>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 text-sm sm:flex-wrap sm:items-center sm:overflow-visible">
                <span className="font-black text-white">Populaires :</span>
                {["JCB 3CX", "Mini-pelle", "Telescopic", "Chargeuse", "Pelle sur chenilles"].map((tag) => (
                  <span key={tag} className="shrink-0 rounded-full bg-white/15 px-3 py-2 font-semibold text-white sm:px-4">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[420px] lg:block">
              <div className="absolute right-0 top-8 h-80 w-[92%] rounded-xl bg-white/10" />
              <HeroMachineAnimation />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {trustItems.map(([Icon, title, text]) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-1 text-amber-700" size={22} aria-hidden />
              <div>
                <p className="font-bold text-neutral-950">{title}</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ValuePropositionSection />
      <MachinesSection />
      <ClientDemandSection />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Marketplace"
              title="Offres disponibles maintenant"
              description="Chaque annonce affiche les informations utiles avant contact: prix par jour, ville, disponibilité, opérateur, livraison, entreprise et état de la machine."
            />
            <ButtonLink href="/location" variant="secondary">
              Voir tout le matériel
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <RequestsPreviewSection requests={requests} />

      <section id="proprietaires" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Pour les propriétaires"
            title="Un site professionnel pour montrer votre parc et gagner des demandes."
            description="Ajoutez vos équipements, gérez vos locations et votre maintenance, suivez la rentabilité et augmentez votre visibilité auprès des professionnels au Maroc."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/espace">
              Voir le dashboard
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-950/5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Machines publiées", String(equipment.length || 0), "offres visibles"],
              ["Demandes clients", String(requests.length || 0), "besoins qualifiés"],
              ["Réservations", "API", "suivi propriétaire"],
              ["Finances", "MAD", "paiements et cautions"],
            ].map(([label, value, helper]) => (
              <div key={label} className="rounded-xl bg-neutral-50 p-4">
                <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
                <p className="mt-2 text-2xl font-black text-neutral-950">{value}</p>
                <p className="mt-1 text-xs font-semibold text-orange-700">{helper}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-neutral-200 p-4">
            <h3 className="font-black text-neutral-950">Pilotage propriétaire</h3>
            <div className="mt-4 grid gap-3">
              {["Matériel publié", "Demandes reçues", "Calendrier réservé"].map((label, index) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-xl bg-orange-50 p-3">
                  <span className="font-bold text-neutral-950">{label}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-orange-700">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HowItWorksSection />
    </>
  );
}
