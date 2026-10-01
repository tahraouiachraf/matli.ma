import type { Category, ClientRequest, Company, Equipment, RentalHistoryItem } from "@/types";
import { categories, clientRequests, companies, equipment } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import { API_ORIGIN, apiRequest } from "@/services/api/client";

export type LaravelPaginator<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type ApiListResponse<T> = LaravelPaginator<T> | T[];

export type CatalogMeta = {
  cities: string[];
  brands: string[];
  models: string[];
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  authorName?: string;
};

type ApiNewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image_url?: string | null;
  published_at: string;
  updated_at: string;
  seo_title?: string | null;
  seo_description?: string | null;
  author?: { name: string } | null;
};

export type EquipmentSearchParams = {
  perPage?: number;
  q?: string;
  city?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  operator?: boolean;
  delivery?: boolean;
  verified?: boolean;
  brand?: string;
  model?: string;
  availableNow?: boolean;
  sort?: "recent" | "price_asc" | "price_desc" | "availability" | "proximity";
  nearCity?: string;
  page?: number;
};

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
  technical_condition?: "excellent" | "very_good" | "good" | "fair" | null;
  power_hp?: number | null;
  tonnage?: number | string | null;
  city: string;
  region: string | null;
  price_day: number;
  price_week: number | null;
  status: "available" | "reserved" | "rented" | "maintenance" | "unavailable";
  operator_available: boolean;
  delivery_available: boolean;
  delivery_terms?: string | null;
  is_sponsored?: boolean;
  image_url: string | null;
  images?: Array<{ id: string; url: string; position: number; is_primary: boolean }>;
  description: string | null;
  specs: string[] | null;
  category?: { name: string; slug: string };
  company?: { name: string; slug: string; city?: string; region?: string; is_verified?: boolean };
  availabilities?: Array<{
    id: string;
    reservation_id?: string | null;
    date_start: string;
    date_end: string;
    status: "reserved" | "maintenance" | "unavailable";
    reason: string | null;
  }>;
  moderation_status?: "draft" | "pending_review" | "approved" | "rejected";
  moderation_notes?: string | null;
  archived_at?: string | null;
  reviews_avg_rating?: number | string | null;
  reviews_count?: number;
  reviews?: Array<{ id: string; rating: number; comment: string | null; created_at: string; user?: { name: string } | null }>;
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
  status: "pending" | "confirmed" | "active" | "completed" | "rejected" | "cancelled";
  equipment?: { title: string; city?: string; image_url?: string | null; company?: { name: string } };
  status_histories?: Array<{
    id: string;
    from_status?: string | null;
    to_status: string;
    note?: string | null;
    created_at: string;
    actor?: { name: string } | null;
  }>;
};

export type WorkspaceDashboard = {
  stats: {
    equipment: number;
    available_equipment: number;
    reservations: number;
    pending_reservations: number;
    unread_notifications: number;
    active_reservations: number;
    overdue_reservations: number;
    maintenance_due: number;
    estimated_revenue: number;
  };
  alerts: Array<{ key: string; count: number; label: string; href: string }>;
  conversion: {
    period_days: number;
    searches: number;
    zero_result_searches: number;
    equipment_views: number;
    reservation_requests: number;
    confirmed_reservations: number;
    view_to_request_rate: number;
    request_to_confirmation_rate: number;
    top_zero_result_searches: Array<{ query: string; count: number }>;
  };
  recent_reservations: ApiReservation[];
};

const imageFallbacks = [
  "/equipment/jcb-3cx-yard.jpg",
  "/equipment/jcb-3cx-studio.jpg",
  "/equipment/jcb-telescopic-site.jpg",
  "/equipment/jcb-excavator-quarry.jpg",
];

const categoryImages: Record<string, string> = {
  "tractopelles": "/equipment/jcb-3cx-yard.jpg",
  "mini-pelles": "/equipment/jcb-excavator-quarry.jpg",
  "chariots-telescopiques": "/equipment/jcb-telescopic-site.jpg",
  "nacelles-telescopiques-articules": "/equipment/jcb-telescopic-site.jpg",
  "grues": "/equipment/jcb-telescopic-site.jpg",
  "pelles-sur-chenilles": "/equipment/jcb-excavator-quarry.jpg",
  "chargeuses-sur-pneumatiques": "/equipment/jcb-3cx-studio.jpg",
};

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

function listData<T>(payload: ApiListResponse<T>) {
  return Array.isArray(payload) ? payload : payload.data;
}

function mapNewsArticle(article: ApiNewsArticle): NewsArticle {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    imageUrl: article.image_url ? localImage(article.image_url) : undefined,
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
    seoTitle: article.seo_title ?? undefined,
    seoDescription: article.seo_description ?? undefined,
    authorName: article.author?.name ?? undefined,
  };
}

