export function filterHref(active: Record<string, string | undefined>, patch: Record<string, string | null>) {
  const params = new URLSearchParams();

  Object.entries(active).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  Object.entries(patch).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });

  const query = params.toString();
  return query ? `/location?${query}` : "/location";
}
