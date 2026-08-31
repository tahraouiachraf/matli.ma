import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { GoogleConnectButton } from "@/components/ui/GoogleConnectButton";

export const metadata: Metadata = {
  title: "Créer un compte propriétaire ou client",
  description: "Créez un compte MATLI pour publier vos machines BTP, recevoir des demandes ou réserver du matériel au Maroc.",
  alternates: {
    canonical: "/inscription",
  },
};

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-md border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-950/5">
        <p className="font-bold text-orange-600">Créer un compte</p>
        <h1 className="mt-2 text-3xl font-black">Déposer ou louer des machines</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Créez votre compte propriétaire pour publier vos machines, ou votre compte client pour réserver le matériel au meilleur prix.
        </p>

        <div className="mt-6">
          <GoogleConnectButton className="w-full" />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200" />
          ou
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <RegisterForm />

        <p className="mt-5 text-sm text-neutral-600">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="font-black text-orange-600">
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
}
