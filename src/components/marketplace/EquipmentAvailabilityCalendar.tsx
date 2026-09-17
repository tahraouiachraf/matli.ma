"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Equipment } from "@/types";

type Period = NonNullable<Equipment["availabilityPeriods"]>[number];

function parseDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function EquipmentAvailabilityCalendar({ periods = [] }: { periods?: Period[] }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const days = useMemo(() => {
    const firstOffset = (month.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(firstOffset).fill(null), ...Array.from({ length: count }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1))];
  }, [month]);

  function unavailable(day: Date) {
    return periods.some((period) => day >= parseDate(period.dateStart) && day <= parseDate(period.dateEnd));
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="font-black text-neutral-950">Disponibilités</h2><p className="mt-1 text-xs text-neutral-500">Les jours orange sont déjà réservés ou indisponibles.</p></div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-10 place-items-center rounded-md border border-neutral-200" aria-label="Mois précédent"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-10 place-items-center rounded-md border border-neutral-200" aria-label="Mois suivant"><ChevronRight size={18} /></button>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-black capitalize">{new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(month)}</p>
      <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-black uppercase text-neutral-400">{["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day, index) => day ? (
          <span key={day.toISOString()} className={`grid aspect-square place-items-center rounded-md text-xs font-bold ${unavailable(day) ? "bg-orange-100 text-orange-800" : "bg-emerald-50 text-emerald-800"}`} title={unavailable(day) ? "Indisponible" : "Disponible"}>{day.getDate()}</span>
        ) : <span key={`empty-${index}`} />)}
      </div>
    </section>
  );
}
