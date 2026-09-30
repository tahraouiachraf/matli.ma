export default function OwnerSpaceLoading() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-[60px_minmax(0,1fr)] gap-2 px-2 py-4 min-[380px]:grid-cols-[68px_minmax(0,1fr)] min-[380px]:gap-3 min-[380px]:px-3 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-5 sm:px-5 sm:py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-10">
      <aside className="sticky top-[4.5rem] h-[calc(100dvh-5.5rem)] rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm min-[380px]:p-2 sm:top-20 sm:rounded-2xl sm:p-3 lg:top-24">
        <div className="mb-3 h-14 animate-pulse rounded-xl bg-neutral-100" />
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
