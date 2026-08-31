"use client";

import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  FileText,
  FolderKanban,
  HardHat,
  LayoutDashboard,
  Settings,
  UsersRound,
  WalletCards,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDh } from "@/lib/format";
import { categories, cities, statusLabels } from "@/lib/data";
import { OwnerPreview } from "@/components/dashboard/OwnerPreview";
import { DepositMachineForm } from "@/components/forms/DepositMachineForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { getMarketplaceRequestsStrict, getWorkspaceCollectionStrict, getWorkspaceEquipmentStrict, getWorkspaceReservationsStrict } from "@/services/api/matli";
import type { ClientRequest, Equipment, RentalHistoryItem } from "@/types";

export const ownerMenu: Array<[string, string, LucideIcon]> = [
  ["Tableau de bord", "/espace", LayoutDashboard],
  ["Mon matériel", "/espace/materiel", HardHat],
  ["Locations", "/espace/locations", FolderKanban],
  ["Demandes", "/espace/demandes", Bell],
  ["Calendrier", "/espace/calendrier", CalendarDays],
  ["Maintenance", "/espace/maintenance", Wrench],
  ["Clients", "/espace/clients", UsersRound],
  ["Opérateurs", "/espace/operateurs", HardHat],
  ["Finances", "/espace/finances", WalletCards],
  ["Documents", "/espace/documents", FileText],
  ["Équipe", "/espace/equipe", UsersRound],
  ["Statistiques", "/espace/statistiques", ChartNoAxesCombined],
  ["Notifications", "/espace/notifications", Bell],
  ["Paramètres", "/espace/parametres", Settings],
];

type OwnerWorkspaceProps = {
  activeHref: string;
  children: React.ReactNode;
};

