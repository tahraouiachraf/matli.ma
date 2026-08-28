"use client";

import { CircleUserRound, Home, PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-3 py-2 shadow-2xl shadow-neutral-950/20 backdrop-blur lg:hidden" aria-label="Navigation mobile rapide">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        <Link href="/" className="grid justify-items-center gap-1 rounded-md px-2 py-2 text-xs font-bold text-neutral-700">
          <Home size={20} aria-hidden />
          Accueil
        </Link>
        <Link href="/location" className="grid justify-items-center gap-1 rounded-md px-2 py-2 text-xs font-bold text-neutral-700">
          <Search size={20} aria-hidden />
          Louer
        </Link>
        <Link href="/deposer" className="grid justify-items-center gap-1 rounded-md bg-orange-500 px-2 py-2 text-xs font-black text-white">
          <PlusCircle size={20} aria-hidden />
          Déposer
        </Link>
        <Link href="/compte" className="grid justify-items-center gap-1 rounded-md px-2 py-2 text-xs font-bold text-neutral-700">
          <CircleUserRound size={20} aria-hidden />
          Compte
        </Link>
      </div>
    </nav>
  );
}
