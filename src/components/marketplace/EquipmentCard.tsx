import { BadgeCheck, MapPin, Truck, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDh } from "@/lib/format";
import { statusLabels } from "@/lib/data";
import type { Equipment } from "@/types";

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-950/8">
      <div className="relative aspect-[16/11] overflow-hidden bg-orange-50 sm:aspect-[4/3]">
        <Image
          src={item.image}
          alt={`${item.title} à louer à ${item.city}`}
          className="object-cover transition duration-500 group-hover:scale-[1.025]"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {item.sponsored ? (
          <span className="absolute left-3 top-3 rounded-md bg-amber-400 px-3 py-1 text-xs font-black text-neutral-950">
            Sponsorisé
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 rounded-md border border-white/80 bg-white/95 px-3 py-1 text-xs font-bold text-neutral-900 shadow-sm">
          {statusLabels[item.status]}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase text-orange-700">{item.category}</p>
            <h3 className="mt-1 line-clamp-2 text-lg font-bold text-neutral-950 sm:text-xl">{item.title}</h3>
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
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 ${item.delivery ? "bg-emerald-50 text-emerald-800" : "bg-neutral-100 text-neutral-600"}`}>
            <Truck size={14} aria-hidden />
            {item.delivery ? "Livraison possible" : "Retrait sur place"}
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 max-[379px]:flex-col max-[379px]:items-stretch">
          <div>
            <p className="text-xs uppercase text-neutral-500">À partir de</p>
            <p className="text-xl font-black text-neutral-950">{formatDh(item.priceDay)} / jour</p>
          </div>
          <Link
            href={`/materiel/${item.slug}`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700 max-[379px]:w-full"
          >
            Voir le matériel
          </Link>
        </div>
      </div>
    </article>
  );
}
