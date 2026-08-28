import { BadgeCheck, Building2, CalendarCheck, Search, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HeroMachineAnimation } from "@/components/hero/HeroMachineAnimation";
import { EquipmentCard } from "@/components/marketplace/EquipmentCard";
import { OwnerPreview } from "@/components/dashboard/OwnerPreview";
import { DepositSection } from "@/components/sections/DepositSection";
import { ClientDemandSection } from "@/components/sections/ClientDemandSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { MachinesSection } from "@/components/sections/MachinesSection";
import { RequestsPreviewSection } from "@/components/sections/RequestsPreviewSection";
import { SeoPagesSection } from "@/components/sections/SeoPagesSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { equipment } from "@/lib/data";

const trustItems: Array<[LucideIcon, string, string]> = [
  [Building2, "Entreprises vérifiées", "Parcs professionnels et propriétaires locaux."],
  [CalendarCheck, "Disponibilité claire", "Recherche par ville, date et statut."],
  [ShieldCheck, "Gestion gratuite", "Locations, maintenance, clients et paiements."],
  [BadgeCheck, "SEO Maroc", "Pages catégorie, ville, matériel et entreprise."],
];

export default function Home() {
  return (
    <>
      <section className="bg-neutral-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 px-5 py-8 text-white shadow-2xl shadow-orange-950/20 sm:px-8 md:px-12 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="animate-fade-up">
              <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                La marketplace pour louer et déposer vos machines{" "}
                <span className="text-amber-200 underline decoration-amber-200 decoration-8 underline-offset-[-4px]">
                  BTP
                </span>{" "}
                au Maroc
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-orange-50 sm:text-lg">
                Comparez les prix, réservez une machine disponible ou créez un compte pour publier votre JCB, mini-pelle ou chargeuse.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {["Je veux louer", "Je veux déposer"].map((label) => (
                  <button
                    key={label}
                    className="inline-flex h-12 items-center gap-3 rounded-md border border-white/40 bg-white/10 px-4 text-sm font-black text-white backdrop-blur hover:bg-white/20"
                  >
                    <span className="size-5 rounded border-2 border-white/70 bg-white/10" />
                    {label}
                  </button>
                ))}
              </div>

              <form className="mt-6 grid gap-3 rounded-md bg-white p-3 shadow-xl shadow-orange-950/20 md:grid-cols-[1fr_0.8fr_auto]">
                <label className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={19} aria-hidden />
                  <input
                    className="h-12 w-full rounded-md border border-neutral-200 pl-10 pr-3 text-sm font-medium text-neutral-900 outline-none focus:border-orange-500"
                    placeholder="JCB 3CX, mini-pelle, chargeuse..."
                  />
                </label>
                <select
                  defaultValue=""
                  className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 outline-none focus:border-orange-500"
                >
                  <option value="" disabled>
                    Ville
                  </option>
                  <option>Casablanca</option>
                  <option>Rabat</option>
                  <option>Marrakech</option>
                  <option>Tanger</option>
                </select>
                <ButtonLink href="/location" className="h-12 px-8">
                  Rechercher
                </ButtonLink>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-black text-orange-50">Populaires :</span>
                {["JCB 3CX", "Mini-pelle", "Telescopic", "Chargeuse", "Pelle sur chenilles"].map((tag) => (
                  <span key={tag} className="rounded-full bg-white/15 px-4 py-2 font-semibold text-white">
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
                <h3 className="font-bold text-neutral-950">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MachinesSection />
      <ClientDemandSection />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Marketplace"
              title="Offres disponibles maintenant"
              description="Plusieurs propriétaires peuvent proposer la même machine. Le client compare les prix et réserve la meilleure offre."
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

      <DepositSection />
      <RequestsPreviewSection />
      <SeoPagesSection />

      <section id="proprietaires" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Pour les propriétaires"
            title="Un site professionnel pour montrer votre parc et gagner des demandes."
            description="Ajoutez vos équipements, gérez vos locations et votre maintenance, suivez la rentabilité et augmentez votre visibilité auprès des professionnels au Maroc."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/deposer">Déposer mon matériel</ButtonLink>
            <ButtonLink href="/espace" variant="secondary">
              Voir le dashboard
            </ButtonLink>
          </div>
        </div>
        <OwnerPreview />
      </section>

      <HowItWorksSection />
    </>
  );
}