function stableNumericId(value: string, fallback: number) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) || fallback;
}

export function mapEquipment(item: ApiEquipment, index = 0): Equipment {
  const images = Array.from(new Set(
    [item.image_url, ...(item.images ?? []).sort((first, second) => first.position - second.position).map((image) => image.url)]
      .filter((url): url is string => Boolean(url))
      .map((url, imageIndex) => localImage(url, imageIndex)),
  ));
  const primaryImage = images[0] ?? localImage(null, index);

  return {
    id: stableNumericId(item.id, index + 1),
    backendId: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category?.name ?? "Machine BTP",
    brand: item.brand ?? "Marque",
    model: item.model ?? "Modèle",
    year: item.year ?? new Date().getFullYear(),
    technicalCondition: item.technical_condition ?? undefined,
    powerHp: item.power_hp ?? undefined,
    tonnage: item.tonnage == null ? undefined : Number(item.tonnage),
    city: item.city,
    region: item.region ?? item.company?.region ?? "Maroc",
    priceDay: item.price_day,
    priceWeek: item.price_week ?? item.price_day * 6,
    status: statusMap[item.status] ?? "AVAILABLE",
    rating: item.reviews_avg_rating ? Number(item.reviews_avg_rating) : 0,
    operator: Boolean(item.operator_available),
    delivery: Boolean(item.delivery_available),
    deliveryTerms: item.delivery_terms ?? undefined,
    sponsored: Boolean(item.is_sponsored),
    image: primaryImage,
    images: images.length ? images : [primaryImage],
    companySlug: item.company?.slug ?? "proprietaire",
    companyName: item.company?.name ?? "Propriétaire MATLI",
    companyVerified: Boolean(item.company?.is_verified),
    description: item.description ?? "Machine disponible à la location via MATLI.ma.",
    specs: item.specs?.length ? item.specs : ["Prix journalier", "Disponibilité", "Contact propriétaire"],
    reviews: item.reviews?.map((review) => ({ id: review.id, rating: review.rating, comment: review.comment, author: review.user?.name ?? "Client MATLI", createdAt: review.created_at })) ?? [],
    reviewsCount: item.reviews_count ?? item.reviews?.length ?? 0,
    moderationStatus: item.moderation_status,
    moderationNotes: item.moderation_notes,
    archivedAt: item.archived_at,
    availabilityPeriods: item.availabilities?.map((period) => ({
      id: period.id,
      reservationId: period.reservation_id,
      dateStart: period.date_start,
      dateEnd: period.date_end,
      status: period.status,
      reason: period.reason,
    })) ?? [],
  };
}

