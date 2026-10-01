"use client";

import { useState } from "react";
import { Building2, UserRound } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cities } from "@/lib/data";
import { getWorkspaceRole, isOwnerWorkspaceRole } from "@/lib/workspace-access";
import { updateAccountProfile } from "@/services/api/matli";

export function ProfileForm() {
  const { token, user, updateUser } = useAuth();
  const role = getWorkspaceRole(user);
  const isOwner = isOwnerWorkspaceRole(role);
  const canDeposit = isOwner;
  const profileLabel = isOwner ? "Profil propriétaire" : "Profil locataire";
  const profileDescription = isOwner
    ? "Gérez vos annonces, disponibilités et demandes de réservation."
    : "Gérez vos informations personnelles et suivez vos locations."
  const ProfileIcon = isOwner ? Building2 : UserRound;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const data = new FormData(event.currentTarget);

    try {
      const response = await updateAccountProfile({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? "") || null,
        city: String(data.get("city") ?? "") || null,
        company_name: String(data.get("company_name") ?? "") || null,
        description: String(data.get("description") ?? "") || null,
      }, token);
      updateUser(response.user);
      setMessage(response.message);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Merci de vérifier les informations puis de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center gap-3 rounded-md border border-orange-200 bg-orange-50 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
          <ProfileIcon size={20} aria-hidden />
        </span>
        <div>
          <p className="font-black text-neutral-950">{profileLabel}</p>
          <p className="mt-0.5 text-sm leading-5 text-neutral-600">{profileDescription}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-md border border-neutral-200 bg-white p-5 md:grid-cols-2">
      {message ? <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 md:col-span-2">{message}</p> : null}
      {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 md:col-span-2">{error}</p> : null}
      {[
        ["Nom complet", "name", user?.name ?? ""],
        ["Téléphone", "phone", user?.phone ?? ""],
        ["Nom entreprise", "company_name", user?.company_name ?? ""],
        ["Email", "email", user?.email ?? ""],
      ].map(([label, name, defaultValue]) => (
        <label key={label} className="grid gap-2 text-sm font-semibold">
          {label}
          <input
            name={name}
            type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
            required={name === "name" || name === "email"}
            inputMode={name === "phone" ? "tel" : undefined}
            autoComplete={name === "email" ? "email" : name === "phone" ? "tel" : name === "name" ? "name" : "organization"}
            pattern={name === "phone" ? "(?:\\+212[ .-]?|0)[5-7](?:[ .-]?[0-9]){8}" : undefined}
            title={name === "phone" ? "Exemple : 0612345678 ou +212 6 12 34 56 78" : undefined}
            placeholder={name === "phone" ? "0612345678" : undefined}
            className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500"
            defaultValue={defaultValue}
          />
        </label>
      ))}

      <label className="grid gap-2 text-sm font-semibold">
        Ville
        <select name="city" defaultValue={user?.city ?? ""} className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="">Choisir une ville</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Description publique
        <textarea
          name="description"
          className="min-h-28 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500"
          defaultValue={user?.description ?? ""}
          placeholder="Présentez votre activité ou précisez vos besoins de location."
        />
      </label>

      <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
        <button disabled={loading} className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-60">
          {loading ? "Enregistrement..." : "Enregistrer le profil"}
        </button>
        {canDeposit ? (
          <a
            href="/list-equipment"
            className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-200 px-5 text-sm font-bold hover:border-orange-400"
          >
            Déposer une machine
          </a>
        ) : null}
      </div>
      </form>
    </section>
  );
}
