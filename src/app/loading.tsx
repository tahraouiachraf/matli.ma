export default function GlobalLoading() {
  return (
    <div aria-busy="true" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <div className="h-5 w-32 animate-pulse rounded-full bg-neutral-200" />
          <div className="mt-5 h-12 max-w-2xl animate-pulse rounded-2xl bg-neutral-200" />
          <div className="mt-3 h-12 max-w-xl animate-pulse rounded-2xl bg-neutral-100" />
          <div className="mt-6 h-5 max-w-2xl animate-pulse rounded bg-neutral-100" />
          <div className="mt-2 h-5 max-w-lg animate-pulse rounded bg-neutral-100" />
          <div className="mt-8 flex gap-3">
            <div className="h-12 w-36 animate-pulse rounded-xl bg-neutral-200" />
            <div className="h-12 w-36 animate-pulse rounded-xl bg-neutral-100" />
          </div>
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-neutral-100" />
      </section>
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="size-10 animate-pulse rounded-xl bg-neutral-200" />
            <div className="mt-4 h-5 w-32 animate-pulse rounded bg-neutral-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-100" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </section>
    </div>
  );
}
