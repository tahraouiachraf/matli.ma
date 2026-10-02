import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
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

const heroActions = [
  { label: "Je veux louer", href: "/rentals" },
  { label: "Je veux déposer", href: "/register" },
];

const popularSearches = [
  { label: "JCB 3CX", href: "/rentals?brand=JCB&model=3CX" },
  { label: "Mini-pelle", href: "/rentals?category=mini-pelles" },
  { label: "Telescopic", href: "/rentals?category=chariots-telescopiques" },
  { label: "Chargeuse", href: "/rentals?category=chargeuses-sur-pneumatiques" },
];

export const metadata: Metadata = {
  title: "Location de matériel BTP au Maroc",
  description: "Louez du matériel BTP au Maroc sur MATLI.ma: JCB 3CX, mini-pelles, chariots télescopiques et chargeuses disponibles auprès de propriétaires locaux.",
  keywords: [
    "location matériel BTP Maroc",
    "matériel BTP",
    "JCB 3CX Maroc",
    "location mini pelle",
    "location telescopic",
    "location chargeuse",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Location de matériel BTP au Maroc | MATLI.ma",
    description: "Comparez les prix et disponibilités des JCB 3CX, mini-pelles, télescopiques et chargeuses au Maroc.",
    url: "/",
    type: "website",
    images: ["/matli-social-preview.webp"],
  },
};

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
                MATLI est la marketplace marocaine de location de matériel BTP. Trouvez un JCB 3CX, une mini-pelle, un télescopique ou une chargeuse, comparez les prix et envoyez une demande claire au propriétaire.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
                {heroActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/40 bg-white/10 px-3 text-center text-sm font-black text-white backdrop-blur hover:bg-white/20 sm:justify-start sm:gap-3 sm:px-4"
                  >
                    <span className="size-5 rounded border-2 border-white/70 bg-white/10" />
                    {action.label}
                  </Link>
                ))}
              </div>

              <form action="/rentals" className="mt-6 grid min-w-0 gap-3 rounded-md bg-white p-3 shadow-xl shadow-orange-950/20 md:grid-cols-[1fr_0.8fr_auto]">
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

              <div className="mt-5 grid min-w-0 gap-2.5 rounded-md border border-white/20 bg-white/10 p-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center lg:grid-cols-1 xl:grid-cols-[auto_minmax(0,1fr)]">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-white sm:normal-case sm:tracking-normal">Populaires :</span>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {popularSearches.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-md border border-white/25 bg-white/15 px-2 py-1.5 text-center text-xs font-black leading-4 text-white transition hover:border-white hover:bg-white hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[420px] lg:block">
              <div className="absolute right-0 top-8 h-80 w-[92%] rounded-xl bg-white/10" />
              <HeroMachineAnimation />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white" aria-labelledby="marketplace-trust-title">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div className="max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-700">Pensée pour le terrain</p>
              <h2 id="marketplace-trust-title" className="mt-3 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">
                Les bonnes informations, avant le premier appel.
              </h2>
            </div>
            <div className="flex flex-col items-start justify-between gap-5 border-l-2 border-orange-500 pl-5 sm:flex-row sm:items-end sm:pl-6">
              <p className="max-w-2xl text-base leading-7 text-neutral-600">
                MATLI rend chaque offre plus simple à comprendre et chaque demande plus facile à traiter, pour les clients comme pour les propriétaires.
              </p>
              <Link href="/how-it-works" className="inline-flex shrink-0 items-center gap-2 text-sm font-black text-orange-700 transition hover:text-orange-800">
                Voir le fonctionnement <ArrowUpRight size={17} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 md:grid-cols-2">
            {trustItems.map(([Icon, title, text], index) => (
              <article key={title} className="group bg-white p-5 transition-colors hover:bg-orange-50/40 sm:p-7 lg:p-8">
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-700 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                    <Icon size={22} strokeWidth={2.2} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-orange-700">Avantage {String(index + 1).padStart(2, "0")}</p>
                      <span className="h-px min-w-8 flex-1 bg-neutral-200" aria-hidden />
                    </div>
                    <h3 className="mt-3 text-lg font-black text-neutral-950 sm:text-xl">{title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
            <ButtonLink href="/rentals" variant="secondary">
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

      <section id="proprietaires" className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-8">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-orange-700">
              <Building2 size={18} aria-hidden />
              Pour les propriétaires
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Votre parc visible. Vos locations mieux pilotées.
            </h2>
            <p className="mt-5 text-base leading-7 text-neutral-600 sm:text-lg">
              Publiez vos machines, recevez des demandes qualifiées et suivez chaque réservation depuis un espace pensé pour les professionnels du BTP au Maroc.
            </p>

            <ul className="mt-7 grid gap-3 text-sm font-bold text-neutral-800 sm:grid-cols-2">
              {[
                "Annonces structurées et visibles",
                "Demandes centralisées",
                "Planning des disponibilités",
                "Maintenance et activité suivies",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-700">
                    <BadgeCheck size={16} aria-hidden />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ButtonLink href="/dashboard">
                Accéder à mon espace
                <ArrowRight size={18} aria-hidden />
              </ButtonLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl shadow-orange-950/10">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-orange-500 text-white">
                  <BarChart3 size={21} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-black text-neutral-950">Vue d’ensemble du parc</h3>
                  <p className="truncate text-xs font-medium text-neutral-500">Activité propriétaire centralisée</p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <span className="size-2 rounded-full bg-emerald-500" />
                À jour
              </span>
            </div>

            <div className="grid grid-cols-2 border-b border-neutral-200 sm:grid-cols-4">
              {[
                ["Machines en ligne", String(equipment.length || 0), "visibles"],
                ["Demandes reçues", String(requests.length || 0), "à traiter"],
                ["Planning", "Centralisé", "dates maîtrisées"],
                ["Activité", "Suivie", "parc et revenus"],
              ].map(([label, value, helper], index) => (
                <div
                  key={label}
                  className={`min-w-0 px-4 py-5 sm:px-5 ${index % 2 ? "border-l border-neutral-200" : ""} ${index > 1 ? "border-t border-neutral-200 sm:border-t-0" : ""} ${index > 0 ? "sm:border-l sm:border-neutral-200" : ""}`}
                >
                  <p className="text-xs font-bold text-neutral-500">{label}</p>
                  <p className={`mt-2 font-black text-neutral-950 ${value.length > 4 ? "text-lg" : "text-3xl"}`}>{value}</p>
                  <p className="mt-1 text-xs font-semibold text-orange-700">{helper}</p>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-neutral-950">Du dépôt à la location</p>
                  <p className="mt-1 text-xs font-medium text-neutral-500">Un parcours clair pour chaque machine</p>
                </div>
                <CalendarDays className="text-orange-500" size={22} aria-hidden />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  [Wrench, "Publier", "Ajoutez les informations utiles"],
                  [ClipboardCheck, "Recevoir", "Centralisez les demandes"],
                  [CalendarCheck, "Planifier", "Bloquez les dates confirmées"],
                ].map(([Icon, label, helper]) => {
                  const StepIcon = Icon as LucideIcon;

                  return (
                    <div key={label as string} className="group rounded-lg border border-neutral-200 p-4 transition hover:border-orange-200 hover:bg-orange-50/60">
                      <StepIcon className="text-orange-500" size={20} aria-hidden />
                      <p className="mt-4 font-black text-neutral-950">{label as string}</p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">{helper as string}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksSection />
    </>
  );
}
