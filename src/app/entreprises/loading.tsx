export default function CompaniesLoading() {
  return (
    <div aria-busy="true" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="sr-only" role="status">Chargement des entreprises</p>
      <div className="h-40 animate-pulse rounded-md bg-neutral-100" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-md border border-neutral-200 bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
