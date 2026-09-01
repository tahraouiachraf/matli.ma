"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, ChartNoAxesCombined, CreditCard, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ownerDashboardMetrics, requestStatusLabels } from "@/lib/data";
import { formatDh } from "@/lib/format";
import { useAuth } from "@/components/providers/AuthProvider";
import { getEquipmentListStrict, getMarketplaceRequestsStrict, getWorkspaceDashboardStrict, getWorkspaceEquipmentStrict, mapWorkspaceRentals } from "@/services/api/matli";
import type { ClientRequest, Equipment } from "@/types";

const alerts: Array<[LucideIcon, string, string]> = [
  [CalendarDays, "Planning parc", "3 retours prévus cette semaine"],
  [Wrench, "Maintenance", "Vidange JCB 3CX dans 18 h moteur"],
  [CreditCard, "Paiements", "5 règlements en attente"],
  [AlertTriangle, "Alertes", "1 assurance expire dans 12 jours"],
];

export function OwnerPreview() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<Awaited<ReturnType<typeof getWorkspaceDashboardStrict>>>(null);
  const [machines, setMachines] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getWorkspaceDashboardStrict(token),
      token ? getWorkspaceEquipmentStrict(token) : getEquipmentListStrict({ perPage: 3 }),
      getMarketplaceRequestsStrict(),
    ])
      .then(([dashboardPayload, machinePayload, requestPayload]) => {
        if (!mounted) return;
        setDashboard(dashboardPayload);
        setMachines(machinePayload);
        setRequests(requestPayload);
      })
      .catch(() => {
        if (mounted) setApiError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const metrics = dashboard
    ? [
        { label: "Machines publiées", value: String(dashboard.stats.equipment), helper: `${dashboard.stats.available_equipment} disponibles` },
        { label: "Réservations", value: String(dashboard.stats.reservations), helper: `${dashboard.stats.pending_reservations} en attente` },
        { label: "Notifications", value: String(dashboard.stats.unread_notifications), helper: "non lues" },
        { label: "CA estimé", value: "Module finances", helper: "à connecter au suivi financier" },
      ]
    : ownerDashboardMetrics;

  const rentals = mapWorkspaceRentals(dashboard);

  if (loading) {
    return <OwnerPreviewSkeleton />;
  }

  if (apiError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-black text-red-700">Merci de réessayer plus tard</p>
        <p className="mt-2 text-sm leading-6 text-red-700/80">
          Nous n&apos;arrivons pas à afficher ces données pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-950/5 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-neutral-50 p-3 sm:p-4">
            <p className="text-xs font-bold uppercase text-neutral-500">{metric.label}</p>
            <p className="mt-2 break-words text-xl font-black text-neutral-950 sm:text-2xl">{metric.value}</p>
            <p className="mt-1 text-xs font-semibold text-orange-600">{metric.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-neutral-200 p-3 sm:p-4">
          <h3 className="font-black text-neutral-950">Machines publiées</h3>
          <div className="mt-4 grid gap-3">
            {machines.slice(0, 3).map((item) => (
              <div key={item.id} className="grid gap-2 rounded-xl bg-neutral-50 p-3 sm:flex sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-neutral-950">{item.title}</p>
                  <p className="text-xs text-neutral-500">
                    {item.city} · {item.companyName}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-black text-neutral-950">{formatDh(item.priceDay)}/j</p>
              </div>
            ))}
            {!machines.length ? (
              <p className="rounded-xl bg-neutral-50 p-3 text-sm font-semibold text-neutral-500">Aucune machine disponible pour le moment.</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 p-3 sm:p-4">
          <h3 className="font-black text-neutral-950">Demandes reçues</h3>
          <div className="mt-4 grid gap-3">
            {requests.slice(0, 3).map((request) => (
              <div key={request.id} className="rounded-xl bg-orange-50 p-3">
                <div className="grid gap-1 sm:flex sm:items-center sm:justify-between sm:gap-3">
                  <p className="font-bold text-neutral-950">{request.machine}</p>
                  <span className="text-xs font-black text-orange-700">{requestStatusLabels[request.status]}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-600">
                  {request.city} · budget {formatDh(request.budgetDay)}/j
                </p>
              </div>
            ))}
            {!requests.length ? (
              <p className="rounded-xl bg-orange-50 p-3 text-sm font-semibold text-orange-900">Aucune demande reçue pour le moment.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {alerts.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-3 rounded-xl border border-neutral-200 p-3 sm:p-4">
            <Icon className="mt-1 text-orange-600" size={20} aria-hidden />
            <div>
              <h3 className="font-bold text-neutral-950">{title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-neutral-950 p-4 text-white sm:p-5">
        <div className="flex items-center gap-3">
          <ChartNoAxesCombined className="text-amber-400" size={24} aria-hidden />
          <div>
            <p className="text-sm text-neutral-300">Taux d&apos;utilisation du parc</p>
            <p className="text-2xl font-black sm:text-3xl">{dashboard ? `${Math.round((dashboard.stats.reservations / Math.max(dashboard.stats.equipment, 1)) * 100)}%` : "67%"}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 p-3 sm:p-4">
        <h3 className="font-black text-neutral-950">Réservations récentes</h3>
        <div className="mt-4 grid gap-3">
          {rentals.slice(0, 3).map((rental) => (
            <div key={rental.id} className="grid gap-2 rounded-xl bg-neutral-50 p-3 sm:flex sm:items-center sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <p className="font-bold text-neutral-950">{rental.equipmentTitle}</p>
                <p className="text-xs text-neutral-500">{rental.period} · {rental.city}</p>
              </div>
              <p className="shrink-0 text-sm font-black text-neutral-950">{formatDh(rental.total)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OwnerPreviewSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-950/5 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-xl bg-neutral-100" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-72 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-72 animate-pulse rounded-xl bg-neutral-100" />
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
}
