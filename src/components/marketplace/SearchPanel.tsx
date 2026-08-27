import Link from "next/link";
import { CircleUserRound, PlusCircle } from "lucide-react";
import { cities } from "@/lib/data";

const machineTypes = [
  "JCB 3CX",
  "Mini-pelle",
  "Chargeuse",
  "Tracteur",
  "Telescopic",
  "Pelle sur chenilles",
  "Nacelle",
];

export function SearchPanel() {
  return (
    <div className="rounded-md border border-white/20 bg-white p-4 shadow-2xl shadow-neutral-950/20">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-orange-600">Déposer une machine</p>
          <h2 className="text-xl font-black text-neutral-950">Créez votre compte et louez votre matériel</h2>
        </div>
        <Link
          href="/compte"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-neutral-200 px-4 text-sm font-bold text-neutral-800 hover:border-orange-400 hover:text-orange-600"
        >
          <CircleUserRound size={18} aria-hidden />
          Mon compte
        </Link>
      </div>

      <form className="grid gap-3 md:grid-cols-[1.1fr_1fr_0.9fr_1fr_auto]">
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Machine</span>
        <select
          defaultValue=""
          className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-orange-500"
        >
          <option value="" disabled>
            Choisir une machine
          </option>
          {machineTypes.map((machine) => (
            <option key={machine} value={machine}>
              {machine}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Ville</span>
        <select
          defaultValue=""
          className="h-12 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-orange-500"
        >
          <option value="" disabled>
            Choisir une ville
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Prix / jour</span>
        <input
          inputMode="numeric"
          className="h-12 rounded-md border border-neutral-200 px-3 text-sm text-neutral-800 outline-none focus:border-orange-500"
          placeholder="Ex: 1700 DH"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Téléphone</span>
        <input
          inputMode="tel"
          className="h-12 rounded-md border border-neutral-200 px-3 text-sm text-neutral-800 outline-none focus:border-orange-500"
          placeholder="+212 6..."
        />
      </label>
      <button className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600 md:mt-5">
        <PlusCircle size={18} aria-hidden />
        Déposer
      </button>
      </form>
    </div>
  );
}
