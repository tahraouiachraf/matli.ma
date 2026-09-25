export function formatDh(amount: number) {
  return `${new Intl.NumberFormat("fr-MA", {
    maximumFractionDigits: 0,
  }).format(amount)} DH`;
}

const dateFormatter = new Intl.DateTimeFormat("fr-MA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-MA", {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "long",
  timeZone: "Africa/Casablanca",
  year: "numeric",
});

function parsedDate(value: string) {
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string | null) {
  if (!value) return "Date à confirmer";
  const date = parsedDate(value);
  return date ? dateFormatter.format(date) : value;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "À l’instant";
  const date = parsedDate(value);
  return date ? dateTimeFormatter.format(date) : value;
}

export function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "Dates à confirmer";
  if (!start || !end) return formatDate(start ?? end);
  if (start === end) return formatDate(start);
  return `Du ${formatDate(start)} au ${formatDate(end)}`;
}

export function absoluteUrl(path = "") {
  return `https://www.matli.ma${path}`;
}
