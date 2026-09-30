"use client";

import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function AuthNav({
  compact = false,
  mobile = false,
  dark = false,
  onNavigate,
}: {
  compact?: boolean;
  mobile?: boolean;
  dark?: boolean;
  onNavigate?: () => void;
}) {
  const { connected, ready, user, logout: logoutFromProvider } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideInteraction(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideInteraction);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideInteraction);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  async function logout() {
    await logoutFromProvider();
    setOpen(false);
    onNavigate?.();
    router.push("/login");
  }

  const accountLinks = [
    [UserRound, "Profil", "/profile"],
    [LayoutDashboard, "Dashboard", "/dashboard"],
  ] as const;

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (!ready) {
    return <div className={`${mobile ? "mt-2 h-11 w-full" : "h-11 w-28"} rounded-md ${dark ? "bg-white/10" : "bg-neutral-100"}`} aria-hidden />;
  }

  if (connected) {
    if (mobile) {
      return (
        <div ref={menuRef} className="mt-2">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left text-sm font-black transition ${
              dark
                ? "border border-white/15 bg-white/5 text-white hover:border-[#F58220] hover:bg-white/10"
                : "border border-neutral-200 bg-white text-neutral-900 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            }`}
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
            <div className={`mt-2 grid gap-1 rounded-md border p-2 ${dark ? "border-white/10 bg-white/5" : "border-neutral-200 bg-neutral-50"}`}>
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-500 text-sm font-black text-white">
                  {(user?.name ?? "Compte MATLI")
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0">
                  <p className={`truncate text-sm font-black ${dark ? "text-white" : "text-neutral-950"}`}>{user?.name ?? "Compte MATLI"}</p>
                  <p className={`truncate text-xs ${dark ? "text-neutral-400" : "text-neutral-500"}`}>{user?.email ?? ""}</p>
                </div>
              </div>
              {accountLinks.map(([Icon, label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-bold transition ${
                    isActive(href)
                      ? dark ? "bg-white/10 text-[#F58220]" : "bg-white text-orange-600"
                      : dark ? "text-neutral-300 hover:bg-white/10 hover:text-white" : "text-neutral-700 hover:bg-white hover:text-orange-600"
                  }`}
                >
                  <Icon size={17} aria-hidden />
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={logout}
                className={`flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-black text-red-500 ${dark ? "hover:bg-white/10" : "hover:bg-white"}`}
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
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-bold transition ${
            dark
              ? "border-white/15 bg-white/5 text-white hover:border-[#F58220] hover:bg-white/10"
              : "border-neutral-200 bg-white text-neutral-800 hover:border-orange-400 hover:text-orange-600"
          } ${compact ? "w-full" : ""}`}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="grid size-8 place-items-center rounded-full bg-orange-500 text-xs font-black text-white">
            {(user?.name ?? "Compte MATLI")
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
              <p className="font-black text-neutral-950">{user?.name ?? "Compte MATLI"}</p>
              <p className="mt-1 text-sm text-neutral-500">{user?.email ?? ""}</p>
              <p className="mt-2 w-fit rounded-md bg-orange-50 px-2 py-1 text-xs font-black text-orange-700">
                {user?.company_name ?? user?.role ?? "Compte connecté"}
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
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                    isActive(href) ? "bg-orange-50 text-orange-600" : "text-neutral-700 hover:bg-neutral-50 hover:text-orange-600"
                  }`}
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

  if (dark) {
    return (
      <Link
        href="/login"
        className={mobile
          ? "mt-2 flex min-h-11 items-center rounded-lg px-2.5 text-sm font-bold text-neutral-300 transition hover:bg-white/5 hover:text-white"
          : "inline-flex min-h-11 items-center px-3 text-sm font-bold text-neutral-200 transition hover:text-white"}
        onClick={onNavigate}
      >
        {mobile ? "Connexion" : "Se connecter"}
      </Link>
    );
  }

  return (
    <ButtonLink
      href="/login"
      variant="secondary"
      className={mobile ? "mt-2 w-full" : compact ? "px-3" : ""}
      onClick={onNavigate}
    >
      {compact ? "Compte" : "Se connecter"}
    </ButtonLink>
  );
}