export function OwnerWorkspace({ activeHref, children }: OwnerWorkspaceProps) {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-[72px_minmax(0,1fr)] gap-3 px-3 py-5 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-5 sm:px-5 sm:py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-10">
      <aside className="sticky top-20 h-[calc(100dvh-6rem)] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm sm:p-3 lg:top-24">
        <div className="mb-2 hidden px-3 py-2 sm:block">
          <h1 className="text-lg font-black text-neutral-950">Espace propriétaire</h1>
          <p className="mt-1 text-xs font-semibold text-neutral-500">Gestion du parc</p>
        </div>
        <div className="mb-2 grid place-items-center rounded-xl bg-orange-50 py-3 sm:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 font-black text-white">M</span>
        </div>
        <nav className="grid max-h-[calc(100dvh-10rem)] gap-1 overflow-y-auto pr-0.5" aria-label="Menu espace propriétaire">
          {ownerMenu.map(([label, href, Icon]) => (
            <Link
              key={href}
              title={label}
              aria-label={label}
              className={`flex h-11 items-center justify-center gap-3 rounded-xl px-2 text-sm font-semibold transition sm:justify-start sm:px-3 ${
                href === activeHref
                  ? "bg-orange-50 text-orange-700 shadow-sm shadow-orange-950/5"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
              href={href}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="hidden min-w-0 truncate sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 overflow-hidden">{children}</div>
    </section>
  );
}

export function DashboardHome() {
  return (
    <>
      <h2 className="text-2xl font-black text-neutral-950 sm:text-3xl">Tableau de bord</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
        Vue de pilotage pour comprendre immédiatement l&apos;état du parc, les retards, les paiements et la maintenance.
      </p>
      <div className="mt-5 sm:mt-8">
        <OwnerPreview />
      </div>
    </>
  );
}

export function OwnerSectionContent({ section }: { section: string }) {
  const { token } = useAuth();
  const [workspaceEquipment, setWorkspaceEquipment] = useState<Equipment[] | null>(null);
  const [workspaceRentals, setWorkspaceRentals] = useState<RentalHistoryItem[] | null>(null);
  const [marketplaceRequests, setMarketplaceRequests] = useState<ClientRequest[] | null>(null);
  const [workspaceItems, setWorkspaceItems] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setApiError(null);
    setWorkspaceItems(null);

    async function loadSection() {
      try {
        if (section === "materiel") {
          const payload = await getWorkspaceEquipmentStrict(token);
          if (mounted) setWorkspaceEquipment(payload);
        } else if (section === "locations") {
          const [equipmentPayload, rentalsPayload] = await Promise.all([
            getWorkspaceEquipmentStrict(token),
            getWorkspaceReservationsStrict(token),
          ]);
          if (mounted) {
            setWorkspaceEquipment(equipmentPayload);
            setWorkspaceRentals(rentalsPayload);
          }
        } else if (section === "calendrier") {
          const [equipmentPayload, rentalsPayload] = await Promise.all([
            getWorkspaceEquipmentStrict(token),
            getWorkspaceReservationsStrict(token),
          ]);
          if (mounted) {
            setWorkspaceEquipment(equipmentPayload);
            setWorkspaceRentals(rentalsPayload);
          }
        } else if (section === "demandes") {
          const payload = await getMarketplaceRequestsStrict();
          if (mounted) setMarketplaceRequests(payload);
        } else {
          const endpointBySection: Record<string, string> = {
            maintenance: "maintenance",
            operateurs: "operators",
            finances: "finances",
            documents: "documents",
            notifications: "notifications",
          };
          const endpoint = endpointBySection[section];
          const payload = endpoint ? await getWorkspaceCollectionStrict<Record<string, unknown>>(endpoint, token) : [];
          if (mounted) setWorkspaceItems(payload);
        }
      } catch {
        if (mounted) setApiError("Merci de réessayer plus tard");
      }

      if (mounted) setLoading(false);
    }

    loadSection();

    return () => {
      mounted = false;
    };
  }, [section, token]);

  if (section === "materiel") {
    const items = workspaceEquipment ?? [];

    return (
      <DashboardPanel
        title="Mon matériel"
        description="Ajoutez vos machines, gardez vos prix à jour et suivez la disponibilité de chaque matériel."
        loading={loading}
        actionLabel="Ajouter un matériel"
      >
        {apiError ? <InlineApiError /> : null}
        <div className="mb-6">
          <OwnerFormBlock title="Ajouter un matériel" description="Préparez l'annonce avec les informations nécessaires avant la connexion complète au backend.">
            <DepositMachineForm />
          </OwnerFormBlock>
        </div>
        {!apiError && items.length ? (
          <div className="grid gap-4">
            {items.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 md:grid-cols-[140px_1fr_auto] md:items-center">
              <div className="h-28 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
              <div>
                <h3 className="text-lg font-black sm:text-xl">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {item.category} · {item.city} · {item.brand} {item.model}
                </p>
                <p className="mt-2 text-sm font-bold text-orange-600">{formatDh(item.priceDay)} / jour</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{statusLabels[item.status]}</span>
                  {item.operator ? <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">Avec opérateur</span> : null}
                  {item.delivery ? <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">Livraison</span> : null}
                </div>
              </div>
              <div className="grid gap-2 sm:flex md:grid">
                <button className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-black text-white">Modifier</button>
                <button className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-bold">Disponibilité</button>
              </div>
            </div>
            ))}
          </div>
        ) : !apiError ? (
          <EmptyApiState loading={loading} label="Aucune machine trouvée dans votre compte." />
        ) : null}
      </DashboardPanel>
    );
  }

  if (section === "locations") {
    const rows = (workspaceRentals ?? []).map((rental) => [
      rental.id,
      rental.equipmentTitle,
      rental.period,
      rental.city,
      formatDh(rental.total),
      rental.status,
    ]);

    return (
      <DashboardPanel title="Locations" description="Créez une réservation et suivez les locations en cours, terminées ou annulées." loading={loading} actionLabel="Nouvelle réservation">
        {apiError ? <InlineApiError /> : null}
        <div className="mb-6">
          <OwnerFormBlock title="Ajouter une réservation" description="Enregistrez une location pour bloquer les dates dans le calendrier.">
            <ReservationForm equipment={workspaceEquipment ?? []} />
          </OwnerFormBlock>
        </div>
        {!apiError && rows.length ? (
          <DashboardTable headers={["Référence", "Machine", "Période", "Ville", "Montant", "Statut"]} rows={rows} />
        ) : !apiError ? (
          <EmptyApiState loading={loading} label="Aucune réservation trouvée pour le moment." />
        ) : null}
      </DashboardPanel>
    );
  }

  if (section === "demandes") {
    const rows = (marketplaceRequests ?? []).map((request) => [
      request.id,
      request.machine,
      request.city,
      request.dateRange,
      `${formatDh(request.budgetDay)} / jour`,
      request.status,
    ]);

    return (
      <DashboardPanel title="Demandes" description="Ajoutez ou qualifiez les demandes clients reçues depuis la marketplace." loading={loading} actionLabel="Nouvelle demande">
        {apiError ? <InlineApiError /> : null}
        <div className="mb-6">
          <OwnerFormBlock title="Ajouter une demande client" description="Saisissez le besoin du client pour comparer ensuite avec votre parc matériel.">
            <ClientRequestForm />
          </OwnerFormBlock>
        </div>
        {!apiError && rows.length ? (
          <DashboardTable headers={["Référence", "Machine", "Ville", "Durée", "Budget", "Statut"]} rows={rows} />
        ) : !apiError ? (
          <EmptyApiState loading={loading} label="Aucune demande client trouvée pour le moment." />
        ) : null}
      </DashboardPanel>
    );
  }

  if (section === "calendrier") {
    const items = workspaceEquipment ?? [];
    const rentals = workspaceRentals ?? [];

    return (
      <DashboardPanel
        title="Calendrier"
        description="Visualisez les machines disponibles, réservées et les périodes bloquées."
        loading={loading}
        actionLabel="Bloquer une date"
      >
        {apiError ? <InlineApiError /> : null}
        {!apiError ? <OwnerCalendar equipment={items} rentals={rentals} loading={loading} /> : null}
      </DashboardPanel>
    );
  }

  const fallbackContent: Record<string, [string, string, string[]]> = {
    maintenance: ["Maintenance", "Plans, interventions, alertes et coûts par machine.", ["Vidange JCB 3CX dans 18 h", "Contrôle hydraulique mini-pelle", "Assurance chargeuse expire bientôt"]],
    clients: ["Clients", "Fiches clients, contacts, historique, CA et incidents.", ["Entreprise VRD Casablanca", "Chantier industriel Tanger", "Promoteur Marrakech"]],
    operateurs: ["Opérateurs", "Conducteurs disponibles, permis, compétences et planning.", ["Youssef: tractopelle", "Amine: pelle sur chenilles", "Karim: telescopic"]],
    finances: ["Finances", "Paiements, cautions, dépenses, factures et rentabilité.", ["À encaisser: 18 400 DH", "Dépenses maintenance: 6 200 DH", "CA estimé: 68 400 DH"]],
    documents: ["Documents", "Cartes grises, assurances, visites techniques et factures d’achat.", ["Assurance JCB 3CX", "Visite technique chargeuse", "Facture achat mini-pelle"]],
    equipe: ["Équipe", "Gérants, employés, opérateurs et permissions.", ["Gérant: accès locations", "Employé: accès demandes", "Opérateur: accès planning"]],
    statistiques: ["Statistiques", "Utilisation, revenus, demandes, conversions et machines rentables.", ["Taux utilisation: 67%", "Machine la plus demandée: Tractopelle", "Ville forte: Casablanca"]],
    notifications: ["Notifications", "Alertes in-app, email, WhatsApp futur et rappels importants.", ["Nouvelle demande REQ-1024", "Paiement en attente", "Retour prévu demain"]],
    parametres: ["Paramètres", "Entreprise, sécurité, préférences et configuration du compte.", ["Profil entreprise", "Notifications", "Sécurité du compte"]],
  };

  const [title, description, items] = fallbackContent[section] ?? fallbackContent.parametres;
  const apiItems = workspaceItems ?? [];
  const hasApiEndpoint = ["maintenance", "operateurs", "finances", "documents", "notifications"].includes(section);

  return (
    <DashboardPanel title={title} description={description} loading={hasApiEndpoint ? loading : false}>
      {hasApiEndpoint ? (
        apiError ? (
          <InlineApiError />
        ) : apiItems.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {apiItems.slice(0, 9).map((item, index) => (
              <ApiSummaryCard key={String(item.id ?? index)} item={item} />
            ))}
          </div>
        ) : (
          <EmptyApiState loading={loading} label="Aucune information trouvée pour cette rubrique." />
        )
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="font-bold text-neutral-950">{item}</p>
              <p className="mt-2 text-sm text-neutral-600">Rubrique prête pour une prochaine synchronisation.</p>
            </div>
          ))}
        </div>
      )}
    </DashboardPanel>
  );
}

function InlineApiError() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-black text-red-700">Merci de réessayer plus tard</p>
      <p className="mt-2 text-sm leading-6 text-red-700/80">
        Nous n'arrivons pas à afficher ces données pour le moment.
      </p>
    </div>
  );
}

function DashboardPanel({
  children,
  description,
  actionLabel = "Nouvelle action",
  loading = false,
  title,
}: {
  children: React.ReactNode;
  description: string;
  actionLabel?: string;
  loading?: boolean;
  title: string;
}) {
  return (
    <div>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-black text-neutral-950 sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">{description}</p>
        </div>
        <button className="h-11 rounded-xl bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600">
          {loading ? "Chargement..." : actionLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

function OwnerFormBlock({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <details className="group rounded-2xl border border-orange-200 bg-orange-50/60 p-3 open:bg-white sm:p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span>
          <span className="block text-lg font-black text-neutral-950">{title}</span>
          <span className="mt-1 block text-sm leading-6 text-neutral-600">{description}</span>
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-500 text-xl font-black text-white transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function ReservationForm({ equipment }: { equipment: Equipment[] }) {
  return (
    <form className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">
        Machine
        <select className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option>Choisir une machine</option>
          {equipment.map((item) => (
            <option key={item.slug}>{item.title} - {item.city}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Client
        <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Nom du client ou entreprise" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date début
        <input type="date" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date fin
        <input type="date" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Prix / jour
        <input inputMode="numeric" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 1700" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Statut
        <select className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option>Confirmée</option>
          <option>En attente</option>
          <option>En cours</option>
          <option>Terminée</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Notes
        <textarea className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Adresse chantier, opérateur, conditions de livraison..." />
      </label>
      <button className="h-12 rounded-md bg-neutral-950 px-5 text-sm font-black text-white hover:bg-neutral-800 md:col-span-2">
        Enregistrer la réservation
      </button>
    </form>
  );
}

function ClientRequestForm() {
  return (
    <form className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">
        Machine demandée
        <select className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option>Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Ville
        <select className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option>Choisir une ville</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date début
        <input type="date" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date fin
        <input type="date" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Budget / jour
        <input inputMode="numeric" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 1500 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Téléphone client
        <input inputMode="tel" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="+212 6..." />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Message
        <textarea className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Besoin, chantier, urgence, livraison..." />
      </label>
      <button className="h-12 rounded-md bg-neutral-950 px-5 text-sm font-black text-white hover:bg-neutral-800 md:col-span-2">
        Enregistrer la demande
      </button>
    </form>
  );
}

function OwnerCalendar({
  equipment,
  loading,
  rentals,
}: {
  equipment: Equipment[];
  loading: boolean;
  rentals: RentalHistoryItem[];
}) {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const calendarEquipment = equipment.length ? equipment : [];
  const calendarRentals = rentals.length ? rentals : [];
  const reservedDays = new Map<number, RentalHistoryItem>();

  calendarRentals.forEach((rental, index) => {
    const start = 5 + index * 7;
    [start, start + 1, start + 2].forEach((day) => reservedDays.set(day, rental));
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-black text-neutral-950">Septembre 2026</h3>
            <p className="mt-1 text-sm text-neutral-600">Dates réservées, retours et périodes disponibles.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">Réservé</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Disponible</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-neutral-200 text-center text-xs font-black uppercase text-neutral-500">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="bg-neutral-50 px-2 py-3">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-neutral-200">
          {days.map((day) => {
            const rental = reservedDays.get(day);
            return (
              <div key={day} className={`min-h-24 bg-white p-2 text-xs sm:min-h-28 ${rental ? "bg-orange-50" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-neutral-950">{day}</span>
                  <span className={`h-2 w-2 rounded-full ${rental ? "bg-orange-500" : "bg-emerald-500"}`} />
                </div>
                {rental ? (
                  <div className="mt-2 rounded-lg bg-orange-500 px-2 py-1.5 font-bold leading-4 text-white">
                    {rental.equipmentTitle}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h3 className="font-black text-neutral-950">Machines suivies</h3>
          <div className="mt-4 grid gap-3">
            {loading ? <p className="text-sm text-neutral-500">Chargement en cours...</p> : null}
            {!loading && !calendarEquipment.length ? <p className="text-sm text-neutral-500">Aucune machine à afficher.</p> : null}
            {calendarEquipment.slice(0, 5).map((item) => (
              <div key={item.slug} className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 p-3">
                <span className="min-w-0">
                  <span className="block truncate font-bold text-neutral-950">{item.title}</span>
                  <span className="text-xs text-neutral-500">{item.city} · {statusLabels[item.status]}</span>
                </span>
                <span className="text-sm font-black text-orange-600">{formatDh(item.priceDay)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h3 className="font-black text-neutral-950">Réservations</h3>
          <div className="mt-4 grid gap-3">
            {!loading && !calendarRentals.length ? <p className="text-sm text-neutral-500">Aucune date réservée.</p> : null}
            {calendarRentals.slice(0, 4).map((rental) => (
              <div key={rental.id} className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                <p className="font-black text-neutral-950">{rental.equipmentTitle}</p>
                <p className="mt-1 text-sm text-neutral-600">{rental.period}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyApiState({ label, loading }: { label: string; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center">
      <p className="font-black text-neutral-950">{loading ? "Chargement en cours..." : label}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        {loading
          ? "Chargement des informations en cours."
          : "Ajoutez des données depuis votre espace admin ou réessayez plus tard."}
      </p>
    </div>
  );
}

function ApiSummaryCard({ item }: { item: Record<string, unknown> }) {
  const title =
    stringValue(item.title) ??
    stringValue(item.name) ??
    stringValue(item.reference) ??
    stringValue(item.type) ??
    "Information";
  const status = stringValue(item.status) ?? stringValue(item.method) ?? stringValue(item.category) ?? "Info";
  const date = stringValue(item.created_at) ?? stringValue(item.scheduled_at) ?? stringValue(item.paid_at);
  const amount = numberValue(item.amount) ?? numberValue(item.total_amount) ?? numberValue(item.cost);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-black text-neutral-950">{title}</p>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{status}</span>
      </div>
      {date ? <p className="mt-3 text-sm font-semibold text-neutral-500">{date}</p> : null}
      {amount ? <p className="mt-3 text-lg font-black text-neutral-950">{formatDh(amount)}</p> : null}
      <p className="mt-3 text-sm leading-6 text-neutral-600">Information synchronisée avec votre espace de gestion.</p>
    </div>
  );
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function DashboardTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-black">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <tr key={row.join("-")} className="text-neutral-700">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-4 font-semibold">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
