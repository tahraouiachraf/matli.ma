"use client";

import { CalendarDays, CircleUserRound, Home, PlusCircle, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getWorkspaceRole, isOwnerWorkspaceRole } from "@/lib/workspace-access";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { connected, user } = useAuth();
  const authPage = pathname === "/login"
    || pathname === "/connexion"
    || pathname === "/register"
    || pathname === "/forgot-password"
    || pathname === "/reset-password";
  const canDeposit = connected && isOwnerWorkspaceRole(getWorkspaceRole(user));
  const items: Array<[LucideIcon, string, string]> = [
    [Home, "Accueil", "/"],
    [Search, "Louer", "/rentals"],
    canDeposit ? [PlusCircle, "Déposer", "/list-equipment"] : [CalendarDays, "Locations", "/my-rentals"],
    [CircleUserRound, connected ? "Profil" : "Compte", connected ? "/profile" : "/login"],
  ];

  if (authPage) return null;

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-2xl shadow-neutral-950/20 backdrop-blur lg:hidden" aria-label="Navigation mobile rapide">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(([Icon, label, href]) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`grid min-h-12 justify-items-center gap-1 rounded-md px-1 py-1.5 text-[11px] font-black leading-tight transition ${
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
