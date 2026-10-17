import { EquipmentCardSkeleton } from "@/components/marketplace/EquipmentCardSkeleton";

export default function CompanyLoading() {
  return (
    <div aria-busy="true" className="bg-white">
      <p className="sr-only" role="status">Chargement de l’entreprise et de ses machines</p>
      <section className="border-b border-neutral-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div className="size-16 animate-pulse rounded-md bg-neutral-200" />
            <div className="mt-5 h-4 w-48 animate-pulse rounded bg-neutral-200" />
            <div className="mt-3 h-11 w-72 max-w-full animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-5 w-4/5 max-w-xl animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 h-4 w-44 animate-pulse rounded bg-neutral-100" />
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200">
            {[0, 1].map((item) => (
              <div key={item} className="h-24 w-32 animate-pulse bg-white" />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
        <div className="mt-3 h-9 w-72 animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-neutral-100" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <EquipmentCardSkeleton key={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
