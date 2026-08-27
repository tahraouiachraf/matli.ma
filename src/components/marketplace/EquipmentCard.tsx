import { BadgeCheck, MapPin, Star, Truck, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { formatDh } from "@/lib/format";
import { statusLabels } from "@/lib/data";
import type { Equipment } from "@/types";

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="overflow-hidden rounded-md border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-neutral-950/10">
      <div className="relative h-52 bg-cover bg-center sm:h-56" style={{ backgroundImage: `url(${item.image})` }}>
        {item.sponsored ? (
          <span className="absolute left-3 top-3 rounded-md bg-amber-400 px-3 py-1 text-xs font-black text-neutral-950">
            Sponsorisé
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 rounded-md bg-white px-3 py-1 text-xs font-bold text-neutral-900">
          {statusLabels[item.status]}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-amber-700">{item.category}</p>
            <h3 className="mt-1 text-xl font-bold text-neutral-950">{item.title}</h3>
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-bold text-neutral-800">
            <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden />
            {item.rating}
          </div>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-neutral-600">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} aria-hidden />
            {item.city}, {item.region}
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck size={16} aria-hidden />
            {item.brand} · {item.model} · {item.year}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-neutral-700">
          {item.operator ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1">
              <UserRoundCheck size={14} aria-hidden />
              Opérateur
            </span>
          ) : null}
          {item.delivery ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1">
              <Truck size={14} aria-hidden />
              Livraison
            </span>
          ) : null}
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase text-neutral-500">À partir de</p>
            <p className="text-xl font-black text-neutral-950">{formatDh(item.priceDay)} / jour</p>
          </div>
          <Link
            href={`/materiel/${item.slug}`}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-neutral-950 px-4 text-sm font-bold text-white hover:bg-neutral-800 sm:w-auto"
          >
            Voir le matériel
          </Link>
        </div>
      </div>
    </article>
  );
}
