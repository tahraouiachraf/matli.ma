"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cities } from "@/lib/data";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    try {
      await register({
        name: String(formData.get("name")),
        phone: String(formData.get("phone")),
        email: String(formData.get("email")),
        city: String(formData.get("city")),
        company_name: String(formData.get("company_name")),
        password: String(formData.get("password")),
        account_type: formData.get("account_type") === "client" ? "client" : "owner",
      });
      router.push("/espace");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Création du compte impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700 md:col-span-2">{error}</p> : null}
      <label className="grid gap-2 text-sm font-semibold">
        Nom complet
        <input name="name" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Téléphone
        <input name="phone" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Email
        <input name="email" type="email" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Ville
        <select name="city" defaultValue="" className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="" disabled>Choisir une ville</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Je suis
        <select name="account_type" className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="owner">Propriétaire de machines</option>
          <option value="client">Client qui veut louer</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Entreprise
        <input name="company_name" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Mot de passe
        <input name="password" type="password" minLength={8} className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" required />
      </label>
      <button disabled={loading} className="h-12 rounded-md bg-orange-500 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-60 md:col-span-2">
        {loading ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
