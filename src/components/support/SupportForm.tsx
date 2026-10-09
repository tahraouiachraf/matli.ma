"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { RequiredMark } from "@/components/ui/RequiredField";
import { createSupportTicket } from "@/services/api/matli";

export function SupportForm() {
  const { token, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await createSupportTicket({
        category: String(data.get("category")) as "general" | "reservation" | "payment" | "dispute" | "refund" | "technical",
        role_context: user?.role === "owner" ? "owner" : user?.role === "client" ? "client" : "visitor",
        name: String(data.get("name")),
        email: String(data.get("email")),
        phone: String(data.get("phone") || "") || undefined,
        subject: String(data.get("subject")),
        message: String(data.get("message")),
        reservation_reference: String(data.get("reservation_reference") || "") || undefined,
      }, token);
      setReference(response.reference);
      form.reset();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Votre demande n’a pas pu être envoyée. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" role="status" aria-live="polite">
        <CheckCircle2 className="size-8 text-emerald-700" aria-hidden />
        <h2 className="mt-4 text-xl font-black text-neutral-950">Votre demande est enregistrée</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">Conservez ce numéro pour suivre vos échanges avec l’équipe MATLI.</p>
        <p className="mt-4 inline-flex rounded-lg bg-white px-4 py-3 font-black tracking-wide text-emerald-800">{reference}</p>
        <button type="button" onClick={() => setReference(null)} className="mt-5 block text-sm font-bold text-emerald-800 underline">Créer une autre demande</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 md:grid-cols-2">
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 md:col-span-2" role="alert">{error}</p> : null}
      <label className="grid gap-2 text-sm font-bold"><span>Nom complet <RequiredMark /></span><input name="name" defaultValue={user?.name ?? ""} required maxLength={120} className="h-12 rounded-lg border border-neutral-300 px-3 font-normal outline-none focus:border-orange-500" /></label>
      <label className="grid gap-2 text-sm font-bold"><span>Adresse email <RequiredMark /></span><input name="email" defaultValue={user?.email ?? ""} type="email" required className="h-12 rounded-lg border border-neutral-300 px-3 font-normal outline-none focus:border-orange-500" /></label>
      <label className="grid gap-2 text-sm font-bold"><span>Type de demande <RequiredMark /></span><select name="category" required className="h-12 rounded-lg border border-neutral-300 bg-white px-3 font-normal outline-none focus:border-orange-500"><option value="general">Question générale</option><option value="reservation">Réservation</option><option value="payment">Paiement</option><option value="dispute">Litige</option><option value="refund">Remboursement</option><option value="technical">Problème technique</option></select></label>
      <label className="grid gap-2 text-sm font-bold">Téléphone<input name="phone" inputMode="tel" placeholder="06XXXXXXXX" className="h-12 rounded-lg border border-neutral-300 px-3 font-normal outline-none focus:border-orange-500" /></label>
      <label className="grid gap-2 text-sm font-bold md:col-span-2">Référence de réservation<input name="reservation_reference" maxLength={40} placeholder="Ex: LOC-2026-..." className="h-12 rounded-lg border border-neutral-300 px-3 font-normal outline-none focus:border-orange-500" /></label>
      <label className="grid gap-2 text-sm font-bold md:col-span-2"><span>Sujet <RequiredMark /></span><input name="subject" required minLength={5} maxLength={180} className="h-12 rounded-lg border border-neutral-300 px-3 font-normal outline-none focus:border-orange-500" /></label>
      <label className="grid gap-2 text-sm font-bold md:col-span-2"><span>Votre message <RequiredMark /></span><textarea name="message" required minLength={20} maxLength={5000} rows={6} className="rounded-lg border border-neutral-300 p-3 font-normal outline-none focus:border-orange-500" placeholder="Décrivez la situation, les dates et le résultat attendu." /></label>
      <button disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-black text-neutral-950 transition hover:bg-orange-400 disabled:opacity-50 md:col-span-2 sm:justify-self-start"><Send size={17} aria-hidden />{submitting ? "Envoi en cours..." : "Envoyer ma demande"}</button>
    </form>
  );
}
