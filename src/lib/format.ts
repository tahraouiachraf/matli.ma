export function formatDh(amount: number) {
  return `${new Intl.NumberFormat("fr-MA", {
    maximumFractionDigits: 0,
  }).format(amount)} DH`;
}

export function absoluteUrl(path = "") {
  return `https://matli.ma${path}`;
}
