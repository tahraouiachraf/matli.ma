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
import { formatDate, formatDateTime, formatDh } from "@/lib/format";
import { apiStatusLabels, categories, cities, requestStatusLabels, rentalStatusLabels, statusLabels } from "@/lib/data";
import { OwnerPreview } from "@/components/dashboard/OwnerPreview";
import { DepositMachineForm } from "@/components/forms/DepositMachineForm";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createRentalRequest,
  createReservation,
  createWorkspaceItem,
  deleteWorkspaceItem,
  getMarketplaceRequestsStrict,
  getWorkspaceCollectionStrict,
  getWorkspaceEquipmentStrict,
  getWorkspaceReservationsStrict,
  updateWorkspaceItem,
} from "@/services/api/matli";
import type { CreateRentalRequestPayload, CreateReservationPayload, WorkspaceCrudPayload } from "@/services/api/matli";
import type { ClientRequest, Equipment, RentalHistoryItem } from "@/types";

type OwnerNotification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

const notificationStorageKey = "matli-owner-notifications";

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
  ["Statistiques", "/espace/statistiques", ChartNoAxesCombined],
  ["Notifications", "/espace/notifications", Bell],
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
  const [notifications, setNotifications] = useState<OwnerNotification[]>([]);
  const [uiNotice, setUiNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

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
        } else if (section === "clients") {
          const payload = await getWorkspaceReservationsStrict(token);
          if (mounted) setWorkspaceRentals(payload);
        } else if (section === "notifications") {
          const payload = await getWorkspaceCollectionStrict<Record<string, unknown>>("notifications", token).catch(() => []);
          if (mounted) {
            setWorkspaceItems(payload);
            setNotifications(readStoredNotifications());
          }
        } else if (section === "statistiques") {
          const [equipmentPayload, rentalsPayload, requestsPayload] = await Promise.all([
            getWorkspaceEquipmentStrict(token),
            getWorkspaceReservationsStrict(token),
            getMarketplaceRequestsStrict(),
          ]);
          if (mounted) {
            setWorkspaceEquipment(equipmentPayload);
            setWorkspaceRentals(rentalsPayload);
            setMarketplaceRequests(requestsPayload);
          }
        } else {
          const endpointBySection: Record<string, string> = {
            maintenance: "maintenance",
            operateurs: "operators",
            finances: "payments",
            documents: "documents",
          };
          const endpoint = endpointBySection[section];
          const [payload, equipmentPayload, rentalsPayload] = endpoint
            ? await Promise.all([
                getWorkspaceCollectionStrict<Record<string, unknown>>(endpoint, token),
                getWorkspaceEquipmentStrict(token),
                getWorkspaceReservationsStrict(token),
              ])
            : [[], [], []];
          if (mounted) {
            setWorkspaceItems(payload);
            setWorkspaceEquipment(equipmentPayload);
            setWorkspaceRentals(rentalsPayload);
          }
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

  async function saveReservation(payload: CreateReservationPayload, machineLabel: string) {
    await createReservation(payload);
    const rentalsPayload = await getWorkspaceReservationsStrict(token);
    const notificationPayload = await getWorkspaceCollectionStrict<Record<string, unknown>>("notifications", token).catch(() => []);
    setWorkspaceRentals(rentalsPayload);
    setWorkspaceItems(notificationPayload);
    addReservationNotification(machineLabel, payload.client_name);
    setUiNotice("Réservation enregistrée. Le client et la notification sont ajoutés automatiquement.");
  }

  async function saveRentalRequest(payload: CreateRentalRequestPayload) {
    const request = await createRentalRequest(payload);
    setMarketplaceRequests((current) => [request, ...(current ?? [])]);
    setUiNotice("Demande client enregistrée avec succès.");
  }

  async function saveCrudItem(endpoint: string, payload: WorkspaceCrudPayload, id?: string) {
    if (id) {
      const item = await updateWorkspaceItem<Record<string, unknown>>(endpoint, id, payload, token);
      setWorkspaceItems((current) => (current ?? []).map((row) => String(row.id) === id ? item : row));
      setUiNotice("Modification enregistrée avec succès.");
      return;
    }

    const item = await createWorkspaceItem<Record<string, unknown>>(endpoint, payload, token);
    setWorkspaceItems((current) => [item, ...(current ?? [])]);
    setUiNotice("Élément ajouté avec succès.");
  }

  async function removeCrudItem(endpoint: string, id: string) {
    await deleteWorkspaceItem(endpoint, id, token);
    setWorkspaceItems((current) => (current ?? []).filter((row) => String(row.id) !== id));
    setUiNotice("Élément supprimé avec succès.");
  }

  function addReservationNotification(machine: string, client: string) {
    const notification: OwnerNotification = {
      id: `notif-${Date.now()}`,
      title: "Nouvelle réservation enregistrée",
      description: `${client || "Un client"} a réservé ${machine || "une machine"}. Le client sera ajouté automatiquement dans l'historique.`,
      createdAt: new Date().toISOString(),
    };
    const nextNotifications = [notification, ...readStoredNotifications()].slice(0, 20);
    localStorage.setItem(notificationStorageKey, JSON.stringify(nextNotifications));
    setNotifications(nextNotifications);
    setUiNotice("Réservation enregistrée. Une notification a été ajoutée.");
  }

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
            <DepositMachineForm onCreated={(item) => setWorkspaceEquipment((current) => [item, ...(current ?? [])])} />
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
      rentalStatusLabels[rental.status],
    ]);

    return (
      <DashboardPanel title="Locations" description="Créez une réservation et suivez les locations en cours, terminées ou annulées." loading={loading} actionLabel="Nouvelle réservation">
        {apiError ? <InlineApiError /> : null}
        <div className="mb-6">
          <OwnerFormBlock title="Ajouter une réservation" description="Enregistrez une location pour bloquer les dates dans le calendrier.">
            <ReservationForm equipment={workspaceEquipment ?? []} onSaved={saveReservation} />
          </OwnerFormBlock>
        </div>
        {uiNotice ? (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
            {uiNotice}
          </div>
        ) : null}
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
      requestStatusLabels[request.status],
    ]);

    return (
      <DashboardPanel title="Demandes" description="Ajoutez ou qualifiez les demandes clients reçues depuis la marketplace." loading={loading} actionLabel="Nouvelle demande">
        {apiError ? <InlineApiError /> : null}
        <div className="mb-6">
          <OwnerFormBlock title="Ajouter une demande client" description="Saisissez le besoin du client pour comparer ensuite avec votre parc matériel.">
            <ClientRequestForm onSaved={saveRentalRequest} />
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

  if (section === "clients") {
    const clients = (workspaceRentals ?? []).map((rental, index) => ({
      id: rental.id,
      name: rental.companyName,
      machine: rental.equipmentTitle,
      city: rental.city,
      period: rental.period,
      total: rental.total,
      status: rental.status,
      initials: rental.companyName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || `C${index + 1}`,
    }));
    const totalRevenue = clients.reduce((sum, client) => sum + client.total, 0);

    return (
      <DashboardPanel
        title="Clients"
        description="Les clients sont créés automatiquement lorsqu'une réservation est enregistrée. Cette page affiche l'historique client lié aux locations."
        actionLabel={null}
        loading={loading}
      >
        {apiError ? <InlineApiError /> : null}
        {!apiError && clients.length ? (
          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <ClientMetric label="Clients actifs" value={String(clients.length)} />
              <ClientMetric label="CA lié aux clients" value={formatDh(totalRevenue)} />
              <ClientMetric label="Source" value="Réservations" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-200 p-4">
                <h3 className="font-black text-neutral-950">Historique clients</h3>
                <p className="mt-1 text-sm text-neutral-600">Aucun client n&apos;est ajouté manuellement. Une fiche apparaît après réservation.</p>
              </div>
              <div className="divide-y divide-neutral-100">
                {clients.map((client) => (
                  <div key={client.id} className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:items-center">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-orange-500 text-sm font-black text-white">
                        {client.initials}
                      </span>
                      <div className="min-w-0">
                        <h4 className="truncate font-black text-neutral-950">{client.name}</h4>
                        <p className="mt-1 text-sm text-neutral-500">{client.city}</p>
                      </div>
                    </div>
                    <div className="grid gap-1 text-sm">
                      <p className="font-bold text-neutral-950">{client.machine}</p>
                      <p className="text-neutral-500">{client.period}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 md:block md:text-right">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-700">{rentalStatusLabels[client.status]}</span>
                      <p className="font-black text-orange-600 md:mt-2">{formatDh(client.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <h3 className="font-black text-neutral-950">Règle métier</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                Le client est créé depuis une réservation confirmée. Cela évite les doublons et garde l&apos;historique propre: machine, ville, période, montant et statut.
              </p>
            </div>
          </div>
        ) : !apiError ? (
          <EmptyApiState loading={loading} label="Aucun client trouvé pour le moment." />
        ) : null}
      </DashboardPanel>
    );
  }

  if (section === "notifications") {
    const apiNotifications = (workspaceItems ?? []).map((item, index) => ({
      id: String(item.id ?? `api-${index}`),
      title: stringValue(item.title) ?? stringValue(item.message) ?? "Notification",
      description: stringValue(item.body) ?? stringValue(item.description) ?? stringValue(item.message) ?? "Nouvelle information dans votre espace.",
      createdAt: stringValue(item.created_at) ?? new Date().toISOString(),
      source: "Compte",
    }));
    const localNotifications = notifications.map((notification) => ({ ...notification, source: "Réservation" }));
    const allNotifications = [...localNotifications, ...apiNotifications];

    return (
      <DashboardPanel
        title="Notifications"
        description="Suivez les événements importants: nouvelles réservations, demandes, paiements et alertes de disponibilité."
        actionLabel={null}
        loading={loading}
      >
        {apiError ? <InlineApiError /> : null}
        {!apiError && allNotifications.length ? (
          <div className="grid gap-5">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 p-4">
                <div>
                  <h3 className="font-black text-neutral-950">Centre de notifications</h3>
                  <p className="mt-1 text-sm text-neutral-600">Les nouvelles réservations remontent ici automatiquement.</p>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                  {allNotifications.length} notification{allNotifications.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-neutral-100">
                {allNotifications.map((notification, index) => (
                  <div key={notification.id} className="flex gap-4 p-4">
                    <span className={`mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                      index === 0 ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-700"
                    }`}>
                      <Bell className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase text-orange-600">{notification.source}</p>
                          <h4 className="mt-1 font-black text-neutral-950">{notification.title}</h4>
                        </div>
                        <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">
                          {formatDateTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : !apiError ? (
          <EmptyApiState loading={loading} label="Aucune notification pour le moment." />
        ) : null}
      </DashboardPanel>
    );
  }

  const fallbackContent: Record<string, [string, string, string[]]> = {
    maintenance: ["Maintenance", "Plans, interventions, alertes et coûts par machine.", ["Vidange JCB 3CX dans 18 h", "Contrôle hydraulique mini-pelle", "Assurance chargeuse expire bientôt"]],
    operateurs: ["Opérateurs", "Conducteurs disponibles, permis, compétences et planning.", ["Youssef: tractopelle", "Amine: pelle sur chenilles", "Karim: telescopic"]],
    finances: ["Finances", "Paiements, cautions, dépenses, factures et rentabilité.", ["À encaisser: 18 400 DH", "Dépenses maintenance: 6 200 DH", "CA estimé: 68 400 DH"]],
    documents: ["Documents", "Cartes grises, assurances, visites techniques et factures d’achat.", ["Assurance JCB 3CX", "Visite technique chargeuse", "Facture achat mini-pelle"]],
    statistiques: ["Statistiques", "Utilisation, revenus, demandes, conversions et machines rentables.", ["Taux utilisation: 67%", "Machine la plus demandée: Tractopelle", "Ville forte: Casablanca"]],
    parametres: ["Paramètres", "Entreprise, sécurité, préférences et configuration du compte.", ["Profil entreprise", "Notifications", "Sécurité du compte"]],
  };

  const [title, description, items] = fallbackContent[section] ?? fallbackContent.parametres;
  const apiItems = workspaceItems ?? [];
  const hasApiEndpoint = ["maintenance", "operateurs", "finances", "documents"].includes(section);

  if (section === "statistiques") {
    return (
      <DashboardPanel title={title} description={description} actionLabel={null}>
        <StatsCharts equipment={workspaceEquipment ?? []} rentals={workspaceRentals ?? []} requests={marketplaceRequests ?? []} />
      </DashboardPanel>
    );
  }

  return (
    <DashboardPanel title={title} description={description} loading={hasApiEndpoint ? loading : false}>
      {hasApiEndpoint ? (
        apiError ? (
          <InlineApiError />
        ) : (
          <>
            {uiNotice ? (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                {uiNotice}
              </div>
            ) : null}
            <WorkspaceCrudSection
              endpoint={crudEndpointFor(section)}
              equipment={workspaceEquipment ?? []}
              items={apiItems}
              loading={loading}
              rentals={workspaceRentals ?? []}
              section={section}
              onDelete={removeCrudItem}
              onSave={saveCrudItem}
            />
          </>
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

function crudEndpointFor(section: string) {
  const endpoints: Record<string, string> = {
    maintenance: "maintenance",
    operateurs: "operators",
    finances: "payments",
    documents: "documents",
  };

  return endpoints[section] ?? section;
}

function crudTitleFor(section: string) {
  const titles: Record<string, string> = {
    maintenance: "intervention",
    operateurs: "opérateur",
    finances: "paiement",
    documents: "document",
  };

  return titles[section] ?? "élément";
}

function WorkspaceCrudSection({
  endpoint,
  equipment,
  items,
  loading,
  rentals,
  section,
  onDelete,
  onSave,
}: {
  endpoint: string;
  equipment: Equipment[];
  items: Record<string, unknown>[];
  loading: boolean;
  rentals: RentalHistoryItem[];
  section: string;
  onDelete: (endpoint: string, id: string) => Promise<void>;
  onSave: (endpoint: string, payload: WorkspaceCrudPayload, id?: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const itemLabel = crudTitleFor(section);

  return (
    <div className="grid gap-5">
      <OwnerFormBlock
        title={editing ? `Modifier ${itemLabel}` : `Ajouter ${itemLabel}`}
        description="Les informations sont enregistrées directement dans Laravel et réaffichées dans la liste."
      >
        <WorkspaceCrudForm
          editing={editing}
          equipment={equipment}
          rentals={rentals}
          section={section}
          onCancel={() => setEditing(null)}
          onSaved={async (payload, id) => {
            await onSave(endpoint, payload, id);
            setEditing(null);
          }}
        />
      </OwnerFormBlock>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <SkeletonRows count={5} />
        </div>
      ) : items.length ? (
        <div className="grid gap-3">
          {items.map((item) => {
            const id = String(item.id ?? "");

            return (
              <div key={id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <ApiSummaryCard item={item} />
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <button onClick={() => setEditing(item)} className="h-10 rounded-lg border border-neutral-200 px-4 text-sm font-black text-neutral-800 hover:border-orange-400">
                      Modifier
                    </button>
                    <button onClick={() => setConfirmDeleteId(id)} className="h-10 rounded-lg bg-red-50 px-4 text-sm font-black text-red-700 hover:bg-red-100">
                      Supprimer
                    </button>
                  </div>
                </div>
                {confirmDeleteId === id ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-bold text-red-800">Confirmer la suppression de cet élément ?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={async () => {
                          await onDelete(endpoint, id);
                          setConfirmDeleteId(null);
                        }}
                        className="h-10 rounded-lg bg-red-600 px-4 text-sm font-black text-white hover:bg-red-700"
                      >
                        Oui, supprimer
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-black text-neutral-800">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
          <EmptyApiState loading={loading} label={`Aucun ${itemLabel} trouvé pour le moment.`} />
      )}
    </div>
  );
}

function WorkspaceCrudForm({
  editing,
  equipment,
  rentals,
  section,
  onCancel,
  onSaved,
}: {
  editing: Record<string, unknown> | null;
  equipment: Equipment[];
  rentals: RentalHistoryItem[];
  section: string;
  onCancel: () => void;
  onSaved: (payload: WorkspaceCrudPayload, id?: string) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fields = crudFieldsFor(section, equipment, rentals);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = fields.reduce<WorkspaceCrudPayload>((acc, field) => {
      const value = String(formData.get(field.name) ?? "");
      acc[field.name] = field.kind === "number" ? Number(value || 0) : value || null;
      return acc;
    }, {});

    try {
      setSubmitting(true);
      await onSaved(payload, editing ? String(editing.id) : undefined);
      event.currentTarget.reset();
    } catch {
      setError("Merci de réessayer plus tard.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:grid-cols-2">
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 md:col-span-2">{error}</p> : null}
      {fields.map((field) => (
        <label key={field.name} className={`grid gap-2 text-sm font-semibold ${field.kind === "textarea" ? "md:col-span-2" : ""}`}>
          {field.label}
          {field.kind === "select" ? (
            <select name={field.name} required={field.required} defaultValue={stringValue(editing?.[field.name]) ?? ""} className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
              <option value="">Choisir</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : field.kind === "textarea" ? (
            <textarea name={field.name} defaultValue={stringValue(editing?.[field.name]) ?? ""} className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder={field.placeholder} />
          ) : (
            <input
              name={field.name}
              type={field.kind === "date" ? "date" : "text"}
              inputMode={field.kind === "number" ? "numeric" : undefined}
              required={field.required}
              defaultValue={field.kind === "date" ? dateInputValue(editing?.[field.name]) : stringValue(editing?.[field.name]) ?? ""}
              className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500"
              placeholder={field.placeholder}
            />
          )}
        </label>
      ))}
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <button disabled={submitting} className="h-12 rounded-md bg-neutral-950 px-5 text-sm font-black text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300">
          {submitting ? "Enregistrement..." : editing ? "Enregistrer les modifications" : "Créer"}
        </button>
        {editing ? (
          <button type="button" onClick={onCancel} className="h-12 rounded-md border border-neutral-200 px-5 text-sm font-black text-neutral-800 hover:border-orange-400">
            Annuler
          </button>
        ) : (
          null
        )}
      </div>
    </form>
  );
}

type CrudField = {
  kind: "text" | "number" | "date" | "select" | "textarea";
  label: string;
  name: string;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  required?: boolean;
};

function crudFieldsFor(section: string, equipment: Equipment[], rentals: RentalHistoryItem[]): CrudField[] {
  const machineOptions = equipment
    .filter((item) => item.backendId)
    .map((item) => ({ label: `${item.title} - ${item.city}`, value: item.backendId as string }));
  const reservationOptions = rentals.map((item) => ({ label: `${item.id} - ${item.equipmentTitle}`, value: String(item.backendId ?? item.id) }));

  if (section === "maintenance") {
    return [
      { kind: "select", label: "Machine", name: "equipment_id", options: machineOptions, required: true },
      { kind: "text", label: "Titre", name: "title", placeholder: "Vidange, contrôle hydraulique...", required: true },
      { kind: "select", label: "Type", name: "type", options: labelOptions(["preventive", "corrective", "inspection"]), required: true },
      { kind: "date", label: "Date prévue", name: "scheduled_at" },
      { kind: "date", label: "Date terminée", name: "completed_at" },
      { kind: "number", label: "Coût", name: "cost", placeholder: "Ex: 1200" },
      { kind: "select", label: "Statut", name: "status", options: labelOptions(["planned", "in_progress", "completed", "cancelled"]), required: true },
      { kind: "textarea", label: "Notes", name: "notes", placeholder: "Détails de l'intervention..." },
    ];
  }

  if (section === "operateurs") {
    return [
      { kind: "text", label: "Nom", name: "name", placeholder: "Nom complet", required: true },
      { kind: "text", label: "Téléphone", name: "phone", placeholder: "+212 6..." },
      { kind: "text", label: "Permis / compétence", name: "license_type", placeholder: "Tractopelle, pelle, nacelle..." },
      { kind: "number", label: "Expérience", name: "experience_years", placeholder: "Années" },
      { kind: "select", label: "Statut", name: "status", options: labelOptions(["available", "busy", "inactive"]), required: true },
      { kind: "select", label: "Ville", name: "city", options: cities.map((city) => ({ label: city, value: city })) },
    ];
  }

  if (section === "documents") {
    return [
      { kind: "select", label: "Machine", name: "equipment_id", options: machineOptions },
      { kind: "text", label: "Titre", name: "title", placeholder: "Assurance, carte grise...", required: true },
      { kind: "select", label: "Type", name: "type", options: labelOptions(["insurance", "registration", "invoice", "technical_visit"]), required: true },
      { kind: "text", label: "Lien fichier", name: "file_path", placeholder: "/storage/documents/..." },
      { kind: "date", label: "Expiration", name: "expires_at" },
      { kind: "select", label: "Statut", name: "status", options: labelOptions(["valid", "expired", "missing"]), required: true },
    ];
  }

  return [
    { kind: "select", label: "Réservation", name: "reservation_id", options: reservationOptions, required: true },
    { kind: "number", label: "Montant", name: "amount", placeholder: "Ex: 1700", required: true },
    { kind: "select", label: "Méthode", name: "method", options: labelOptions(["cash", "transfer", "cheque", "card"]), required: true },
    { kind: "select", label: "Statut", name: "status", options: labelOptions(["pending", "paid", "failed", "cancelled"]), required: true },
    { kind: "date", label: "Date paiement", name: "paid_at" },
  ];
}

function labelOptions(values: string[]) {
  return values.map((value) => ({ label: apiStatusLabels[value] ?? value.replaceAll("_", " "), value }));
}

function dateInputValue(value: unknown) {
  const raw = stringValue(value);
  if (!raw) return "";

  return raw.slice(0, 10);
}

function StatsCharts({
  equipment,
  rentals,
  requests,
}: {
  equipment: Equipment[];
  rentals: RentalHistoryItem[];
  requests: ClientRequest[];
}) {
  const totalRevenue = rentals.reduce((sum, rental) => sum + rental.total, 0);
  const cityGroups = groupCount(equipment.map((item) => item.city));
  const categoryGroups = groupCount(equipment.map((item) => item.category));
  const maxCity = Math.max(...cityGroups.map((item) => item.count), 1);
  const maxCategory = Math.max(...categoryGroups.map((item) => item.count), 1);

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ClientMetric label="Machines" value={String(equipment.length)} />
        <ClientMetric label="Réservations" value={String(rentals.length)} />
        <ClientMetric label="Demandes" value={String(requests.length)} />
        <ClientMetric label="CA estimé" value={formatDh(totalRevenue)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Machines par ville" items={cityGroups} max={maxCity} />
        <ChartCard title="Machines par catégorie" items={categoryGroups} max={maxCategory} />
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="font-black text-neutral-950">Performance marketplace</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <MiniDonut label="Disponibilité" value={equipment.length ? Math.round((equipment.filter((item) => item.status === "AVAILABLE").length / equipment.length) * 100) : 0} />
          <MiniDonut label="Conversion" value={requests.length ? Math.min(100, Math.round((rentals.length / requests.length) * 100)) : 0} />
          <MiniDonut label="Parc actif" value={equipment.length ? Math.round((equipment.filter((item) => item.status !== "UNAVAILABLE").length / equipment.length) * 100) : 0} />
        </div>
      </div>
    </div>
  );
}

function groupCount(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 6);
}

function ChartCard({ items, max, title }: { items: Array<{ label: string; count: number }>; max: number; title: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="font-black text-neutral-950">{title}</h3>
      <div className="mt-5 grid gap-4">
        {items.length ? items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-neutral-800">{item.label}</span>
              <span className="font-black text-orange-600">{item.count}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.max(10, (item.count / max) * 100)}%` }} />
            </div>
          </div>
        )) : <p className="text-sm text-neutral-500">Aucune donnée disponible pour le moment.</p>}
      </div>
    </div>
  );
}

function MiniDonut({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-5 text-center">
      <div
        className="mx-auto grid size-24 place-items-center rounded-full"
        style={{ background: `conic-gradient(#f97316 ${value * 3.6}deg, #e5e7eb 0deg)` }}
      >
        <div className="grid size-16 place-items-center rounded-full bg-white text-lg font-black text-neutral-950">{value}%</div>
      </div>
      <p className="mt-3 text-sm font-black text-neutral-800">{label}</p>
    </div>
  );
}

function InlineApiError() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-black text-red-700">Merci de réessayer plus tard</p>
      <p className="mt-2 text-sm leading-6 text-red-700/80">
        Nous n&apos;arrivons pas à afficher ces données pour le moment.
      </p>
    </div>
  );
}

function ClientMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-neutral-950">{value}</p>
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
  actionLabel?: string | null;
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
        {actionLabel ? (
          <button disabled={loading} className="h-11 rounded-xl bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-wait disabled:bg-orange-200">
            {loading ? <span className="block h-4 w-28 animate-pulse rounded-full bg-white/70" aria-label="Chargement" /> : actionLabel}
          </button>
        ) : null}
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

function ReservationForm({
  equipment,
  onSaved,
}: {
  equipment: Equipment[];
  onSaved: (payload: CreateReservationPayload, machineLabel: string) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiEquipment = equipment.filter((item) => item.backendId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const equipmentId = String(formData.get("equipment_id") ?? "");
    const selected = apiEquipment.find((item) => item.backendId === equipmentId);
    const payload: CreateReservationPayload = {
      equipment_id: equipmentId,
      date_start: String(formData.get("date_start") ?? ""),
      date_end: String(formData.get("date_end") ?? ""),
      client_name: String(formData.get("client_name") ?? ""),
      client_phone: String(formData.get("client_phone") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      setSubmitting(true);
      await onSaved(payload, selected ? `${selected.title} - ${selected.city}` : "une machine");
      setMessage("Réservation enregistrée avec succès.");
      event.currentTarget.reset();
    } catch {
      setError("Merci de réessayer plus tard.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:grid-cols-2">
      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 md:col-span-2">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 md:col-span-2">{error}</p> : null}
      {!apiEquipment.length ? (
        <p className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm font-bold text-orange-800 md:col-span-2">
          Ajoutez d&apos;abord un matériel connecté au backend pour créer une réservation.
        </p>
      ) : null}
      <label className="grid gap-2 text-sm font-semibold">
        Machine
        <select name="equipment_id" required className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="">Choisir une machine</option>
          {apiEquipment.map((item) => (
            <option key={item.backendId} value={item.backendId}>
              {item.title} - {item.city} - {formatDh(item.priceDay)} / jour
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Client
        <input name="client_name" required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Nom du client ou entreprise" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Téléphone client
        <input name="client_phone" required inputMode="tel" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="+212 6..." />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date début
        <input name="date_start" type="date" required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date fin
        <input name="date_end" type="date" required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Notes
        <textarea name="notes" className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Adresse chantier, opérateur, conditions de livraison..." />
      </label>
      <button disabled={submitting || !apiEquipment.length} className="h-12 rounded-md bg-neutral-950 px-5 text-sm font-black text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 md:col-span-2">
        {submitting ? "Enregistrement..." : "Enregistrer la réservation"}
      </button>
    </form>
  );
}

function readStoredNotifications(): OwnerNotification[] {
  try {
    const raw = localStorage.getItem(notificationStorageKey);
    if (!raw) return [];
    const payload = JSON.parse(raw);
    return Array.isArray(payload) ? payload : [];
  } catch {
    return [];
  }
}

function ClientRequestForm({ onSaved }: { onSaved: (payload: CreateRentalRequestPayload) => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const budgetRaw = String(formData.get("budget_day") ?? "");
    const payload: CreateRentalRequestPayload = {
      machine: String(formData.get("machine") ?? ""),
      city: String(formData.get("city") ?? ""),
      date_start: String(formData.get("date_start") ?? "") || undefined,
      date_end: String(formData.get("date_end") ?? "") || undefined,
      budget_day: budgetRaw ? Number(budgetRaw) : undefined,
      client_name: String(formData.get("client_name") ?? ""),
      client_phone: String(formData.get("client_phone") ?? ""),
      client_email: String(formData.get("client_email") ?? "") || undefined,
      message: String(formData.get("message") ?? "") || undefined,
    };

    try {
      setSubmitting(true);
      await onSaved(payload);
      setMessage("Demande enregistrée avec succès.");
      event.currentTarget.reset();
    } catch {
      setError("Merci de réessayer plus tard.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 md:grid-cols-2">
      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 md:col-span-2">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 md:col-span-2">{error}</p> : null}
      <label className="grid gap-2 text-sm font-semibold">
        Machine demandée
        <select name="machine" required className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.name}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Ville
        <select name="city" required className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="">Choisir une ville</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Client
        <input name="client_name" required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Nom du client ou entreprise" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Téléphone client
        <input name="client_phone" required inputMode="tel" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="+212 6..." />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Email client
        <input name="client_email" type="email" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="client@email.com" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date début
        <input name="date_start" type="date" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Date fin
        <input name="date_end" type="date" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Budget / jour
        <input name="budget_day" inputMode="numeric" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 1500 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Message
        <textarea name="message" className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Besoin, chantier, urgence, livraison..." />
      </label>
      <button disabled={submitting} className="h-12 rounded-md bg-neutral-950 px-5 text-sm font-black text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 md:col-span-2">
        {submitting ? "Enregistrement..." : "Enregistrer la demande"}
      </button>
    </form>
  );
}

function buildMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingDays = (firstDay.getDay() + 6) % 7;
  const days: Array<Date | null> = Array.from({ length: leadingDays }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
}

function parseRentalPeriod(rental: RentalHistoryItem) {
  const matches = rental.period.match(/\d{4}-\d{2}-\d{2}/g);
  const start = parseDate(rental.dateStart ?? matches?.[0] ?? "");
  const end = parseDate(rental.dateEnd ?? matches?.[1] ?? matches?.[0] ?? "");

  if (!start || !end) return null;

  return {
    start,
    end,
  };
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
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
  const calendarEquipment = equipment.length ? equipment : [];
  const calendarRentals = rentals.length ? rentals : [];
  const availableEquipment = calendarEquipment.filter((item) => item.status === "AVAILABLE").length;
  const [monthDate, setMonthDate] = useState(() => new Date());
  const monthDays = buildMonthDays(monthDate);
  const reservationRanges = calendarRentals
    .map((rental) => ({ rental, range: parseRentalPeriod(rental) }))
    .filter((item): item is { rental: RentalHistoryItem; range: { start: Date; end: Date } } => Boolean(item.range));

  function reservationForDay(day: Date) {
    return reservationRanges.find(({ range }) => day >= range.start && day <= range.end)?.rental ?? null;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <ClientMetric label="Machines suivies" value={String(calendarEquipment.length)} />
        <ClientMetric label="Disponibles" value={String(availableEquipment)} />
        <ClientMetric label="Dates réservées" value={String(calendarRentals.length)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-neutral-950">{formatMonthTitle(monthDate)}</h3>
                <p className="mt-1 text-sm text-neutral-600">Vue mensuelle des disponibilités et périodes réservées.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                  className="grid size-10 place-items-center rounded-full border border-neutral-200 text-lg font-black text-neutral-700 hover:border-orange-400 hover:text-orange-600"
                  aria-label="Mois précédent"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setMonthDate(new Date())}
                  className="h-10 rounded-full border border-neutral-200 px-4 text-sm font-black text-neutral-700 hover:border-orange-400 hover:text-orange-600"
                >
                  Aujourd&apos;hui
                </button>
                <button
                  type="button"
                  onClick={() => setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                  className="grid size-10 place-items-center rounded-full border border-neutral-200 text-lg font-black text-neutral-700 hover:border-orange-400 hover:text-orange-600"
                  aria-label="Mois suivant"
                >
                  ›
                </button>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">Libre</span>
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Réservé</span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 42 }, (_, index) => (
                  <div key={index} className="aspect-square animate-pulse rounded-full bg-neutral-100" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 text-center text-xs font-black uppercase text-neutral-400">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                    <div key={day} className="py-3">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  {monthDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

                    const rental = reservationForDay(day);
                    const isToday = isSameDay(day, new Date());
                    const range = reservationRanges.find((item) => item.rental.id === rental?.id)?.range;
                    const isStart = range ? isSameDay(day, range.start) : false;
                    const isEnd = range ? isSameDay(day, range.end) : false;

                    return (
                      <div
                        key={dateKey(day)}
                        className={`relative flex aspect-square items-center justify-center ${
                          rental && !isStart && !isEnd ? "bg-orange-50" : ""
                        } ${rental && isStart ? "rounded-l-full bg-orange-50" : ""} ${rental && isEnd ? "rounded-r-full bg-orange-50" : ""}`}
                      >
                        <button
                          type="button"
                          title={rental ? `${rental.equipmentTitle} · ${rental.period}` : "Disponible"}
                          className={`grid size-10 place-items-center rounded-full text-sm font-black transition sm:size-12 ${
                            rental
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-950/15"
                              : isToday
                                ? "border-2 border-neutral-950 bg-white text-neutral-950"
                                : "bg-white text-neutral-800 hover:bg-neutral-100"
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-neutral-950">Machines suivies</h3>
          <div className="mt-4 grid gap-3">
            {loading ? <SkeletonRows count={5} /> : null}
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

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-neutral-950">Réservations</h3>
          <div className="mt-4 grid gap-3">
            {loading ? <SkeletonRows count={4} tone="orange" /> : null}
            {!loading && !calendarRentals.length ? <p className="text-sm text-neutral-500">Aucune date réservée.</p> : null}
            {calendarRentals.slice(0, 4).map((rental) => (
              <div key={rental.id} className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-neutral-950">{rental.equipmentTitle}</p>
                    <p className="mt-1 text-sm text-neutral-600">{rental.period}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-orange-700">{rentalStatusLabels[rental.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function EmptyApiState({ label, loading }: { label: string; loading: boolean }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <SkeletonRows count={4} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center">
      <p className="font-black text-neutral-950">{label}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Ajoutez des données depuis votre espace admin ou réessayez plus tard.
      </p>
    </div>
  );
}

function SkeletonRows({ count = 3, tone = "neutral" }: { count?: number; tone?: "neutral" | "orange" }) {
  const barClass = tone === "orange" ? "bg-orange-100" : "bg-neutral-100";

  return (
    <div className="grid gap-3" aria-label="Chargement">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-xl border border-neutral-100 bg-white p-3">
          <div className={`h-4 w-2/3 animate-pulse rounded-full ${barClass}`} />
          <div className={`mt-3 h-3 w-1/2 animate-pulse rounded-full ${barClass}`} />
        </div>
      ))}
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
  const rawStatus = stringValue(item.status) ?? stringValue(item.method) ?? stringValue(item.category) ?? "Info";
  const status = apiStatusLabels[rawStatus.toLowerCase()] ?? rawStatus;
  const createdAt = stringValue(item.created_at);
  const scheduledAt = stringValue(item.scheduled_at) ?? stringValue(item.paid_at);
  const amount = numberValue(item.amount) ?? numberValue(item.total_amount) ?? numberValue(item.cost);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-black text-neutral-950">{title}</p>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{status}</span>
      </div>
      {createdAt || scheduledAt ? (
        <p className="mt-3 text-sm font-semibold text-neutral-500">
          {createdAt ? formatDateTime(createdAt) : formatDate(scheduledAt)}
        </p>
      ) : null}
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
