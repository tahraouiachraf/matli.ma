import { EquipmentCardSkeleton } from "@/components/marketplace/EquipmentCardSkeleton";

export default function CompanyLoading() {
  return (
    <div className="bg-white">
      <section className="bg-neutral-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="size-20 animate-pulse rounded-xl bg-white/15" />
            <div className="mt-6 h-10 w-64 animate-pulse rounded-xl bg-white/15" />
            <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-24 w-24 animate-pulse rounded-xl border border-white/15 bg-white/10" />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="h-9 w-72 animate-pulse rounded-xl bg-neutral-200" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <EquipmentCardSkeleton key={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
