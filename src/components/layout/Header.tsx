"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthNav } from "@/components/layout/AuthNav";
import { ButtonLink } from "@/components/ui/ButtonLink";

const nav = [
  ["Louer", "/location"],
  ["Machines", "/machines"],
  ["Déposer un matériel", "/deposer"],
  ["Comment ça marche ?", "/fonctionnement"],
  ["Guide", "/guide"],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="MATLI accueil">
          <span className="text-2xl font-black tracking-normal text-orange-500">MATLI</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-medium text-neutral-700 hover:text-neutral-950">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/location" variant="ghost" className="px-3">
            <Search size={18} aria-hidden />
          </ButtonLink>
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
        <div className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Navigation mobile">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
              >
                {label}
              </Link>
            ))}
            <AuthNav mobile onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
