"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

type ConfirmationModalProps = {
  busy?: boolean;
  confirmLabel?: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
};

export function ConfirmationModal({ busy = false, confirmLabel = "Confirmer", description, onCancel, onConfirm, open, title }: ConfirmationModalProps) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [busy, onCancel, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-neutral-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirmation-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600"><AlertTriangle size={21} aria-hidden /></span>
          <button type="button" onClick={onCancel} disabled={busy} className="grid size-9 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:opacity-50" aria-label="Fermer"><X size={19} aria-hidden /></button>
        </div>
        <h2 id="confirmation-title" className="mt-4 text-xl font-black text-neutral-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={busy} className="h-11 rounded-xl border border-neutral-200 px-4 text-sm font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">Annuler</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="h-11 rounded-xl bg-red-600 px-4 text-sm font-black text-white hover:bg-red-700 disabled:cursor-wait disabled:bg-red-300">{busy ? "Suppression..." : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
