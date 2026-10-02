"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthNav } from "@/components/layout/AuthNav";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/components/providers/AuthProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";

const nav = [
  ["Accueil", "/"],
  ["Louer", "/rentals"],
  ["Entreprises", "/companies"],
  ["Comment ça marche ?", "/how-it-works"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { connected } = useAuth();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-2 sm:px-4 sm:pt-3">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between rounded-[22px] border border-neutral-200 bg-white px-3.5 shadow-[0_12px_32px_rgba(23,23,23,0.12)] sm:h-[72px] sm:px-5 xl:px-6">
        <BrandLogo imageClassName="sm:size-11" textClassName="text-xl sm:text-2xl" />

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7" aria-label="Navigation principale">
          {nav.map(([label, href]) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-sm font-bold transition-colors ${
                  active ? "text-[#F58220]" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                {label}
                {active ? <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 rounded-full bg-[#F58220]" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center justify-end gap-2 xl:flex">
          <NotificationBell />
          <AuthNav />
          {!connected ? (
            <ButtonLink href="/register" className="ml-1 bg-[#F58220] px-5 text-white shadow-sm hover:bg-orange-600">
              S&apos;inscrire
            </ButtonLink>
          ) : null}
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-neutral-200 text-neutral-800 transition hover:border-[#F58220] hover:bg-orange-50 hover:text-orange-600 xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu mobile">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/15 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside className="relative mx-3 mt-2 max-h-[calc(100dvh-1rem)] w-[calc(100%-1.5rem)] overflow-y-auto rounded-[24px] border border-neutral-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl shadow-neutral-950/20 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <BrandLogo onClick={() => setOpen(false)} textClassName="text-xl" />
              <button
                type="button"
                className="grid size-10 place-items-center rounded-xl border border-neutral-200 text-neutral-800 transition hover:border-[#F58220] hover:bg-orange-50 hover:text-orange-600"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={21} aria-hidden />
              </button>
            </div>

            <nav className="mt-6" aria-label="Navigation mobile">
              <div className="grid gap-1">
                {nav.map(([label, href]) => {
                  const active = isActive(href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-lg px-2.5 py-2 text-sm font-bold transition ${active ? "bg-orange-50 text-[#F58220]" : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"}`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-neutral-200 pt-4">
                <NotificationBell mobile onNavigate={() => setOpen(false)} />
                <AuthNav mobile onNavigate={() => setOpen(false)} />
              </div>
            </nav>

            {!connected ? (
              <div className="mt-3">
                <ButtonLink href="/register" className="w-full bg-[#F58220] text-white hover:bg-orange-600" onClick={() => setOpen(false)}>
                  Créer mon espace gratuit
                </ButtonLink>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </header>
  );
}
