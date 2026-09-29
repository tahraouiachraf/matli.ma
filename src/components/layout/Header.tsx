"use client";

import { ChevronRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthNav } from "@/components/layout/AuthNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/components/providers/AuthProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getWorkspaceRole, isAdminWorkspaceRole } from "@/lib/workspace-access";

const nav = [
  ["Accueil", "/"],
  ["Louer", "/location"],
  ["Entreprises", "/entreprises"],
  ["Déposer un matériel", "/deposer"],
  ["Comment ça marche ?", "/fonctionnement"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { connected, user } = useAuth();
  const canDeposit = connected && isAdminWorkspaceRole(getWorkspaceRole(user));
  const visibleNav = nav.filter(([, href]) => href !== "/deposer" || canDeposit);

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
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="MATLI accueil">
          <span className="text-2xl font-black tracking-normal text-orange-500">MATLI</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {visibleNav.map(([label, href]) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-bold transition ${
                  active ? "text-orange-700" : "text-neutral-700 hover:text-neutral-950"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden min-w-[210px] items-center justify-end gap-3 lg:flex">
          <ButtonLink href="/location" variant="ghost" className="px-3" aria-label="Rechercher une machine" title="Rechercher une machine">
            <Search size={18} aria-hidden />
            <span className="sr-only">Rechercher une machine</span>
          </ButtonLink>
          <NotificationBell />
          <AuthNav />
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-md border border-neutral-200 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu mobile">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside className="relative flex h-dvh w-screen flex-col bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-neutral-950/25">
            <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center" aria-label="MATLI accueil">
                <span className="text-2xl font-black tracking-normal text-orange-500">MATLI</span>
              </Link>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-md border border-neutral-200 text-neutral-700"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={21} aria-hidden />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Navigation mobile">
              <div className="grid gap-2">
                {visibleNav.map(([label, href]) => {
                  const active = isActive(href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-md border px-3 py-3 text-sm font-black transition ${
                        active
                          ? "border-orange-200 bg-orange-50 text-orange-600"
                          : "border-neutral-200 bg-white text-neutral-900 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                      }`}
                    >
                      <span>{label}</span>
                      <ChevronRight size={17} aria-hidden />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 rounded-md bg-neutral-50 p-3">
                <p className="text-xs font-black uppercase text-neutral-500">Compte</p>
                <NotificationBell mobile onNavigate={() => setOpen(false)} />
                <AuthNav mobile onNavigate={() => setOpen(false)} />
              </div>
            </nav>

            {canDeposit ? (
              <div className="border-t border-neutral-200 p-4">
                <ButtonLink href="/deposer" className="w-full" onClick={() => setOpen(false)}>
                  Déposer une machine
                </ButtonLink>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </header>
  );
}
