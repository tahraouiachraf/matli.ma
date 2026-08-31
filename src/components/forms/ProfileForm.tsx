"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { cities } from "@/lib/data";

export function ProfileForm() {
  const { user } = useAuth();

  return (
    <form className="grid gap-6 rounded-md border border-neutral-200 bg-white p-5 md:grid-cols-2">
      {[
        ["Nom complet", user?.name ?? ""],
        ["Téléphone", user?.phone ?? ""],
        ["Nom entreprise", user?.company_name ?? ""],
        ["Email", user?.email ?? ""],
      ].map(([label, defaultValue]) => (
        <label key={label} className="grid gap-2 text-sm font-semibold">
          {label}
          <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" defaultValue={defaultValue} />
        </label>
      ))}

      <label className="grid gap-2 text-sm font-semibold">
        Ville
        <select defaultValue={user?.city ?? ""} className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="">Choisir une ville</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        Type de compte
        <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" value={user?.role ?? "client"} readOnly />
      </label>

      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Description publique
        <textarea
          className="min-h-28 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500"
          defaultValue="Profil synchronisé avec votre espace de gestion. La modification sera disponible prochainement."
        />
      </label>

      <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
        <button type="button" className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
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
  );
}
