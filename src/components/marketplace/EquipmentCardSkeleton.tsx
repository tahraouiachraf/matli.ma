export function EquipmentCardSkeleton() {
  return (
    <article aria-hidden className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="aspect-[16/10] animate-pulse bg-neutral-100" />
      <div className="grid gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-28 animate-pulse rounded bg-orange-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-emerald-50" />
        </div>
        <div className="h-6 w-3/5 animate-pulse rounded bg-neutral-200" />
        <div className="grid gap-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-neutral-100 pt-4">
          <div className="grid flex-1 gap-2">
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
            <div className="h-7 w-28 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="h-11 w-32 animate-pulse rounded-md bg-orange-100" />
        </div>
      </div>
    </article>
  );
}
