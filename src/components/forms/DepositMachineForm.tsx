"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { categories, cities } from "@/lib/data";
import { createWorkspaceEquipment, uploadEquipmentImage } from "@/services/api/matli";
import type { CreateEquipmentPayload } from "@/services/api/matli";
import type { Equipment } from "@/types";

type DepositMachineFormProps = {
  onCreated?: (item: Equipment) => void;
};

export function DepositMachineForm({ onCreated }: DepositMachineFormProps) {
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const specs = String(formData.get("specs") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const imageFile = formData.get("image");

    try {
      if (imageFile instanceof File && imageFile.size > 8 * 1024 * 1024) {
        throw new Error("Image trop lourde");
      }
      const uploadedImage = imageFile instanceof File && imageFile.size > 0
        ? await uploadEquipmentImage(imageFile, token)
        : null;
      const item = await createWorkspaceEquipment(
        {
          category_slug: String(formData.get("category_slug") ?? ""),
          title: String(formData.get("title") ?? ""),
          brand: String(formData.get("brand") ?? ""),
          model: String(formData.get("model") ?? ""),
          year: Number(formData.get("year")) || undefined,
          city: String(formData.get("city") ?? ""),
          region: String(formData.get("region") ?? ""),
          price_day: Number(formData.get("price_day")),
          price_week: Number(formData.get("price_week")) || undefined,
          status: String(formData.get("status") ?? "available") as CreateEquipmentPayload["status"],
          image_url: uploadedImage?.url,
          description: String(formData.get("description") ?? ""),
          operator_available: formData.get("operator_available") === "1",
          delivery_available: formData.get("delivery_available") === "1",
          is_sponsored: formData.get("is_sponsored") === "1",
          specs,
        },
        token,
      );
      onCreated?.(item);
      form.reset();
      setMessage("Machine ajoutée avec succès.");
    } catch {
      setError("Merci de vérifier les informations puis de réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-950/5 sm:p-5 md:grid-cols-2">
      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700 md:col-span-2">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 md:col-span-2">{error}</p> : null}
      <label className="grid gap-2 text-sm font-semibold">
        Catégorie
        <select name="category_slug" defaultValue="" required className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="" disabled>Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Titre de l&apos;annonce
        <input name="title" required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: Tractopelle JCB 3CX disponible" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Marque
        <input name="brand" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: JCB, Caterpillar, Volvo" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Modèle
        <input name="model" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: JCB 3CX Eco" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Année
        <input name="year" type="number" min="1990" max="2027" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 2021" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Ville
        <select name="city" defaultValue="" required className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="" disabled>Choisir une ville</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Région
        <input name="region" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: Casablanca-Settat" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Prix / jour
        <input name="price_day" type="number" min="1" required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 1500 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Prix / semaine
        <input name="price_week" type="number" min="1" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 8800 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Statut
        <select name="status" defaultValue="available" className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="available">Disponible maintenant</option>
          <option value="reserved">Réservé</option>
          <option value="rented">En location</option>
          <option value="maintenance">En maintenance</option>
        </select>
      </label>
      <div className="grid gap-3 rounded-md bg-neutral-50 p-4 md:col-span-2 sm:grid-cols-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="operator_available" value="1" className="size-4 accent-orange-500" />
          Opérateur disponible
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="delivery_available" value="1" className="size-4 accent-orange-500" />
          Livraison possible
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="is_sponsored" value="1" className="size-4 accent-orange-500" />
          Sponsorisé
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Photo principale
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="min-h-12 rounded-md border border-neutral-200 bg-white px-3 py-2 font-normal file:mr-3 file:rounded-md file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:font-bold file:text-orange-700" />
        <span className="text-xs font-normal text-neutral-500">JPEG, PNG, WebP ou AVIF, 8 Mo maximum. La photo sera automatiquement compressée.</span>
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Description
        <textarea name="description" className="min-h-28 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="État de la machine, accessoires, conditions de location..." />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Spécifications
        <textarea name="specs" className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Une spécification par ligne" />
      </label>
      <button disabled={submitting || !token} className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-neutral-300 md:col-span-2">
        {submitting ? "Publication..." : "Publier ma machine"}
      </button>
    </form>
  );
}
