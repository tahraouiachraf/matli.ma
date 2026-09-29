"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

type AuthGuardProps = {
  children: React.ReactNode;
  title?: string;
  message?: string;
};

export function AuthGuard({
  children,
  title = "Connectez-vous pour accéder à votre espace",
  message = "Cette partie contient les informations du compte, les demandes clients, les machines publiées et l'historique de location.",
}: AuthGuardProps) {
  const { connected, ready } = useAuth();

  if (!ready) {
    return (
      <section className="mx-auto grid min-h-[60vh] max-w-7xl place-items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-pulse rounded-full bg-orange-200" aria-label="Chargement" />
      </section>
    );
  }

  if (!connected) {
    return (
      <section className="mx-auto grid min-h-[68vh] max-w-7xl place-items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-md border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-orange-50 text-orange-600">
            <LockKeyhole size={26} aria-hidden />
          </div>
          <p className="mt-5 text-sm font-black uppercase text-orange-600">Accès privé</p>
          <h1 className="mt-2 text-3xl font-black text-neutral-950">{title}</h1>
          <p className="mt-4 text-neutral-600">{message}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-neutral-200 px-5 text-sm font-bold text-neutral-800 hover:border-orange-400"
            >
              <ShieldCheck size={17} aria-hidden />
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return children;
}
