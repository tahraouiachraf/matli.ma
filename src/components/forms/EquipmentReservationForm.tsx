"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { createReservation } from "@/services/api/matli";

type EquipmentReservationFormProps = {
  equipmentId?: string;
  equipmentTitle: string;
};

export function EquipmentReservationForm({ equipmentId, equipmentTitle }: EquipmentReservationFormProps) {
  const { connected, token, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!equipmentId) {
      setError("Merci de réessayer plus tard.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      setSubmitting(true);
      await createReservation({
        equipment_id: equipmentId,
        date_start: String(formData.get("date_start") ?? ""),
        date_end: String(formData.get("date_end") ?? ""),
        client_name: String(formData.get("client_name") ?? ""),
        client_phone: String(formData.get("client_phone") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      }, token);
      setMessage("Votre demande est envoyée. Le propriétaire peut maintenant vous contacter.");
      event.currentTarget.reset();
    } catch {
      setError("Merci de réessayer plus tard.");
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
    <form onSubmit={handleSubmit} className="mt-8 grid gap-3 rounded-xl border border-orange-200 bg-white p-4">
      <div>
        <p className="text-sm font-black text-orange-600">Réserver ce matériel</p>
        <h2 className="mt-1 text-xl font-black text-neutral-950">{equipmentTitle}</h2>
      </div>
      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
      <label className="grid gap-2 text-sm font-semibold">
        Nom
        <input name="client_name" defaultValue={user?.name ?? ""} required className="h-11 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Nom ou entreprise" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Téléphone
        <input name="client_phone" defaultValue={user?.phone ?? ""} required inputMode="tel" className="h-11 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="+212 6..." />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Date début
          <input name="date_start" required type="date" className="h-11 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Date fin
          <input name="date_end" required type="date" className="h-11 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Message
        <textarea name="notes" className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Ville du chantier, besoin opérateur, livraison..." />
      </label>
      <button disabled={submitting || !equipmentId} className="h-11 rounded-md bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-neutral-300">
        {submitting ? "Envoi..." : "Envoyer la demande"}
      </button>
    </form>
  );
}
