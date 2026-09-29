"use client";

import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDateTime, formatDh } from "@/lib/format";
import { apiStatusLabels, rentalStatusLabels } from "@/lib/data";
import { useAuth } from "@/components/providers/AuthProvider";
import { cancelClientReservation, getClientReservationsStrict } from "@/services/api/matli";
import type { RentalHistoryItem } from "@/types";

const statusStyles: Record<RentalHistoryItem["status"], string> = {
  COMPLETED: "bg-green-50 text-green-700",
  ONGOING: "bg-orange-50 text-orange-700",
  RESERVED: "bg-blue-50 text-blue-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export function RentalHistorySection({ embedded = false }: { embedded?: boolean }) {
  const { token } = useAuth();
  const [items, setItems] = useState<RentalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRentals() {
      try {
        const payload = await getClientReservationsStrict(token);
        if (mounted) setItems(payload);
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRentals();

    return () => {
      mounted = false;
    };
  }, [token]);

  const rentals = items.length ? items : [];

  async function cancelReservation(rental: RentalHistoryItem) {
    if (!rental.backendId) return;
    setCancelling(true);
    setNotice(null);
    try {
      const response = await cancelClientReservation(rental.backendId, token);
      setItems((current) => current.map((item) => item.backendId === rental.backendId ? response.reservation : item));
      setNotice(response.message);
      setConfirmCancelId(null);
    } catch (exception) {
      setNotice(exception instanceof Error ? exception.message : "Merci de réessayer plus tard.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <section className={embedded ? "min-w-0" : "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-orange-600">Historique</p>
          <h2 className="mt-2 text-3xl font-black text-neutral-950">Mes locations et réservations</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Retrouvez vos locations, leurs statuts et l’historique de chaque réservation.
          </p>
        </div>
        <Link href="/rentals" className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-bold hover:border-orange-400">
          Louer encore
        </Link>
      </div>

      {notice ? <p className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-900">{notice}</p> : null}

      {error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-black text-red-700">Merci de réessayer plus tard</p>
          <p className="mt-2 text-sm leading-6 text-red-700/80">Nous n&apos;arrivons pas à afficher vos locations pour le moment.</p>
        </div>
      ) : loading ? (
        <div className="mt-8 grid gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100" />
          ))}
        </div>
      ) : rentals.length ? (
      <div className="mt-8 grid gap-4">
        {rentals.map((rental) => (
          <article key={rental.id} className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-[150px_1fr_auto] md:items-center">
            <div className="h-32 rounded-md bg-cover bg-center md:h-24" style={{ backgroundImage: `url(${rental.image})` }} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-neutral-950">{rental.equipmentTitle}</h3>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${statusStyles[rental.status]}`}>
                  {apiStatusLabels[rental.statusKey ?? ""] ?? rentalStatusLabels[rental.status]}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-neutral-600">
                {rental.companyName} · {rental.city}
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-neutral-500">
                <CalendarDays size={16} aria-hidden />
                {rental.period}
              </p>
            </div>
            <div className="grid gap-3 md:justify-items-end">
              <p className="text-2xl font-black text-neutral-950">{formatDh(rental.total)}</p>
              <div className="flex flex-wrap gap-2">
                {rental.backendId && ["pending", "confirmed"].includes(rental.statusKey ?? "") ? (
                  <button type="button" onClick={() => setConfirmCancelId(rental.backendId ?? null)} className="inline-flex h-10 items-center rounded-md border border-red-200 px-3 text-sm font-black text-red-700 hover:bg-red-50">
                    Annuler
                  </button>
                ) : null}
              </div>
              {confirmCancelId === rental.backendId ? (
                <div className="max-w-xs rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                  <p className="text-xs font-bold text-red-800">Confirmer l’annulation de cette réservation ?</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" disabled={cancelling} onClick={() => cancelReservation(rental)} className="rounded-md bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60">Confirmer</button>
                    <button type="button" onClick={() => setConfirmCancelId(null)} className="rounded-md bg-white px-3 py-2 text-xs font-bold text-neutral-700">Retour</button>
                  </div>
                </div>
              ) : null}
            </div>
            {rental.statusHistory?.length ? (
              <details className="border-t border-neutral-100 pt-4 md:col-span-3">
                <summary className="cursor-pointer text-sm font-black text-neutral-800">
                  Voir l’historique ({rental.statusHistory.length})
                </summary>
                <ol className="mt-4 grid gap-3 border-l-2 border-orange-100 pl-4">
                  {[...rental.statusHistory].reverse().map((history) => (
                    <li key={history.id} className="relative">
                      <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-orange-500" />
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                        <div>
                          <p className="text-sm font-black text-neutral-900">{apiStatusLabels[history.toStatus] ?? history.toStatus}</p>
                          <p className="text-xs text-neutral-500">{history.actorName}{history.note ? ` · ${history.note}` : ""}</p>
                        </div>
                        <time className="shrink-0 text-xs font-semibold text-neutral-500" dateTime={history.createdAt}>
                          {formatDateTime(history.createdAt)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}
          </article>
        ))}
      </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
          <p className="font-black text-neutral-950">Aucune location pour le moment</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">Vos réservations apparaîtront ici après validation.</p>
        </div>
      )}
    </section>
  );
}
