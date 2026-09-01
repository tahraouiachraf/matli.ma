"use client";

import { CalendarDays, FileText, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDh } from "@/lib/format";
import { rentalStatusLabels } from "@/lib/data";
import { useAuth } from "@/components/providers/AuthProvider";
import { getWorkspaceReservationsStrict } from "@/services/api/matli";
import type { RentalHistoryItem } from "@/types";

const statusStyles: Record<RentalHistoryItem["status"], string> = {
  COMPLETED: "bg-green-50 text-green-700",
  ONGOING: "bg-orange-50 text-orange-700",
  RESERVED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export function RentalHistorySection() {
  const { token } = useAuth();
  const [items, setItems] = useState<RentalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRentals() {
      try {
        const payload = await getWorkspaceReservationsStrict(token);
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-orange-600">Historique</p>
          <h2 className="mt-2 text-3xl font-black text-neutral-950">Mes locations et réservations</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Retrouvez les machines déjà louées, les réservations à venir, les factures et les actions rapides.
          </p>
        </div>
        <Link href="/location" className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-bold hover:border-orange-400">
          Louer encore
        </Link>
      </div>

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
                  {rentalStatusLabels[rental.status]}
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
                <button className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm font-bold hover:border-orange-400">
                  <FileText size={16} aria-hidden />
                  Facture
                </button>
                <button className="inline-flex h-10 items-center gap-2 rounded-md bg-orange-500 px-3 text-sm font-black text-white hover:bg-orange-600">
                  <RotateCcw size={16} aria-hidden />
                  Relouer
                </button>
              </div>
            </div>
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
