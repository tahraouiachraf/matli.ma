"use client";

import { CircleUserRound, Home, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = [
    [Home, "Accueil", "/"],
    [Search, "Louer", "/location"],
    [PlusCircle, "Déposer", "/deposer"],
    [CircleUserRound, "Profil", "/profil"],
  ] as const;

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-3 py-2 shadow-2xl shadow-neutral-950/20 backdrop-blur lg:hidden" aria-label="Navigation mobile rapide">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {items.map(([Icon, label, href]) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`grid justify-items-center gap-1 rounded-md px-2 py-2 text-xs font-black transition ${
                active ? "bg-orange-50 text-orange-600" : "text-neutral-700 hover:bg-neutral-50 hover:text-orange-600"
              }`}
            >
              <Icon size={20} aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
