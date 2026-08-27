import type { Metadata } from "next";
import { Building2, ChevronRight, CircleUserRound, ListChecks, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { GoogleConnectButton } from "@/components/ui/GoogleConnectButton";

export const metadata: Metadata = {
  title: "Compte",
  description: "Espace compte MATLI pour gérer votre profil, vos machines et vos demandes.",
};

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-bold text-orange-600">Compte MATLI</p>
          <h1 className="mt-2 text-4xl font-black">Gérez votre activité simplement.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
            Connectez votre compte Google, complétez votre profil propriétaire, puis publiez vos machines pour recevoir des demandes clients.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <GoogleConnectButton />
            <Link
              href="/profil"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-950 px-5 text-sm font-bold text-white hover:bg-neutral-800"
            >
              Compléter mon profil
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            [CircleUserRound, "Profil", "Nom, téléphone, ville, entreprise et rôle."],
            [Building2, "Entreprise", "ICE, adresse, logo et informations publiques."],
            [ListChecks, "Machines", "JCB, mini-pelle, chargeuse, prix, photos et disponibilité."],
            [ShieldCheck, "Sécurité", "Connexion Google et permissions côté backend Laravel."],
          ].map(([Icon, title, text]) => (
            <Link key={title as string} href="/profil" className="flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-5 hover:border-orange-300">
              <Icon className="text-orange-500" size={24} aria-hidden />
              <div className="flex-1">
                <h2 className="font-black">{title as string}</h2>
                <p className="mt-1 text-sm text-neutral-600">{text as string}</p>
              </div>
              <ChevronRight size={18} aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
