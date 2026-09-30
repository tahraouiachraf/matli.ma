export default function EquipmentDetailLoading() {
  return (
    <div className="bg-white">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <div className="h-[420px] animate-pulse rounded-xl bg-neutral-100" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-6">
          <div className="h-6 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="mt-5 h-10 w-64 animate-pulse rounded bg-neutral-200" />
          <div className="mt-4 h-5 w-52 animate-pulse rounded bg-neutral-100" />
          <div className="mt-8 h-9 w-40 animate-pulse rounded bg-neutral-200" />
          <div className="mt-6 grid gap-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-5 w-56 animate-pulse rounded bg-neutral-100" />
            ))}
          </div>
          <div className="mt-8 grid gap-3">
            <div className="h-12 animate-pulse rounded-xl bg-neutral-200" />
            <div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
          </div>
        </aside>
      </section>
    </div>
  );
}
