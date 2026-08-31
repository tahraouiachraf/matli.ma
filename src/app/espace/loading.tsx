export default function OwnerSpaceLoading() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-[72px_minmax(0,1fr)] gap-3 px-3 py-5 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-5 sm:px-5 sm:py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-10">
      <aside className="sticky top-20 h-[calc(100dvh-6rem)] rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm sm:p-3 lg:top-24">
        <div className="mb-3 h-14 animate-pulse rounded-xl bg-orange-50" />
        <div className="grid gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="h-11 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      </aside>
      <div className="min-w-0">
        <div className="h-9 w-56 animate-pulse rounded-xl bg-neutral-200" />
        <div className="mt-3 h-5 max-w-xl animate-pulse rounded bg-neutral-100" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-80 animate-pulse rounded-2xl bg-neutral-100" />
        </div>
      </div>
    </section>
  );
}
