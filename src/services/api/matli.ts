import type { Category, ClientRequest, Company, Equipment, RentalHistoryItem } from "@/types";
import { categories, clientRequests, companies, equipment, rentalHistory } from "@/lib/data";
import { API_ORIGIN, apiRequest } from "@/services/api/client";

type LaravelPaginator<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type ApiListResponse<T> = LaravelPaginator<T> | T[];

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

type ApiCompany = {
  id?: string;
  slug: string;
  name: string;
  city: string | null;
  region: string | null;
  description: string | null;
  is_verified?: boolean;
  equipment_count?: number;
  equipment?: ApiEquipment[];
};

type ApiEquipment = {
  id: string;
  slug: string;
  title: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  city: string;
  region: string | null;
  price_day: number;
  price_week: number | null;
  status: "available" | "reserved" | "rented" | "maintenance" | "unavailable";
  operator_available: boolean;
  delivery_available: boolean;
  is_sponsored?: boolean;
  image_url: string | null;
  description: string | null;
  specs: string[] | null;
  category?: { name: string; slug: string };
  company?: { name: string; slug: string; city?: string; region?: string; is_verified?: boolean };
  availabilities?: Array<{ id: string; date_start: string; date_end: string; status: string; reason: string | null }>;
};

type ApiRentalRequest = {
  id: string;
  reference: string;
  machine: string;
  city: string;
  date_start?: string | null;
  date_end?: string | null;
  budget_day: number | null;
  client_name?: string | null;
  client_phone?: string | null;
  client_email?: string | null;
  status: "open" | "quoted" | "reserved" | "closed" | "cancelled";
};

type ApiReservation = {
  id: string;
  reference: string;
  client_name?: string | null;
  date_start: string;
  date_end: string;
  total_amount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  equipment?: { title: string; city?: string; image_url?: string | null };
};

type WorkspaceDashboard = {
  stats: {
    equipment: number;
    available_equipment: number;
    reservations: number;
    pending_reservations: number;
    unread_notifications: number;
  };
  recent_reservations: ApiReservation[];
};

const imageFallbacks = [
  "/equipment/jcb-3cx-yard.jpg",
  "/equipment/jcb-3cx-studio.jpg",
  "/equipment/jcb-telescopic-site.jpg",
  "/equipment/jcb-excavator-quarry.jpg",
];

const statusMap: Record<ApiEquipment["status"], Equipment["status"]> = {
  available: "AVAILABLE",
  reserved: "RESERVED",
  rented: "RENTED",
  maintenance: "MAINTENANCE",
  unavailable: "UNAVAILABLE",
};

const requestStatusMap: Record<ApiRentalRequest["status"], ClientRequest["status"]> = {
  open: "OPEN",
  quoted: "QUOTED",
  reserved: "RESERVED",
  closed: "RESERVED",
  cancelled: "RESERVED",
};

function localImage(url: string | null | undefined, index = 0) {
  if (!url) return imageFallbacks[index % imageFallbacks.length];
  if (url.includes("default-machine")) return imageFallbacks[index % imageFallbacks.length];
  const optimizedUrl = url
    .replace("jcb-3cx-yard.png", "jcb-3cx-yard.jpg")
    .replace("jcb-3cx-studio.png", "jcb-3cx-studio.jpg")
    .replace("jcb-telescopic-site.png", "jcb-telescopic-site.jpg")
    .replace("jcb-excavator-quarry.png", "jcb-excavator-quarry.jpg");
  if (optimizedUrl.startsWith("/storage/")) return `${API_ORIGIN}${optimizedUrl}`;
  return optimizedUrl;
}

function dateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "Dates à confirmer";
  if (!start || !end) return start ?? end ?? "Dates à confirmer";
  return `${start} - ${end}`;
}

function listData<T>(payload: ApiListResponse<T>) {
  return Array.isArray(payload) ? payload : payload.data;
}

export function mapEquipment(item: ApiEquipment, index = 0): Equipment {
  return {
    id: Number.parseInt(item.id.replace(/\D/g, "").slice(0, 8), 10) || index + 1,
    backendId: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category?.name ?? "Machine BTP",
    brand: item.brand ?? "Marque",
    model: item.model ?? "Modèle",
    year: item.year ?? new Date().getFullYear(),
    city: item.city,
    region: item.region ?? item.company?.region ?? "Maroc",
    priceDay: item.price_day,
    priceWeek: item.price_week ?? item.price_day * 6,
    status: statusMap[item.status] ?? "AVAILABLE",
    rating: item.company?.is_verified ? 4.8 : 4.4,
    operator: Boolean(item.operator_available),
    delivery: Boolean(item.delivery_available),
    sponsored: Boolean(item.is_sponsored),
    image: localImage(item.image_url, index),
    companySlug: item.company?.slug ?? "proprietaire",
    companyName: item.company?.name ?? "Propriétaire MATLI",
    companyVerified: Boolean(item.company?.is_verified),
    description: item.description ?? "Machine disponible à la location via MATLI.ma.",
    specs: item.specs?.length ? item.specs : ["Prix journalier", "Disponibilité", "Contact propriétaire"],
  };
}