function mapCategory(item: ApiCategory, index = 0): Category {
  return {
    name: item.name,
    slug: item.slug,
    description: item.description ?? "Catégorie de matériel BTP disponible à la location.",
    image: categoryImages[item.slug] ?? imageFallbacks[index % imageFallbacks.length],
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
    dateRange: formatDateRange(item.date_start, item.date_end),
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

export function getEquipmentList(params?: EquipmentSearchParams) {
  return safeApi(() => getEquipmentListStrict(params), []);
}

export function getEquipmentListStrict(params?: EquipmentSearchParams) {
  return getEquipmentPageStrict(params).then((payload) => payload.items);
}

export function getEquipmentPageStrict(params?: EquipmentSearchParams) {
  const search = new URLSearchParams();
  if (params?.perPage) search.set("per_page", String(params.perPage));
  if (params?.q) search.set("q", params.q);
  if (params?.city) search.set("city", params.city);
  if (params?.category) search.set("category", params.category);
  if (params?.status) search.set("status", params.status);
  if (params?.minPrice !== undefined) search.set("min_price", String(params.minPrice));
  if (params?.maxPrice !== undefined) search.set("max_price", String(params.maxPrice));
  if (params?.operator !== undefined) search.set("operator", params.operator ? "1" : "0");
  if (params?.delivery) search.set("delivery", "1");
  if (params?.verified) search.set("verified", "1");
  if (params?.brand) search.set("brand", params.brand);
  if (params?.model) search.set("model", params.model);
  if (params?.availableNow) search.set("available_now", "1");
  if (params?.sort) search.set("sort", params.sort);
  if (params?.nearCity) search.set("near_city", params.nearCity);
  if (params?.page) search.set("page", String(params.page));

  return (async () => {
    const payload = await apiRequest<ApiListResponse<ApiEquipment>>(`/equipment?${search.toString()}`);
    if (Array.isArray(payload)) {
      return { items: payload.map(mapEquipment), currentPage: 1, lastPage: 1, total: payload.length, perPage: payload.length };
    }
    return {
      items: payload.data.map(mapEquipment),
      currentPage: payload.current_page,
      lastPage: payload.last_page,
      total: payload.total,
      perPage: payload.per_page,
    };
  })();
}

export type SearchSuggestions = {
  machines: Array<{ title: string; brand?: string | null; model?: string | null; slug: string; city: string }>;
  brands: string[];
  cities: string[];
  categories: Array<{ name: string; slug: string }>;
};

export function getSearchSuggestions(query: string) {
  return apiRequest<SearchSuggestions>(`/search/suggestions?q=${encodeURIComponent(query)}`);
}

export function getCatalogMetaStrict() {
  return apiRequest<CatalogMeta & Record<string, unknown>>("/meta");
}

export function getNewsArticlesStrict(perPage = 12) {
  return apiRequest<ApiListResponse<ApiNewsArticle>>(`/news?per_page=${perPage}`)
    .then((payload) => listData(payload).map(mapNewsArticle));
}

export function getNewsArticleStrict(slug: string) {
  return apiRequest<ApiNewsArticle>(`/news/${encodeURIComponent(slug)}`).then(mapNewsArticle);
}

function mapRental(reservation: ApiReservation): RentalHistoryItem {
  return {
    id: reservation.reference,
    backendId: reservation.id,
    equipmentTitle: reservation.equipment?.title ?? "Machine BTP",
    companyName: reservation.client_name ?? reservation.equipment?.company?.name ?? "Compte MATLI",
    city: reservation.equipment?.city ?? "Maroc",
    dateStart: reservation.date_start ?? undefined,
    dateEnd: reservation.date_end ?? undefined,
    period: formatDateRange(reservation.date_start, reservation.date_end),
    total: reservation.total_amount,
    status:
      reservation.status === "completed"
        ? "COMPLETED"
        : reservation.status === "active"
          ? "ONGOING"
          : reservation.status === "rejected"
            ? "REJECTED"
          : reservation.status === "cancelled"
            ? "CANCELLED"
            : "RESERVED",
    image: localImage(reservation.equipment?.image_url),
    statusKey: reservation.status,
    statusHistory: reservation.status_histories?.map((history) => ({
      id: history.id,
      fromStatus: history.from_status,
      toStatus: history.to_status,
      note: history.note,
      actorName: history.actor?.name ?? "Système MATLI",
      createdAt: history.created_at,
    })) ?? [],
  };
}

export type EquipmentBlockedPeriod = {
  dateStart: string;
  dateEnd: string;
  status: "reserved" | "confirmed" | "active" | "maintenance" | "unavailable";
};

type EquipmentAvailabilityResponse = {
  availability: Array<{ date_start: string; date_end: string; status: EquipmentBlockedPeriod["status"] }>;
  reservations: Array<{ date_start: string; date_end: string; status: "confirmed" | "active" }>;
};

export function getEquipmentBlockedPeriods(equipmentSlug: string) {
  return apiRequest<EquipmentAvailabilityResponse>(`/equipment/${equipmentSlug}/availability`).then((payload) => {
    const periods = [...payload.availability, ...payload.reservations].map((period) => ({
      dateStart: period.date_start,
      dateEnd: period.date_end,
      status: period.status,
    }));

    return periods.filter((period, index) => periods.findIndex((candidate) =>
      candidate.dateStart === period.dateStart && candidate.dateEnd === period.dateEnd,
    ) === index);
  });
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
  technical_condition?: "excellent" | "very_good" | "good" | "fair";
  power_hp?: number;
  tonnage?: number;
  city: string;
  region?: string;
  price_day: number;
  price_week?: number;
  status: ApiEquipment["status"];
  image_url?: string;
  image_urls?: string[];
  description?: string;
  operator_available?: boolean;
  delivery_available?: boolean;
  delivery_terms?: string;
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

export function updateWorkspaceEquipment(id: string, payload: CreateEquipmentPayload, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<ApiEquipment>(`/workspace/equipment/${id}`, { method: "PUT", token, body: JSON.stringify(payload) }).then(mapEquipment);
}

export function deleteWorkspaceEquipment(id: string, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string }>(`/workspace/equipment/${id}`, { method: "DELETE", token });
}

export function changeWorkspaceEquipmentState(id: string, action: "archive" | "restore" | "submit", token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string; equipment: ApiEquipment }>(`/workspace/equipment/${id}/${action}`, { method: "PATCH", token })
    .then((response) => ({ message: response.message, equipment: mapEquipment(response.equipment) }));
}

export type CreateReservationPayload = {
  equipment_id: string;
  date_start: string;
  date_end: string;
  client_name: string;
  client_phone: string;
  notes?: string;
};

export function createReservation(payload: CreateReservationPayload, token?: string | null) {
  if (!token) throw new Error("Connectez-vous pour réserver ce matériel.");

  return apiRequest<{
    id: string;
    reference: string;
    status: ApiReservation["status"];
    total_amount: number;
    message: string;
    quote: { days: number; price_day: number; total_amount: number };
  }>("/reservations", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function uploadEquipmentImage(file: File, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");

  const body = new FormData();
  body.append("image", file);

  return apiRequest<{ url: string; variants: Record<string, string> }>("/workspace/equipment/images", {
    method: "POST",
    token,
    body,
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

export function getClientReservationsStrict(token?: string | null) {
  if (!token) return Promise.resolve<RentalHistoryItem[]>([]);
  return apiRequest<ApiListResponse<ApiReservation>>("/client/reservations?per_page=30", { token }).then((payload) => listData(payload).map(mapRental));
}

export function cancelClientReservation(id: string, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string; reservation: ApiReservation }>(`/client/reservations/${id}/cancel`, { method: "PATCH", token })
    .then((response) => ({ message: response.message, reservation: mapRental(response.reservation) }));
}

export function updateReservationStatus(id: string, status: "confirmed" | "active" | "completed" | "rejected" | "cancelled", token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string; reservation: ApiReservation }>(`/workspace/reservations/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  }).then((response) => ({ message: response.message, reservation: mapRental(response.reservation) }));
}

export function reportEquipment(
  equipmentId: string,
  payload: { reason: "duplicate" | "fraud" | "unavailable" | "inappropriate" | "other"; details?: string },
  token?: string | null,
) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string }>(`/equipment/${equipmentId}/reports`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export type AccountProfile = {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string | null;
  city?: string | null;
  company_name?: string | null;
  description?: string | null;
  roles?: Array<{ id?: string; name: string; description?: string | null }>;
};

export function updateAccountProfile(payload: Pick<AccountProfile, "name" | "email" | "phone" | "city" | "company_name" | "description">, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string; verification_required: boolean; user: AccountProfile }>("/account/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export type AccountNotification = {
  id: string;
  title: string;
  body: string;
  type: string;
  read_at: string | null;
  created_at: string;
};

export type NotificationPreferences = {
  email_enabled: boolean;
  app_enabled: boolean;
  reservation_updates: boolean;
  important_alerts: boolean;
  marketing: boolean;
};

export function getNotificationCenter(token?: string | null) {
  if (!token) return Promise.resolve({ unreadCount: 0, notifications: [] as AccountNotification[] });
  return apiRequest<{ unread_count: number; notifications: LaravelPaginator<AccountNotification> }>("/notifications?per_page=40", { token })
    .then((payload) => ({ unreadCount: payload.unread_count, notifications: payload.notifications.data }));
}

export function markNotificationRead(id: string, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string; notification: AccountNotification }>(`/notifications/${id}/read`, { method: "PATCH", token });
}

export function markNotificationsRead(token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string }>("/notifications/read-all", { method: "PATCH", token });
}

export function getNotificationPreferences(token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<NotificationPreferences>("/notification-preferences", { token });
}

export function updateNotificationPreferences(preferences: NotificationPreferences, token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string; preferences: NotificationPreferences }>("/notification-preferences", {
    method: "PUT", token, body: JSON.stringify(preferences),
  });
}

export function getClientNotifications(token?: string | null) {
  if (!token) return Promise.resolve<AccountNotification[]>([]);
  return apiRequest<ApiListResponse<AccountNotification>>("/client/notifications?per_page=40", { token }).then(listData);
}

export function markClientNotificationsRead(token?: string | null) {
  if (!token) throw new Error("Authentification requise.");
  return apiRequest<{ message: string }>("/client/notifications/read-all", { method: "PATCH", token });
}

export function requestPasswordReset(email: string) {
  return apiRequest<{ message: string }>("/auth/password/forgot", { method: "POST", body: JSON.stringify({ email }) });
}

export function resetPassword(payload: { email: string; token: string; password: string; password_confirmation: string }) {
  return apiRequest<{ message: string }>("/auth/password/reset", { method: "POST", body: JSON.stringify(payload) });
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

export function getSimilarEquipment(slug: string) {
  return apiRequest<ApiEquipment[]>(`/equipment/${slug}/similar`).then((payload) => payload.map(mapEquipment));
}

export function getCompanies() {
  return safeApi(async () => {
    const payload = await apiRequest<ApiListResponse<ApiCompany>>("/companies?per_page=30");
    return listData(payload).map(mapCompany);
  }, []);
}

export function getCompaniesStrict() {
  return apiRequest<ApiListResponse<ApiCompany>>("/companies?per_page=30")
    .then((payload) => listData(payload).map(mapCompany));
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
  if (!payload?.recent_reservations?.length) return [];

  return payload.recent_reservations.map(mapRental);
}
