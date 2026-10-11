import { ArrowUpRight, CircleGauge, Construction, Forklift, MoveUpRight, Pickaxe, Shovel, Tractor, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/data";
import type { Category } from "@/types";

const categoryIcons = {
  "tractopelles": Tractor,
  "mini-pelles": Shovel,
  "chariots-telescopiques": Forklift,
  "nacelles-telescopiques-articules": MoveUpRight,
  "grues": Construction,
  "pelles-sur-chenilles": Pickaxe,
  "chargeuses-sur-pneumatiques": Truck,
  "compacteurs-rouleaux-compresseurs": CircleGauge,
};

function desktopSpan(itemCount: number, index: number) {
  if (itemCount === 7) return index < 4 ? "lg:col-span-3" : "lg:col-span-4";
  if (itemCount === 8) return "lg:col-span-3";
  if (itemCount === 4) return "lg:col-span-3";
  return "lg:col-span-4";
}

export function CategoryGrid({ items = categories }: { items?: Category[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
      {items.map((category, index) => {
        const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] ?? Construction;

        return (
          <Link
            key={category.slug}
            href={`/rentals/${category.slug}`}
            className={`group relative flex min-h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-950/10 ${desktopSpan(items.length, index)}`}
          >
            <span className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
              <Image
                src={category.image}
                alt={`${category.name} disponibles à la location`}
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-transparent to-transparent" aria-hidden />
              <span className="absolute left-4 top-4 rounded-md border border-white/30 bg-white/90 px-2.5 py-1 text-[11px] font-black text-orange-700 shadow-sm backdrop-blur-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-md bg-white text-orange-600 shadow-lg transition group-hover:bg-orange-500 group-hover:text-white">
                <Icon size={23} strokeWidth={2.2} aria-hidden />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-black leading-6 text-neutral-950 transition-colors group-hover:text-orange-700">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{category.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 border-t border-neutral-100 pt-4 text-sm font-black text-orange-700">
                Voir les machines <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
