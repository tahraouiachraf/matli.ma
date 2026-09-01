import { ArrowUp, Factory, Layers, Mountain, Package, Tractor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/data";
import type { Category } from "@/types";

const icons = { Mountain, ArrowUp, Package, Layers, Factory, Tractor };

export function CategoryGrid({ items = categories }: { items?: Category[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => {
        const Icon = icons[category.icon as keyof typeof icons] ?? Mountain;

        return (
          <Link
            key={category.slug}
            href={`/location?machine=${category.slug}`}
            className="group overflow-hidden rounded-md border border-neutral-200 bg-white transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-neutral-950/10"
          >
            <div className="relative h-36 overflow-hidden bg-neutral-100">
              <Image
                src={category.image}
                alt=""
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="p-5">
              <div className="mb-4 grid size-11 place-items-center rounded-md bg-amber-100 text-amber-800">
                <Icon size={22} aria-hidden />
              </div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-neutral-950">{category.name}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{category.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
