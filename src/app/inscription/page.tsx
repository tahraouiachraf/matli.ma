import type { Metadata } from "next";
import Link from "next/link";
import { cities } from "@/lib/data";
import { GoogleConnectButton } from "@/components/ui/GoogleConnectButton";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez un compte MATLI pour déposer vos machines ou réserver du matériel professionnel.",
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

        <form className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Nom complet
            <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Téléphone
            <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <input type="email" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Ville
            <select defaultValue="" className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
              <option value="" disabled>Choisir une ville</option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold md:col-span-2">
            Je suis
            <select className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
              <option>Propriétaire de machines</option>
              <option>Client qui veut louer</option>
              <option>Entreprise BTP</option>
            </select>
          </label>
          <button className="h-12 rounded-md bg-orange-500 text-sm font-black text-white hover:bg-orange-600 md:col-span-2">
            Créer mon compte
          </button>
        </form>

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
