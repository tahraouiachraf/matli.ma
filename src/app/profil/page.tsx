import type { Metadata } from "next";
import { cities, demoAccount } from "@/lib/data";

export const metadata: Metadata = {
  title: "Profil",
  description: "Complétez votre profil MATLI pour déposer et louer du matériel professionnel.",
};

export default function ProfilePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="font-bold text-orange-600">Profil propriétaire</p>
        <h1 className="mt-2 text-4xl font-black">Compléter mon profil</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Ces informations serviront à afficher votre entreprise et à recevoir les demandes de location.
        </p>
      </div>

      <form className="grid gap-6 rounded-md border border-neutral-200 bg-white p-5 md:grid-cols-2">
        {[
          ["Nom complet", demoAccount.name],
          ["Téléphone", demoAccount.phone],
          ["Nom entreprise", demoAccount.company],
          ["ICE", demoAccount.ice],
          ["Email", demoAccount.email],
          ["Adresse", demoAccount.address],
        ].map(([label, defaultValue]) => (
          <label key={label} className="grid gap-2 text-sm font-semibold">
            {label}
            <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" defaultValue={defaultValue} />
          </label>
        ))}

        <label className="grid gap-2 text-sm font-semibold">
          Ville
          <select defaultValue={demoAccount.city} className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Type de compte
          <select defaultValue={demoAccount.role} className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
            <option>Propriétaire</option>
            <option>Locataire</option>
            <option>Entreprise BTP</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold md:col-span-2">
          Description publique
          <textarea
            className="min-h-28 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500"
            defaultValue={demoAccount.description}
          />
        </label>

        <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
          <button className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
            Enregistrer le profil
          </button>
          <a
            href="/deposer"
            className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-200 px-5 text-sm font-bold hover:border-orange-400"
          >
            Déposer une machine
          </a>
        </div>
      </form>
    </section>
  );
}
