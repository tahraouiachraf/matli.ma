"use client";

import { ChevronDown, History, LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { demoAccount } from "@/lib/data";

export function AuthNav({
  compact = false,
  mobile = false,
  onNavigate,
}: {
  compact?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { connected, ready, logout: logoutFromProvider } = useAuth();
  const [open, setOpen] = useState(false);

  function logout() {
    logoutFromProvider();
    setOpen(false);
    onNavigate?.();
  }

  const accountLinks = [
    [UserRound, "Profil", "/profil"],
    [LayoutDashboard, "Dashboard", "/espace"],
    [History, "Mes locations", "/mes-locations"],
  ] as const;

  if (!ready) {
    return <div className={`${mobile ? "mt-2 h-11 w-full" : "h-11 w-28"} rounded-md bg-neutral-100`} aria-hidden />;
  }

  if (connected) {
    if (mobile) {
      return (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white px-3 py-3 text-left text-sm font-black text-neutral-900 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            aria-expanded={open}
          >
            <span>Profil</span>
            <ChevronDown
              size={17}
              className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>

          {open ? (
            <div className="mt-2 grid gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-2">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-500 text-sm font-black text-white">
                  {demoAccount.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0">
                <p className="truncate text-sm font-black text-neutral-950">{demoAccount.name}</p>
                <p className="truncate text-xs text-neutral-500">{demoAccount.email}</p>
                </div>
              </div>
              {accountLinks.map(([Icon, label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-neutral-700 hover:bg-white"
                >
                  <Icon size={17} aria-hidden />
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-black text-red-600 hover:bg-white"
              >
                <LogOut size={17} aria-hidden />
                Déconnexion
              </button>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-bold text-neutral-800 transition hover:border-orange-400 hover:text-orange-600 ${compact ? "w-full" : ""}`}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="grid size-8 place-items-center rounded-full bg-orange-500 text-xs font-black text-white">
            {demoAccount.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <ChevronDown size={16} aria-hidden />
        </button>

        {open ? (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-2xl shadow-neutral-950/15" role="menu">
            <div className="border-b border-neutral-100 p-4">
              <p className="font-black text-neutral-950">{demoAccount.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{demoAccount.email}</p>
              <p className="mt-2 w-fit rounded-md bg-orange-50 px-2 py-1 text-xs font-black text-orange-700">
                {demoAccount.company}
              </p>
            </div>
            <div className="grid p-2">
              {accountLinks.map(([Icon, label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                  role="menuitem"
                >
                  <Icon size={18} className="text-orange-500" aria-hidden />
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t border-neutral-100 p-2">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-black text-red-600 hover:bg-red-50"
                role="menuitem"
              >
                <LogOut size={18} aria-hidden />
                Déconnexion
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <ButtonLink href="/connexion" variant="secondary" className={mobile ? "mt-2 w-full" : compact ? "px-3" : ""} onClick={onNavigate}>
      {compact ? "Compte" : "Se connecter"}
    </ButtonLink>
  );
}
