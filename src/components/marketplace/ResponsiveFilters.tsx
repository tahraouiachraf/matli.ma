"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export function ResponsiveFilters({ children, count }: { children: React.ReactNode; count: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return (
    <>
      <div className="hidden lg:block">{children}</div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-orange-200 bg-white px-4 text-sm font-black text-orange-700 shadow-sm lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-marketplace-filters"
      >
        <SlidersHorizontal size={18} aria-hidden />
        Filtres{count ? ` (${count})` : ""}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres de recherche">
          <button type="button" aria-label="Fermer les filtres" onClick={() => setOpen(false)} className="absolute inset-0 bg-neutral-900/35 backdrop-blur-[1px]" />
          <div id="mobile-marketplace-filters" className="relative h-dvh w-[min(92vw,390px)] overflow-y-auto bg-orange-50 p-3 shadow-2xl">
            <div className="sticky top-0 z-10 mb-3 flex items-center justify-between rounded-md border border-orange-100 bg-white p-3">
              <div>
                <p className="font-black text-neutral-950">Affiner la recherche</p>
                <p className="text-xs text-neutral-500">{count ? `${count} filtre${count > 1 ? "s" : ""} actif${count > 1 ? "s" : ""}` : "Toutes les offres"}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-md border border-neutral-200" aria-label="Fermer">
                <X size={19} aria-hidden />
              </button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