function mapCategory(item: ApiCategory, index = 0): Category {
  return {
    name: item.name,
    slug: item.slug,
    description: item.description ?? "Catégorie de matériel BTP disponible à la location.",
    image: imageFallbacks[index % imageFallbacks.length],
    icon: item.icon ?? "Package",
    seoTitle: `Location ${item.name} au Maroc | MATLI`,
    metaDescription: item.description ?? `Comparez les offres de ${item.name} à louer au Maroc.`,
  };
}

function mapCompany(item: ApiCompany): Company {
  return {
    slug: item.slug,
    name: item.name,
    city: item.city ?? "Maroc",
    region: item.region ?? "Maroc",
    logo: item.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    rating: item.is_verified ? 4.8 : 4.4,
    equipmentCount: item.equipment_count ?? 0,
    description: item.description ?? "Propriétaire de machines BTP sur MATLI.ma.",
  };
}

function mapRequest(item: ApiRentalRequest): ClientRequest {
  return {
    id: item.reference,
    machine: item.machine,
    city: item.city,
    dateRange: dateRange(item.date_start, item.date_end),
    budgetDay: item.budget_day ?? 0,
    contact: "Client marketplace",
    status: requestStatusMap[item.status] ?? "OPEN",
  };
}

async function safeApi<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}

export function getCategories() {
  return safeApi(async () => (await apiRequest<ApiCategory[]>("/categories")).map(mapCategory), categories);
}

export function getCategoriesStrict() {
  return apiRequest<ApiCategory[]>("/categories").then((payload) => payload.map(mapCategory));
}

export function getEquipmentList(params?: { perPage?: number; city?: string; category?: string; status?: string }) {
  return safeApi(() => getEquipmentListStrict(params), []);
}

export function getEquipmentListStrict(params?: { perPage?: number; city?: string; category?: string; status?: string }) {
  const search = new URLSearchParams();
  if (params?.perPage) search.set("per_page", String(params.perPage));
  if (params?.city) search.set("city", params.city);
  if (params?.category) search.set("category", params.category);
  if (params?.status) search.set("status", params.status);

  return (async () => {
    const payload = await apiRequest<ApiListResponse<ApiEquipment>>(`/equipment?${search.toString()}`);
    return listData(payload).map(mapEquipment);
  })();
}

function mapRental(reservation: ApiReservation): RentalHistoryItem {
  return {
    id: reservation.reference,
    backendId: reservation.id,
    equipmentTitle: reservation.equipment?.title ?? "Machine BTP",
    companyName: reservation.client_name ?? "Client réservation",
    city: reservation.equipment?.city ?? "Maroc",
    period: dateRange(reservation.date_start, reservation.date_end),
    total: reservation.total_amount,
    status:
      reservation.status === "completed"
        ? "COMPLETED"
        : reservation.status === "active"
          ? "ONGOING"
          : reservation.status === "cancelled"
            ? "CANCELLED"
            : "RESERVED",
    image: localImage(reservation.equipment?.image_url),
  };
}

export function getWorkspaceEquipment(token?: string | null) {
  if (!token) return Promise.resolve<Equipment[]>([]);

  return safeApi(() => getWorkspaceEquipmentStrict(token), []);
}

export function getWorkspaceEquipmentStrict(token?: string | null) {
  if (!token) return Promise.resolve<Equipment[]>([]);

  return apiRequest<ApiListResponse<ApiEquipment>>("/workspace/equipment?per_page=30", { token }).then((payload) => listData(payload).map(mapEquipment));
}

export type CreateEquipmentPayload = {
  category_slug: string;
  title: string;
  brand?: string;
  model?: string;
  year?: number;
  city: string;
  region?: string;
  price_day: number;
  price_week?: number;
  status: ApiEquipment["status"];
  image_url?: string;
  description?: string;
  operator_available?: boolean;
  delivery_available?: boolean;
  is_sponsored?: boolean;
  specs?: string[];
};

export function createWorkspaceEquipment(payload: CreateEquipmentPayload, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");

  return apiRequest<ApiEquipment>("/workspace/equipment", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  }).then((item) => mapEquipment(item));
}

export type CreateReservationPayload = {
  equipment_id: string;
  date_start: string;
  date_end: string;
  client_name: string;
  client_phone: string;
  notes?: string;
};

