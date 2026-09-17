"use client";

import { Flag, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { reportEquipment } from "@/services/api/matli";

export function EquipmentReportForm({ equipmentId }: { equipmentId?: string }) {
  const { connected, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!connected || !equipmentId) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(null);
    try {
      const response = await reportEquipment(equipmentId!, {
        reason: String(data.get("reason")) as "duplicate" | "fraud" | "unavailable" | "inappropriate" | "other",
        details: String(data.get("details") ?? ""),
      }, token);
      setMessage(response.message);
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Le signalement n’a pas pu être envoyé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-neutral-200 pt-4">
      <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-orange-700">
        <Flag size={16} aria-hidden /> Signaler cette annonce
      </button>
      {message ? <p role="status" className="mt-3 text-sm font-semibold text-neutral-700">{message}</p> : null}
      {open ? (
        <form onSubmit={submit} className="mt-3 grid gap-3 rounded-lg bg-neutral-50 p-3">
          <label className="grid gap-1 text-sm font-bold">Motif
            <select name="reason" required className="h-10 rounded-md border border-neutral-200 bg-white px-3 font-normal">
              <option value="unavailable">Machine indisponible</option>
              <option value="duplicate">Annonce en double</option>
              <option value="fraud">Suspicion de fraude</option>
              <option value="inappropriate">Contenu inapproprié</option>
              <option value="other">Autre</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-bold">Précisions
            <textarea name="details" maxLength={2000} rows={3} className="rounded-md border border-neutral-200 bg-white p-3 font-normal" />
          </label>
          <button disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 text-sm font-black text-white disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
            Envoyer le signalement
          </button>
        </form>
      ) : null}
    </div>
  );
}
