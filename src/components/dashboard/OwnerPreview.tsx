"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellRing, CalendarCheck, ChartNoAxesCombined, CirclePlus, Wrench } from "lucide-react";
import { formatDh } from "@/lib/format";
import { useAuth } from "@/components/providers/AuthProvider";
import { getWorkspaceDashboardStrict, getWorkspaceEquipmentStrict, mapWorkspaceRentals } from "@/services/api/matli";
import { ApiError } from "@/services/api/client";
import type { Equipment } from "@/types";

export function OwnerPreview() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<Awaited<ReturnType<typeof getWorkspaceDashboardStrict>>>(null);
  const [machines, setMachines] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<number | null>(null);
  const [partialError, setPartialError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  function retry() {
    setLoading(true);
    setApiError(null);
    setPartialError(false);
    setRetryKey((value) => value + 1);
  }

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      getWorkspaceDashboardStrict(token),
      getWorkspaceEquipmentStrict(token),
    ])
      .then(([dashboardResult, machineResult]) => {
        if (!mounted) return;

        if (dashboardResult.status === "rejected") {
          setApiError(dashboardResult.reason instanceof ApiError ? dashboardResult.reason.status : 0);
          return;
        }

        setDashboard(dashboardResult.value);
        setMachines(machineResult.status === "fulfilled" ? machineResult.value : []);
        setPartialError(machineResult.status === "rejected");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [retryKey, token]);

  const metrics = dashboard
    ? [
        { label: "Machines publiées", value: String(dashboard.stats.equipment), helper: `${dashboard.stats.available_equipment} disponibles` },
        { label: "Réservations", value: String(dashboard.stats.reservations), helper: `${dashboard.stats.pending_reservations} en attente` },
        { label: "Notifications", value: String(dashboard.stats.unread_notifications), helper: "non lues" },
        { label: "CA estimé", value: formatDh(dashboard.stats.estimated_revenue), helper: "réservations confirmées" },
      ]
    : [];

  const rentals = mapWorkspaceRentals(dashboard);
  const pendingRentals = rentals.filter((rental) => rental.statusKey === "pending");

  if (loading) {
    return <OwnerPreviewSkeleton />;
  }

  if (apiError !== null) {
    const reconnect = apiError === 401 || apiError === 403;
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-black text-red-700">{reconnect ? "Votre session doit être renouvelée" : "Merci de réessayer plus tard"}</p>
        <p className="mt-2 text-sm leading-6 text-red-700/80">
          {reconnect ? "Reconnectez-vous pour accéder à votre espace." : "Nous n'arrivons pas à afficher ces données pour le moment."}
        </p>
        {reconnect ? (
          <Link href="/login" className="mt-4 inline-flex h-11 items-center rounded-md bg-neutral-950 px-5 text-sm font-black text-white">Se reconnecter</Link>
        ) : (
          <button type="button" onClick={retry} className="mt-4 h-11 rounded-md bg-neutral-950 px-5 text-sm font-black text-white">Réessayer</button>
        )}
      </div>

    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-950/5 sm:p-4">
      {partialError ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          <span>Certaines informations n&apos;ont pas pu être actualisées.</span>
          <button type="button" onClick={retry} className="font-black underline underline-offset-4">Actualiser</button>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-neutral-50 p-3 sm:p-4">
            <p className="text-xs font-bold uppercase text-neutral-500">{metric.label}</p>
            <p className="mt-2 break-words text-xl font-black text-neutral-950 sm:text-2xl">{metric.value}</p>
            <p className="mt-1 text-xs font-semibold text-orange-600">{metric.helper}</p>
          </div>
        ))}
      </div>

      {dashboard?.alerts.some((alert) => alert.count > 0) ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {dashboard.alerts.filter((alert) => alert.count > 0).map((alert) => (
            <Link key={alert.key} href={alert.href} className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 hover:border-amber-400">
              <span><span className="block text-xs font-black uppercase text-amber-700">À traiter</span><span className="mt-1 block font-black text-neutral-950">{alert.label}</span></span>
              <span className="grid size-10 place-items-center rounded-full bg-white text-lg font-black text-amber-800">{alert.count}</span>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Link href="/dashboard/rentals" className="inline-flex min-h-14 items-center gap-3 rounded-xl border border-neutral-200 px-4 font-black text-neutral-800 hover:border-orange-300 hover:bg-orange-50"><CalendarCheck size={20} className="text-orange-600" />Gérer les locations</Link>
        <Link href="/dashboard/maintenance" className="inline-flex min-h-14 items-center gap-3 rounded-xl border border-neutral-200 px-4 font-black text-neutral-800 hover:border-orange-300 hover:bg-orange-50"><Wrench size={20} className="text-orange-600" />Planifier une maintenance</Link>
        <Link href="/dashboard/notifications" className="inline-flex min-h-14 items-center gap-3 rounded-xl border border-neutral-200 px-4 font-black text-neutral-800 hover:border-orange-300 hover:bg-orange-50"><BellRing size={20} className="text-orange-600" />Voir les alertes</Link>
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
              <Link href="/dashboard/equipment/new" className="flex items-center gap-2 rounded-xl bg-orange-50 p-3 text-sm font-black text-orange-800"><CirclePlus size={18} />Ajouter votre premier matériel</Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 p-3 sm:p-4">
          <h3 className="font-black text-neutral-950">Demandes à traiter</h3>
          <div className="mt-4 grid gap-3">
            {pendingRentals.slice(0, 3).map((rental) => (
              <div key={rental.id} className="rounded-xl bg-orange-50 p-3">
                <div className="grid gap-1 sm:flex sm:items-center sm:justify-between sm:gap-3">
                  <p className="font-bold text-neutral-950">{rental.equipmentTitle}</p>
                  <span className="text-xs font-black text-orange-700">En attente</span>
                </div>
                <p className="mt-1 text-xs text-neutral-600">{rental.companyName} · {rental.period}</p>
              </div>
            ))}
            {!pendingRentals.length ? (
              <p className="rounded-xl bg-orange-50 p-3 text-sm font-semibold text-orange-900">Aucune demande reçue pour le moment.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-neutral-950 p-4 text-white sm:p-5">
        <div className="flex items-center gap-3">
          <ChartNoAxesCombined className="text-amber-400" size={24} aria-hidden />
          <div>
            <p className="text-sm text-neutral-300">Taux d&apos;utilisation du parc</p>
            <p className="text-2xl font-black sm:text-3xl">{dashboard ? `${Math.round((dashboard.stats.reservations / Math.max(dashboard.stats.equipment, 1)) * 100)}%` : "0%"}</p>
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