export function createReservation(payload: CreateReservationPayload) {
  return apiRequest<{
    id: string;
    reference: string;
    status: ApiReservation["status"];
    total_amount: number;
    message: string;
  }>("/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type CreateRentalRequestPayload = {
  machine: string;
  city: string;
  date_start?: string;
  date_end?: string;
  budget_day?: number;
  client_name: string;
  client_phone: string;
  client_email?: string;
  message?: string;
};

export function createRentalRequest(payload: CreateRentalRequestPayload) {
  return apiRequest<{
    id: string;
    reference: string;
    status: ApiRentalRequest["status"];
    message: string;
  }>("/rental-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response) =>
    mapRequest({
      id: response.id,
      reference: response.reference,
      machine: payload.machine,
      city: payload.city,
      date_start: payload.date_start,
      date_end: payload.date_end,
      budget_day: payload.budget_day ?? null,
      client_name: payload.client_name,
      client_phone: payload.client_phone,
      client_email: payload.client_email,
      status: response.status,
    }),
  );
}

export function getWorkspaceReservations(token?: string | null) {
  if (!token) return Promise.resolve<RentalHistoryItem[]>([]);

  return safeApi(() => getWorkspaceReservationsStrict(token), []);
}

export function getWorkspaceReservationsStrict(token?: string | null) {
  if (!token) return Promise.resolve<RentalHistoryItem[]>([]);

  return apiRequest<ApiListResponse<ApiReservation>>("/workspace/reservations?per_page=30", { token }).then((payload) => listData(payload).map(mapRental));
}

export function getWorkspaceCollection<T = Record<string, unknown>>(endpoint: string, token?: string | null) {
  if (!token) return Promise.resolve<T[]>([]);

  return safeApi(() => getWorkspaceCollectionStrict<T>(endpoint, token), []);
}

export function getWorkspaceCollectionStrict<T = Record<string, unknown>>(endpoint: string, token?: string | null) {
  if (!token) return Promise.resolve<T[]>([]);

  return apiRequest<T[] | LaravelPaginator<T>>(`/workspace/${endpoint}`, { token }).then((payload) => Array.isArray(payload) ? payload : payload.data);
}

export type WorkspaceCrudPayload = Record<string, string | number | boolean | null | undefined>;

export function createWorkspaceItem<T = Record<string, unknown>>(endpoint: string, payload: WorkspaceCrudPayload, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");

  return apiRequest<T>(`/workspace/${endpoint}`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateWorkspaceItem<T = Record<string, unknown>>(endpoint: string, id: string, payload: WorkspaceCrudPayload, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");

  return apiRequest<T>(`/workspace/${endpoint}/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteWorkspaceItem(endpoint: string, id: string, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");

  return apiRequest<{ message: string }>(`/workspace/${endpoint}/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getEquipmentDetail(slug: string) {
  return safeApi(async () => mapEquipment(await apiRequest<ApiEquipment>(`/equipment/${slug}`)), null);
}

export function getEquipmentDetailStrict(slug: string) {
  return apiRequest<ApiEquipment>(`/equipment/${slug}`).then((payload) => mapEquipment(payload));
}

export function getCompanies() {
  return safeApi(async () => {
    const payload = await apiRequest<ApiListResponse<ApiCompany>>("/companies?per_page=30");
    return listData(payload).map(mapCompany);
  }, []);
}

export function getCompanyDetail(slug: string) {
  return safeApi(async () => {
    const payload = await apiRequest<ApiCompany>(`/companies/${slug}`);
    return {
      company: mapCompany(payload),
      equipment: (payload.equipment ?? []).map(mapEquipment),
    };
  }, (() => {
    const company = companies.find((item) => item.slug === slug) ?? null;
    return {
      company,
      equipment: company ? equipment.filter((item) => item.companySlug === slug) : [],
    };
  })());
}

export function getCompanyDetailStrict(slug: string) {
  return apiRequest<ApiCompany>(`/companies/${slug}`).then((payload) => ({
    company: mapCompany(payload),
    equipment: (payload.equipment ?? []).map(mapEquipment),
  }));
}

export function getMarketplaceRequests() {
  return safeApi(async () => {
    const payload = await apiRequest<ApiListResponse<ApiRentalRequest>>("/marketplace/requests?per_page=6");
    return listData(payload).map(mapRequest);
  }, clientRequests);
}

export function getMarketplaceRequestsStrict() {
  return apiRequest<ApiListResponse<ApiRentalRequest>>("/marketplace/requests?per_page=6").then((payload) => listData(payload).map(mapRequest));
}

export async function getWorkspaceDashboard(token?: string | null) {
  if (!token) return null;
  return safeApi(() => getWorkspaceDashboardStrict(token), null);
}

export async function getWorkspaceDashboardStrict(token?: string | null) {
  if (!token) return null;
  return apiRequest<WorkspaceDashboard>("/workspace/dashboard", { token });
}

export function mapWorkspaceRentals(payload: WorkspaceDashboard | null): RentalHistoryItem[] {
  if (!payload?.recent_reservations?.length) return rentalHistory;

  return payload.recent_reservations.map(mapRental);
}
