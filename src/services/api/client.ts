import * as Sentry from "@sentry/nextjs";
import { clearPublicApiCache, publicApiCachePolicy, withPublicApiCache } from "@/services/api/cache";

const DEFAULT_API_URL = "https://admin.matli.ma/api";
// const DEFAULT_API_URL = "http://127.0.0.1:8000/api";

const configuredApiUrl = process.env.API_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
const DIRECT_API_URL = /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl.replace(/\/$/, "")
  : DEFAULT_API_URL;
// The hosting WAF blocks the Next.js API proxy. Laravel already exposes a strict
// CORS policy for matli.ma, so browser and server requests use the same origin.
export const API_URL = DIRECT_API_URL;
// export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
export const API_ORIGIN = DIRECT_API_URL.replace(/\/api\/?$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  token?: string;
};

type ApiErrorPayload = {
  data?: unknown;
  success?: boolean;
  message?: string;
  errors?: Record<string, string | string[]>;
};

function firstValidationError(errors?: ApiErrorPayload["errors"]): string | undefined {
  if (!errors) return undefined;

  for (const value of Object.values(errors)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (!message) continue;
    return message.startsWith("validation.")
      ? "Merci de vérifier les informations saisies."
      : message;
  }

  return undefined;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;
  const method = (init.method ?? "GET").toUpperCase();
  const cachePolicy = !token && method === "GET" ? publicApiCachePolicy(endpoint) : null;

  const execute = async (): Promise<T> => {
    let response: Response;

    try {
      const fetchOptions = {
        ...init,
        ...(cachePolicy && typeof window === "undefined"
          ? { cache: "force-cache" as const, next: { revalidate: Math.max(1, Math.floor(cachePolicy.freshForMs / 1000)) } }
          : {}),
        headers: {
          Accept: "application/json",
          ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      };
      response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    } catch {
      throw new ApiError("Service momentanément indisponible. Merci de réessayer dans quelques instants.", 0);
    }

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json().catch(() => null) as ApiErrorPayload | null
      : null;

    if (!response.ok || payload?.success === false) {
      if (response.status >= 500) {
        Sentry.captureMessage("Erreur API MATLI", {
          level: "error",
          tags: { api_status: String(response.status) },
          extra: { endpoint, method },
        });
      }
      throw new ApiError(firstValidationError(payload?.errors) ?? payload?.message ?? "Une erreur est survenue.", response.status);
    }

    if (payload === null) {
      throw new ApiError("Réponse temporairement invalide. Merci de réessayer.", response.status);
    }

    if (method !== "GET") clearPublicApiCache();

    return (payload?.data ?? payload) as T;
  };

  if (!cachePolicy) return execute();

  return withPublicApiCache(
    `${API_URL}${endpoint}`,
    cachePolicy,
    execute,
    (error) => error instanceof ApiError && (error.status === 0 || error.status >= 500),
  );
}
