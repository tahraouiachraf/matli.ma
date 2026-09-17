"use client";

import { API_URL } from "@/services/api/client";

export type CommercialEventName =
  | "search_performed"
  | "search_no_results"
  | "equipment_viewed"
  | "rental_request_sent"
  | "reservation_requested"
  | "reservation_confirmed";

type CommercialEventPayload = {
  equipmentId?: string;
  searchQuery?: string;
  city?: string;
  category?: string;
  resultCount?: number;
  pagePath?: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

function analyticsAccepted() {
  return typeof window !== "undefined" && localStorage.getItem("matli-cookie-consent") === "accepted";
}

function sessionId() {
  const key = "matli-analytics-session";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(key, created);
  return created;
}

export function trackCommercialEvent(
  eventName: CommercialEventName,
  payload: CommercialEventPayload = {},
  options: { persist?: boolean } = {},
) {
  if (!analyticsAccepted()) return;

  window.gtag?.("event", eventName, {
    equipment_id: payload.equipmentId,
    search_term: payload.searchQuery,
    city: payload.city,
    category: payload.category,
    result_count: payload.resultCount,
    page_path: payload.pagePath ?? window.location.pathname + window.location.search,
    ...payload.properties,
  });

  if (options.persist === false) return;

  void fetch(`${API_URL}/analytics/events`, {
    method: "POST",
    keepalive: true,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: eventName,
      session_id: sessionId(),
      equipment_id: payload.equipmentId,
      search_query: payload.searchQuery,
      city: payload.city,
      category: payload.category,
      result_count: payload.resultCount,
      page_path: payload.pagePath ?? window.location.pathname + window.location.search,
      properties: payload.properties,
    }),
  }).catch(() => undefined);
}
