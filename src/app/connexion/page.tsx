import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import { GoogleConnectButton } from "@/components/ui/GoogleConnectButton";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte MATLI pour déposer, réserver ou gérer vos machines.",
};

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[72vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-md border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-950/5">
        <p className="font-bold text-orange-600">Connexion</p>
        <h1 className="mt-2 text-3xl font-black">Accéder à mon compte</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Connectez-vous pour déposer vos machines, recevoir des demandes, répondre aux clients et suivre les réservations.
        </p>

        <div className="mt-6">
          <GoogleConnectButton className="w-full" />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200" />
          ou
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <LoginForm />

        <p className="mt-5 text-sm text-neutral-600">
          Nouveau sur MATLI ?{" "}
          <Link href="/inscription" className="font-black text-orange-600">
            Créer un compte
          </Link>
        </p>
      </div>
    </section>
  );
}
