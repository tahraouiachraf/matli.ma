import { categories, cities } from "@/lib/data";

export function DepositMachineForm() {
  return (
    <form className="grid gap-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-950/5 sm:p-5 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">
        Catégorie
        <select defaultValue="" className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option value="" disabled>Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Titre de l'annonce
        <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: Tractopelle JCB 3CX disponible" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Marque
        <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: JCB, Caterpillar, Volvo" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Modèle
        <input className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: JCB 3CX Eco" />
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
      <label className="grid gap-2 text-sm font-semibold">
        Prix / jour
        <input inputMode="numeric" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 1500 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Prix / semaine
        <input inputMode="numeric" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="Ex: 8800 DH" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Téléphone WhatsApp
        <input inputMode="tel" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" placeholder="+212 6..." />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Statut
        <select className="h-12 rounded-md border border-neutral-200 bg-white px-3 font-normal outline-none focus:border-orange-500">
          <option>Disponible maintenant</option>
          <option>Réservé</option>
          <option>En location</option>
          <option>En maintenance</option>
        </select>
      </label>
      <div className="grid gap-3 rounded-md bg-neutral-50 p-4 md:col-span-2 sm:grid-cols-3">
        {["Opérateur disponible", "Livraison possible", "Propriétaire vérifié"].map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" className="size-4 accent-orange-500" />
            {option}
          </label>
        ))}
      </div>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Photos
        <input type="file" multiple className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm font-normal" />
      </label>
      <label className="grid gap-2 text-sm font-semibold md:col-span-2">
        Description
        <textarea className="min-h-28 rounded-md border border-neutral-200 p-3 font-normal outline-none focus:border-orange-500" placeholder="État de la machine, accessoires, conditions de location..." />
      </label>
      <button className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600 md:col-span-2">
        Publier ma machine
      </button>
    </form>
  );
}
