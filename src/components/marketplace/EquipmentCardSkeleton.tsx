export function EquipmentCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-md border border-neutral-200 bg-white">
      <div className="h-52 animate-pulse bg-neutral-100 sm:h-56" />
      <div className="grid gap-4 p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-orange-100" />
        <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="grid gap-2">
          <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-24 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-7 w-24 animate-pulse rounded-md bg-neutral-100" />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="grid flex-1 gap-2">
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
            <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-md bg-neutral-200" />
        </div>
      </div>
    </article>
  );
}
