"use client";

import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { requestPasswordReset } from "@/services/api/matli";
import { RequiredFieldsLegend, RequiredMark } from "@/components/ui/RequiredField";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      setMessage((await requestPasswordReset(email)).message);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Merci de réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">{message} Vérifiez également vos courriers indésirables.</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      <RequiredFieldsLegend />
      <label className="grid gap-2 text-sm font-black text-neutral-800">
        <span>Adresse email <RequiredMark /></span>
        <span className="flex h-12 items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-3 focus-within:border-orange-500">
          <Mail className="size-5 text-neutral-400" aria-hidden />
          <input name="email" type="email" autoComplete="email" required className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" placeholder="nom@entreprise.ma" />
        </span>
      </label>
      <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-600 text-sm font-black text-white disabled:opacity-60">
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Envoyer le lien sécurisé
      </button>
    </form>
  );
}
