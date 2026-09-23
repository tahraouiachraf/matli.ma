"use client";

import { CalendarDays, CheckCircle2, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDateRange, formatDh } from "@/lib/format";
import { trackCommercialEvent } from "@/lib/commercial-analytics";
import {
  createReservation,
  getEquipmentBlockedPeriods,
  type CreateReservationPayload,
  type EquipmentBlockedPeriod,
} from "@/services/api/matli";
import { ReservationDatePicker } from "@/components/forms/ReservationDatePicker";

type EquipmentReservationFormProps = {
  equipmentId?: string;
  equipmentSlug: string;
  equipmentTitle: string;
  priceDay: number;
};

type Quote = {
  payload: CreateReservationPayload;
  days: number;
  total: number;
};

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function inclusiveDays(start: string, end: string) {
  return Math.floor((parseDate(end).getTime() - parseDate(start).getTime()) / 86_400_000) + 1;
}

function overlapsBlockedPeriod(start: string, end: string, periods: EquipmentBlockedPeriod[]) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  return periods.some((period) => startDate <= parseDate(period.dateEnd) && endDate >= parseDate(period.dateStart));
}

export function EquipmentReservationForm({ equipmentId, equipmentSlug, equipmentTitle, priceDay }: EquipmentReservationFormProps) {
  const { connected, token, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [blockedPeriods, setBlockedPeriods] = useState<EquipmentBlockedPeriod[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  useEffect(() => {
    let mounted = true;
    getEquipmentBlockedPeriods(equipmentSlug)
      .then((periods) => {
        if (mounted) setBlockedPeriods(periods);
      })
      .catch(() => {
        if (mounted) setError("Les disponibilités n’ont pas pu être vérifiées. Merci de réessayer.");
      })
      .finally(() => {
        if (mounted) setLoadingAvailability(false);
      });

    return () => {
      mounted = false;
    };
  }, [equipmentSlug]);

  function prepareQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!equipmentId) {
      setError("Merci de réessayer plus tard.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload: CreateReservationPayload = {
      equipment_id: equipmentId,
      date_start: String(formData.get("date_start") ?? ""),
      date_end: String(formData.get("date_end") ?? ""),
      client_name: String(formData.get("client_name") ?? ""),
      client_phone: String(formData.get("client_phone") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };
    const days = inclusiveDays(payload.date_start, payload.date_end);

    if (!payload.date_start || !payload.date_end) {
      setError("Choisissez une date de début et une date de fin.");
      return;
    }

    if (!Number.isFinite(days) || days < 1) {
      setError("La date de fin doit être postérieure ou égale à la date de début.");
      return;
    }

    if (overlapsBlockedPeriod(payload.date_start, payload.date_end, blockedPeriods)) {
      setError("Ces dates sont déjà réservées ou indisponibles. Choisissez une autre période.");
      return;
    }

    setQuote({ payload, days, total: days * priceDay });
  }

  async function confirmReservation() {
    if (!quote) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await createReservation(quote.payload, token);
      trackCommercialEvent("reservation_requested", {
        equipmentId,
        properties: { days: quote.days, total_amount: quote.total },
      }, { persist: false });
      setMessage(`${response.message} Référence : ${response.reference}.`);
      setQuote(null);
      setDateStart("");
      setDateEnd("");
      setBlockedPeriods(await getEquipmentBlockedPeriods(equipmentSlug));
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Merci de réessayer plus tard.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!connected) {
    return (
      <div className="mt-8 rounded-xl border border-orange-200 bg-white p-4">
        <p className="font-black text-neutral-950">Connectez-vous pour réserver</p>
        <p className="mt-2 text-sm leading-6 text-neutral-600">Votre compte permet de suivre la demande, sa confirmation et son historique.</p>
        <Link href="/connexion" className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600">
          Se connecter ou créer un compte
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4">
      <form onSubmit={prepareQuote} onChange={() => setQuote(null)} className="grid gap-3 rounded-xl border border-orange-200 bg-white p-4">
        <div>
          <p className="text-sm font-black text-orange-600">Réserver ce matériel</p>
          <h2 className="mt-1 text-xl font-black text-neutral-950">{equipmentTitle}</h2>
        </div>
        {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p> : null}
        {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
        <label className="grid gap-2 text-sm font-semibold">
          Nom
          <input name="client_name" defaultValue={user?.name ?? ""} required className="h-11 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Nom ou entreprise" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Téléphone
          <input name="client_phone" defaultValue={user?.phone ?? ""} required inputMode="tel" className="h-11 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="+212 6..." />
        </label>
        <input name="date_start" type="hidden" value={dateStart} />
        <input name="date_end" type="hidden" value={dateEnd} />
        <ReservationDatePicker
          blockedPeriods={blockedPeriods}
          start={dateStart}
          end={dateEnd}
          onChange={(start, end) => {
            setDateStart(start);
            setDateEnd(end);
            setQuote(null);
            setError(null);
          }}
        />
        <label className="grid gap-2 text-sm font-semibold">
          Message
          <textarea name="notes" className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Ville du chantier, besoin opérateur, livraison..." />
        </label>
        <button disabled={loadingAvailability || !equipmentId} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-neutral-300">
          {loadingAvailability ? <Loader2 size={17} className="animate-spin" aria-hidden /> : <FileText size={17} aria-hidden />}
          {loadingAvailability ? "Vérification des dates..." : "Voir le récapitulatif"}
        </button>
      </form>

      {blockedPeriods.length ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-black text-neutral-900"><CalendarDays size={17} aria-hidden /> Périodes indisponibles</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {blockedPeriods.slice(0, 5).map((period) => (
              <span key={`${period.dateStart}-${period.dateEnd}`} className="rounded-md bg-white px-3 py-2 text-xs font-bold text-neutral-700">
                {formatDateRange(period.dateStart, period.dateEnd)}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {quote ? (
        <section aria-labelledby="quote-title" className="rounded-xl border-2 border-orange-300 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-orange-600" size={21} aria-hidden />
            <div>
              <p className="text-xs font-black uppercase text-orange-700">Devis estimatif</p>
              <h3 id="quote-title" className="mt-1 font-black text-neutral-950">Récapitulatif avant confirmation</h3>
            </div>
          </div>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-neutral-600">Période</dt><dd className="text-right font-bold">{formatDateRange(quote.payload.date_start, quote.payload.date_end)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-neutral-600">Durée</dt><dd className="font-bold">{quote.days} jour{quote.days > 1 ? "s" : ""}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-neutral-600">Tarif journalier</dt><dd className="font-bold">{formatDh(priceDay)}</dd></div>
            <div className="mt-1 flex justify-between gap-4 border-t border-orange-200 pt-3 text-base"><dt className="font-black">Total estimé</dt><dd className="font-black text-orange-700">{formatDh(quote.total)}</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-neutral-600">Le propriétaire confirmera la disponibilité et les éventuels frais de livraison ou d’opérateur.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" disabled={submitting} onClick={confirmReservation} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700 disabled:opacity-60">
              {submitting ? <Loader2 size={17} className="animate-spin" aria-hidden /> : null}
              {submitting ? "Confirmation..." : "Confirmer la demande"}
            </button>
            <button type="button" disabled={submitting} onClick={() => setQuote(null)} className="h-11 rounded-md border border-orange-200 bg-white px-4 text-sm font-bold text-neutral-700 hover:border-orange-400">
              Modifier les informations
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
