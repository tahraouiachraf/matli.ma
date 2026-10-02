"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";
import { RequiredMark } from "@/components/ui/RequiredField";
import type { EquipmentBlockedPeriod } from "@/services/api/matli";

type ReservationDatePickerProps = {
  blockedPeriods: EquipmentBlockedPeriod[];
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
};

function parseDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function startOfToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function buildMonthDays(month: Date) {
  const offset = (month.getDay() + 6) % 7;
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array<Date | null>(offset).fill(null),
    ...Array.from({ length: dayCount }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)),
  ];
}

export function ReservationDatePicker({ blockedPeriods, start, end, onChange }: ReservationDatePickerProps) {
  const today = useMemo(() => startOfToday(), []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const days = useMemo(() => buildMonthDays(month), [month]);

  function isBlocked(day: Date) {
    return blockedPeriods.some((period) => day >= parseDate(period.dateStart) && day <= parseDate(period.dateEnd));
  }

  function rangeContainsBlockedDay(rangeStart: Date, rangeEnd: Date) {
    return blockedPeriods.some((period) => rangeStart <= parseDate(period.dateEnd) && rangeEnd >= parseDate(period.dateStart));
  }

  function selectDay(day: Date) {
    if (day < today || isBlocked(day)) return;

    const selected = dateKey(day);
    if (!start || end || day < parseDate(start)) {
      onChange(selected, "");
      return;
    }

    if (rangeContainsBlockedDay(parseDate(start), day)) return;
    onChange(start, selected);
  }

  const selectedStart = start ? parseDate(start) : null;
  const selectedEnd = end ? parseDate(end) : null;
  const firstAllowedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const previousMonthDisabled = month <= firstAllowedMonth;

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:p-4" aria-label="Choisir les dates de location">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-black text-neutral-950">
            <CalendarDays size={17} className="text-orange-600" aria-hidden /> Dates de location <RequiredMark />
          </p>
          <p className="mt-1 text-xs text-neutral-500">Choisissez le premier puis le dernier jour.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={previousMonthDisabled}
            onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            className="grid size-9 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-orange-400 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={17} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            className="grid size-9 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-orange-400"
            aria-label="Mois suivant"
          >
            <ChevronRight size={17} aria-hidden />
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-black capitalize text-neutral-900">
        {new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(month)}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-neutral-500">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} className="aspect-square" aria-hidden />;

          const blocked = isBlocked(day);
          const past = day < today;
          const unavailableAsEnd = Boolean(
            selectedStart
            && !selectedEnd
            && day >= selectedStart
            && rangeContainsBlockedDay(selectedStart, day),
          );
          const disabled = blocked || past || unavailableAsEnd;
          const isStart = selectedStart ? dateKey(day) === dateKey(selectedStart) : false;
          const isEnd = selectedEnd ? dateKey(day) === dateKey(selectedEnd) : false;
          const inRange = Boolean(selectedStart && selectedEnd && day > selectedStart && day < selectedEnd);
          const label = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(day);

          return (
            <button
              key={dateKey(day)}
              type="button"
              disabled={disabled}
              onClick={() => selectDay(day)}
              aria-label={`${label}${disabled ? ", indisponible" : isStart ? ", début sélectionné" : isEnd ? ", fin sélectionnée" : ""}`}
              title={disabled ? "Date indisponible" : "Sélectionner cette date"}
              className={`grid aspect-square min-h-9 place-items-center rounded-md text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-600 ${
                isStart || isEnd
                  ? "bg-orange-600 text-white shadow-sm"
                  : inRange
                    ? "bg-orange-100 text-orange-900"
                    : disabled
                      ? blocked || unavailableAsEnd
                        ? "cursor-not-allowed bg-rose-50 text-rose-400 line-through ring-1 ring-inset ring-rose-100"
                        : "cursor-not-allowed bg-neutral-100 text-neutral-300"
                      : "bg-emerald-50 text-emerald-900 ring-1 ring-inset ring-emerald-100 hover:bg-emerald-100"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-neutral-200 bg-white p-2.5">
          <span className="block font-semibold text-neutral-500">Début <RequiredMark /></span>
          <strong className="mt-1 block text-neutral-900">{start ? formatDate(start) : "À choisir"}</strong>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-2.5">
          <span className="block font-semibold text-neutral-500">Fin <RequiredMark /></span>
          <strong className="mt-1 block text-neutral-900">{end ? formatDate(end) : "À choisir"}</strong>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-neutral-500">
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-emerald-100 ring-1 ring-emerald-200" /> Disponible</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-orange-600" /> Sélectionnée</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-rose-100 ring-1 ring-rose-200" /> Indisponible</span>
      </div>
    </section>
  );
}
