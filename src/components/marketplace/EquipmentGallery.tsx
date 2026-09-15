"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useState } from "react";

type EquipmentGalleryProps = {
  images: string[];
  title: string;
  city: string;
};

export function EquipmentGallery({ images, title, city }: EquipmentGalleryProps) {
  const gallery = Array.from(new Set(images.filter(Boolean)));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = gallery[selectedIndex] ?? gallery[0];

  function selectPrevious() {
    setSelectedIndex((current) => (current - 1 + gallery.length) % gallery.length);
  }

  function selectNext() {
    setSelectedIndex((current) => (current + 1) % gallery.length);
  }

  if (!selectedImage) return null;

  return (
    <div className="grid gap-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 sm:aspect-[16/11]">
        <Image
          key={selectedImage}
          src={selectedImage}
          alt={`${title} à louer à ${city}, photo ${selectedIndex + 1}`}
          className="object-cover transition duration-300 motion-safe:group-hover:scale-[1.01]"
          fill
          priority={selectedIndex === 0}
          sizes="(min-width: 1024px) 58vw, 100vw"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-neutral-950/80 px-3 py-1.5 text-xs font-black text-white backdrop-blur-sm">
          <Images className="size-4" aria-hidden />
          {selectedIndex + 1} / {gallery.length}
        </span>
        {gallery.length > 1 ? (
          <>
            <button
              type="button"
              onClick={selectPrevious}
              aria-label="Afficher la photo précédente"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-neutral-950 shadow-lg transition hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={selectNext}
              aria-label="Afficher la photo suivante"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-neutral-950 shadow-lg transition hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {gallery.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1" aria-label="Photos du matériel">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Afficher la photo ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md border-2 bg-neutral-100 transition sm:w-32 ${
                selectedIndex === index
                  ? "border-orange-500 ring-4 ring-orange-100"
                  : "border-transparent opacity-75 hover:border-neutral-300 hover:opacity-100"
              }`}
            >
              <Image src={image} alt="" className="object-cover" fill sizes="128px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
