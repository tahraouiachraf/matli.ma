import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CalendarCheck, ShieldCheck, Truck } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import { GoogleConnectButton } from "@/components/ui/GoogleConnectButton";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte MATLI pour déposer, réserver ou gérer vos machines.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <section className="bg-[radial-gradient(circle_at_12%_18%,rgba(249,115,22,0.12),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f8fafc_50%,#fff7ed_100%)]">
      <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-2xl shadow-neutral-950/10 lg:grid-cols-[1.05fr_0.85fr]">
          <div className="relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden bg-neutral-950 p-6 text-white sm:p-8 lg:min-h-[650px] lg:p-12">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(249,115,22,0.95),rgba(17,24,39,0.92)_48%,rgba(67,20,7,0.92))]" />
            <div className="absolute right-[-120px] top-12 -z-10 h-72 w-72 rounded-full border border-white/15 sm:h-96 sm:w-96" />
            <div className="absolute bottom-[-150px] left-[-90px] -z-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-xl font-black shadow-xl shadow-orange-500/30">
                M
              </span>
              <div>
                <p className="font-black leading-tight">MATLI.ma</p>
                <p className="text-xs font-semibold text-white/60">Marketplace BTP au Maroc</p>
              </div>
            </div>

            <div className="max-w-2xl py-10 lg:py-0">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-100">Espace sécurisé</p>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
                Louer, déposer et gérer vos machines depuis un seul compte.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
                Accédez aux demandes clients, réservations, prix par jour, disponibilités et historique de location avec une interface pensée pour les propriétaires et locataires.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Machines vérifiées", description: "Publiez votre parc et gagnez en visibilité.", Icon: BadgeCheck },
                { title: "Réservations suivies", description: "Centralisez demandes, dates et statuts.", Icon: CalendarCheck },
                { title: "Profil propriétaire", description: "Gérez clients, prix et documents.", Icon: Truck },
                { title: "Accès protégé", description: "Connexion sécurisée avec session locale.", Icon: ShieldCheck },
              ].map(({ title, description, Icon }) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-orange-200" />
                  <p className="mt-3 text-sm font-black">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-white/65">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center p-5 sm:p-8 lg:p-12">
            <div className="w-full">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">Connexion</p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-neutral-950 sm:text-4xl">Accéder à mon compte</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Connectez-vous pour déposer une machine, comparer les offres ou suivre vos réservations.
              </p>

              <div className="mt-7">
                <GoogleConnectButton className="w-full" />
              </div>

              <div className="my-6 flex items-center gap-3 text-xs font-black uppercase text-neutral-400">
                <span className="h-px flex-1 bg-neutral-200" />
                ou avec email
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <LoginForm />

              <p className="mt-6 text-center text-sm text-neutral-600 sm:text-left">
                Nouveau sur MATLI ?{" "}
                <Link href="/inscription" className="font-black text-orange-600 transition hover:text-orange-700">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
