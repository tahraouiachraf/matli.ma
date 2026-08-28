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
import { clientRequests, equipment, rentalHistory } from "@/lib/data";
import { formatDh } from "@/lib/format";
import { OwnerPreview } from "@/components/dashboard/OwnerPreview";

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
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-3 shadow-sm lg:sticky lg:top-24">
        <h1 className="px-3 py-2 text-lg font-black">Espace propriétaire</h1>
        <nav className="mt-2 grid gap-1" aria-label="Menu espace propriétaire">
          {ownerMenu.map(([label, href, Icon]) => (
            <Link
              key={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                href === activeHref
                  ? "bg-orange-50 text-orange-700"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
              href={href}
            >
              <Icon size={17} aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function DashboardHome() {
  return (
    <>
      <h2 className="text-3xl font-black">Tableau de bord</h2>
      <p className="mt-3 text-neutral-600">
        Vue de pilotage pour comprendre immédiatement l&apos;état du parc, les retards, les paiements et la maintenance.
      </p>
      <div className="mt-8">
        <OwnerPreview />
      </div>
    </>
  );
}

export function OwnerSectionContent({ section }: { section: string }) {
  if (section === "materiel") {
    return (
      <DashboardPanel
        title="Mon matériel"
        description="Liste des machines publiées avec prix, ville, disponibilité et actions rapides."
      >
        <div className="grid gap-4">
          {equipment.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-[140px_1fr_auto] md:items-center">
              <div className="h-28 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
              <div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {item.category} · {item.city} · {item.brand} {item.model}
                </p>
                <p className="mt-2 text-sm font-bold text-orange-600">{formatDh(item.priceDay)} / jour</p>
              </div>
              <div className="flex gap-2 md:grid">
                <button className="rounded-md bg-neutral-950 px-4 py-2 text-sm font-black text-white">Modifier</button>
                <button className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-bold">Disponibilité</button>
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>
    );
  }

  if (section === "locations") {
    return (
      <DashboardPanel title="Locations" description="Suivez les locations en cours, terminées et réservées.">
        <DashboardTable
          headers={["Référence", "Machine", "Période", "Ville", "Montant", "Statut"]}
          rows={rentalHistory.map((rental) => [
            rental.id,
            rental.equipmentTitle,
            rental.period,
            rental.city,
            formatDh(rental.total),
            rental.status,
          ])}
        />
      </DashboardPanel>
    );
  }

  if (section === "demandes") {
    return (
      <DashboardPanel title="Demandes" description="Demandes clients reçues depuis la marketplace.">
        <DashboardTable
          headers={["Référence", "Machine", "Ville", "Durée", "Budget", "Statut"]}
          rows={clientRequests.map((request) => [
            request.id,
            request.machine,
            request.city,
            request.dateRange,
            `${formatDh(request.budgetDay)} / jour`,
            request.status,
          ])}
        />
      </DashboardPanel>
    );
  }

  const fallbackContent: Record<string, [string, string, string[]]> = {
    calendrier: ["Calendrier", "Vue mensuelle des disponibilités, réservations, maintenances et retours.", ["Réservation JCB 3CX: 12-15 août", "Maintenance mini-pelle: 30 août", "Retour telescopic: 9 septembre"]],
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

  return (
    <DashboardPanel title={title} description={description}>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="font-bold text-neutral-950">{item}</p>
            <p className="mt-2 text-sm text-neutral-600">Donnée statique prête à connecter avec l’API Laravel.</p>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function DashboardPanel({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black text-neutral-950">{title}</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">{description}</p>
        </div>
        <button className="h-11 rounded-md bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600">
          Nouvelle action
        </button>
      </div>
      {children}
    </div>
  );
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
