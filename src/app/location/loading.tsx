import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";

export default function LocationLoading() {
  return (
    <div>
      <section className="bg-neutral-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-11 max-w-xl animate-pulse rounded-xl bg-white/15" />
          <div className="mt-4 h-6 max-w-2xl animate-pulse rounded-xl bg-white/10" />
          <div className="mt-8">
            <MarketplaceSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <div className="size-10 animate-pulse rounded-xl bg-orange-100" />
            <div className="grid flex-1 gap-2">
              <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
          <div className="mt-5 grid gap-6">
            {[0, 1, 2, 3].map((group) => (
              <div key={group}>
                <div className="mb-3 h-3 w-24 animate-pulse rounded bg-neutral-200" />
                <div className="grid gap-2">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="h-11 animate-pulse rounded-xl bg-neutral-100" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div>
          <div className="h-8 w-64 animate-pulse rounded-xl bg-neutral-200" />
          <div className="mt-3 h-5 max-w-xl animate-pulse rounded-xl bg-neutral-100" />
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <article key={item} className="overflow-hidden rounded-md border border-neutral-200 bg-white">
                <div className="h-52 animate-pulse bg-neutral-100 sm:h-56" />
                <div className="grid gap-4 p-5">
                  <div className="h-4 w-28 animate-pulse rounded bg-orange-100" />
                  <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
                  <div className="flex items-end justify-between gap-4">
                    <div className="grid flex-1 gap-2">
                      <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
                      <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />
                    </div>
                    <div className="h-11 w-36 animate-pulse rounded-md bg-neutral-200" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
