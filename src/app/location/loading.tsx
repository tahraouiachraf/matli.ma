import { EquipmentCardSkeleton } from "@/components/marketplace/EquipmentCardSkeleton";

function Line({ className }: { className: string }) {
  return <span aria-hidden className={`block animate-pulse rounded bg-neutral-200 ${className}`} />;
}

export default function LocationLoading() {
  return (
    <div aria-busy="true">
      <p className="sr-only" role="status">Chargement des machines disponibles</p>
      <section className="border-b border-orange-100 bg-orange-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Line className="h-7 w-56 bg-orange-100" />
          <div className="mt-5 grid max-w-4xl gap-3">
            <Line className="h-11 w-full max-w-3xl" />
            <Line className="h-11 w-4/5 max-w-2xl" />
            <Line className="mt-1 h-5 w-3/5 max-w-xl bg-orange-100" />
          </div>
          <div className="mt-7 grid gap-3 rounded-lg border border-orange-100 bg-white p-3 shadow-sm lg:grid-cols-[1.2fr_1fr_1fr_auto]">
            {[0, 1, 2].map((item) => (
              <div key={item} className="grid gap-2">
                <Line className="h-3 w-20" />
                <Line className="h-12 w-full bg-neutral-100" />
              </div>
            ))}
            <Line className="h-12 w-full bg-orange-200 lg:mt-5 lg:w-32" />
          </div>
          <div className="mt-5 flex flex-wrap gap-4">
            <Line className="h-4 w-44 bg-orange-100" />
            <Line className="h-4 w-40 bg-orange-100" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Line className="h-11 w-28 bg-orange-100" />
          <Line className="h-4 w-20" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden h-fit rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:block">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <div className="size-10 animate-pulse rounded-lg bg-orange-100" />
            <div className="grid flex-1 gap-2">
              <Line className="h-4 w-20" />
              <Line className="h-3 w-28 bg-neutral-100" />
            </div>
          </div>
          <div className="mt-5 grid gap-6">
            {[0, 1, 2].map((group) => (
              <div key={group}>
                <Line className="mb-3 h-3 w-24" />
                <div className="grid gap-2">
                  {[0, 1, 2].map((item) => (
                    <Line key={item} className="h-10 w-full bg-neutral-100" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <Line className="h-9 w-64" />
          <Line className="mt-3 h-5 w-80 max-w-full bg-neutral-100" />
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <EquipmentCardSkeleton key={item} />
            ))}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
