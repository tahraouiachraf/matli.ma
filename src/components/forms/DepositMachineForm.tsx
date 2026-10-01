"use client";

import { ImagePlus, Images, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { categories, cities } from "@/lib/data";
import { createWorkspaceEquipment, updateWorkspaceEquipment, uploadEquipmentImage } from "@/services/api/matli";
import type { CreateEquipmentPayload } from "@/services/api/matli";
import type { Equipment } from "@/types";

type DepositMachineFormProps = {
  onCreated?: (item: Equipment) => void;
  onUpdated?: (item: Equipment) => void;
  onCancel?: () => void;
  equipment?: Equipment | null;
};

export function DepositMachineForm({ equipment, onCancel, onCreated, onUpdated }: DepositMachineFormProps) {
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const primaryPreview = useMemo(() => primaryImage ? URL.createObjectURL(primaryImage) : null, [primaryImage]);
  const galleryPreviews = useMemo(() => galleryImages.map((file) => ({ file, url: URL.createObjectURL(file) })), [galleryImages]);

  useEffect(() => () => {
    if (primaryPreview) URL.revokeObjectURL(primaryPreview);
  }, [primaryPreview]);

  useEffect(() => () => {
    galleryPreviews.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [galleryPreviews]);

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
    const imageFiles = [primaryImage, ...galleryImages]
      .filter((file): file is File => file !== null);

    try {
      if (!equipment && !primaryImage) {
        throw new Error("Ajoutez une photo principale pour publier ce matériel.");
      }
      if (imageFiles.length > 8) {
        throw new Error("Vous pouvez ajouter jusqu’à 8 photos par matériel.");
      }
      if (imageFiles.some((file) => file.size > 8 * 1024 * 1024)) {
        throw new Error("Chaque image doit peser au maximum 8 Mo.");
      }
      const uploadedImages = await Promise.all(imageFiles.map((file) => uploadEquipmentImage(file, token)));
      const imageUrls = uploadedImages.map((image) => image.url);
      const payload: CreateEquipmentPayload = {
          category_slug: String(formData.get("category_slug") ?? ""),
          title: String(formData.get("title") ?? ""),
          brand: String(formData.get("brand") ?? ""),
          model: String(formData.get("model") ?? ""),
          year: Number(formData.get("year")) || undefined,
          technical_condition: String(formData.get("technical_condition") ?? "") as CreateEquipmentPayload["technical_condition"],
          power_hp: Number(formData.get("power_hp")) || undefined,
          tonnage: Number(formData.get("tonnage")) || undefined,
          city: String(formData.get("city") ?? ""),
          region: String(formData.get("region") ?? ""),
          price_day: Number(formData.get("price_day")),
          price_week: Number(formData.get("price_week")) || undefined,
          status: String(formData.get("status") ?? "available") as CreateEquipmentPayload["status"],
          image_url: imageUrls[0],
          image_urls: imageUrls.length ? imageUrls : undefined,
          description: String(formData.get("description") ?? ""),
          operator_available: formData.get("operator_available") === "1",
          delivery_available: formData.get("delivery_available") === "1",
          delivery_terms: String(formData.get("delivery_terms") ?? ""),
          is_sponsored: formData.get("is_sponsored") === "1",
          specs,
        };
      const item = equipment?.backendId
        ? await updateWorkspaceEquipment(equipment.backendId, payload, token)
        : await createWorkspaceEquipment(payload, token);
      if (equipment) onUpdated?.(item);
      else onCreated?.(item);
      form.reset();
      setPrimaryImage(null);
      setGalleryImages([]);
      setMessage(equipment ? "Machine modifiée et envoyée en validation." : "Machine ajoutée et envoyée en validation.");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Merci de vérifier les informations puis de réessayer.");
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
        <select name="category_slug" defaultValue={categories.find((item) => item.name === equipment?.category)?.slug ?? ""} required className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="" disabled>Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Titre de l&apos;annonce
        <input name="title" defaultValue={equipment?.title} required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: Tractopelle JCB 3CX disponible" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Marque
        <input name="brand" defaultValue={equipment?.brand} className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: JCB, Caterpillar, Volvo" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Modèle
        <input name="model" defaultValue={equipment?.model} className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: JCB 3CX Eco" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Année
        <input name="year" defaultValue={equipment?.year} type="number" min="1990" max="2027" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 2021" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        État technique
        <select name="technical_condition" defaultValue={equipment?.technicalCondition ?? "good"} className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="excellent">Excellent</option>
          <option value="very_good">Très bon</option>
          <option value="good">Bon</option>
          <option value="fair">Correct</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Puissance (ch)
        <input name="power_hp" defaultValue={equipment?.powerHp} type="number" min="1" max="5000" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 110" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Tonnage
        <input name="tonnage" defaultValue={equipment?.tonnage} type="number" min="0.1" max="1000" step="0.1" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 8.5" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Ville
        <select name="city" defaultValue={equipment?.city ?? ""} required className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="" disabled>Choisir une ville</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Région
        <input name="region" defaultValue={equipment?.region} className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: Casablanca-Settat" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Prix / jour
        <input name="price_day" defaultValue={equipment?.priceDay} type="number" min="1" required className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 1500 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Prix / semaine
        <input name="price_week" defaultValue={equipment?.priceWeek} type="number" min="1" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 8800 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Statut
        <select name="status" defaultValue={equipment?.status.toLowerCase() ?? "available"} className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="available">Disponible maintenant</option>
          <option value="reserved">Réservé</option>
          <option value="rented">En location</option>
          <option value="maintenance">En maintenance</option>
        </select>
      </label>
      <div className="grid gap-3 rounded-md bg-neutral-50 p-4 md:col-span-2 sm:grid-cols-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="operator_available" value="1" defaultChecked={equipment?.operator} className="size-4 accent-orange-500" />
          Opérateur disponible
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="delivery_available" value="1" defaultChecked={equipment?.delivery} className="size-4 accent-orange-500" />
          Livraison possible
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="is_sponsored" value="1" defaultChecked={equipment?.sponsored} className="size-4 accent-orange-500" />
          Sponsorisé
        </label>
      </div>
      <fieldset className="grid gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 md:col-span-2 sm:p-5">
        <legend className="text-base font-black text-neutral-950">Photos du matériel</legend>
        <p className="-mt-3 text-sm leading-6 text-neutral-600">Présentez clairement la machine avec une photo principale et plusieurs angles complémentaires.</p>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="grid gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-sm font-semibold transition hover:border-orange-400">
            <label htmlFor="equipment-primary-image" className="flex items-center gap-2 text-neutral-950"><ImagePlus size={19} className="text-orange-600" aria-hidden /> Photo principale {!equipment ? <span className="text-red-600">*</span> : null}</label>
            <input
              id="equipment-primary-image"
              name="primary_image"
              type="file"
              required={!equipment}
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => setPrimaryImage(event.target.files?.[0] ?? null)}
              className="text-xs font-normal text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:font-bold file:text-orange-700"
            />
            {primaryPreview ? <span className="block aspect-[16/10] rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${primaryPreview})` }} aria-label="Aperçu de la photo principale" /> : equipment?.image ? <span className="block aspect-[16/10] rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${equipment.image})` }} aria-label="Photo principale actuelle" /> : <span className="grid aspect-[16/10] place-items-center rounded-lg bg-neutral-100 text-center text-xs font-semibold text-neutral-500">La photo utilisée dans les résultats de recherche</span>}
          </div>
          <div className="grid content-start gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-sm font-semibold transition hover:border-orange-400">
            <label htmlFor="equipment-gallery-images" className="flex items-center gap-2 text-neutral-950"><Images size={19} className="text-orange-600" aria-hidden /> Images supplémentaires</label>
            <input
              id="equipment-gallery-images"
              name="gallery_images"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => setGalleryImages(Array.from(event.target.files ?? []).slice(0, 7))}
              className="text-xs font-normal text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:font-bold file:text-orange-700"
            />
            {galleryPreviews.length ? (
              <span className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {galleryPreviews.map(({ file, url }, index) => (
                  <span key={`${file.name}-${file.lastModified}`} className="group relative aspect-square rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} title={file.name}>
                    <button type="button" onClick={(event) => { event.preventDefault(); setGalleryImages((current) => current.filter((_, itemIndex) => itemIndex !== index)); }} className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-white text-neutral-800 shadow" aria-label={`Retirer ${file.name}`}><X size={14} aria-hidden /></button>
                  </span>
                ))}
              </span>
            ) : <span className="grid min-h-28 place-items-center rounded-lg bg-neutral-100 px-4 text-center text-xs font-semibold text-neutral-500">Ajoutez jusqu’à 7 vues : côtés, cabine, godet et état général.</span>}
          </div>
        </div>
        <p className="text-xs leading-5 text-neutral-500">JPEG, PNG, WebP ou AVIF. 8 Mo maximum par image, 8 photos au total.</p>
        {equipment?.images?.length ? <p className="text-xs font-semibold text-orange-700">{equipment.images.length} photo(s) actuellement enregistrée(s). Ajouter de nouvelles images remplacera la galerie actuelle.</p> : null}
      </fieldset>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Description
        <textarea name="description" defaultValue={equipment?.description} className="min-h-28 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="État de la machine, accessoires, conditions de location..." />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Conditions de livraison
        <textarea name="delivery_terms" defaultValue={equipment?.deliveryTerms} className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Zone desservie, délai, frais et conditions de déchargement..." />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Spécifications
        <textarea name="specs" defaultValue={equipment?.specs.join("\n")} className="min-h-24 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="Une spécification par ligne" />
      </label>
      <div className="flex flex-col gap-2 md:col-span-2 sm:flex-row">
        <button disabled={submitting || !token} className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-neutral-300">
          {submitting ? "Enregistrement..." : equipment ? "Enregistrer les modifications" : "Publier ma machine"}
        </button>
        {equipment && onCancel ? <button type="button" onClick={onCancel} className="h-12 rounded-md border border-neutral-200 px-5 text-sm font-bold">Annuler</button> : null}
      </div>
    </form>
  );
}
