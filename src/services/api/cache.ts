type CachePolicy = {
  freshForMs: number;
  staleForMs: number;
};

type CacheEntry<T> = {
  value: T;
  storedAt: number;
  expiresAt: number;
  staleUntil: number;
};

const STORAGE_PREFIX = "matli-public-api-cache:v1:";
const STORAGE_INDEX_KEY = `${STORAGE_PREFIX}index`;
const MAX_PERSISTED_ENTRIES = 40;

const memoryCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();

function storageKey(key: string) {
  let hash = 2166136261;

  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${STORAGE_PREFIX}${(hash >>> 0).toString(36)}`;
}

function readPersisted<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (!entry || typeof entry.staleUntil !== "number" || entry.staleUntil <= Date.now()) {
      window.localStorage.removeItem(storageKey(key));
      return null;
    }

    memoryCache.set(key, entry);
    return entry;
  } catch {
    return null;
  }
}

function readEntry<T>(key: string): CacheEntry<T> | null {
  const memoryEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memoryEntry?.staleUntil && memoryEntry.staleUntil > Date.now()) return memoryEntry;
  if (memoryEntry) memoryCache.delete(key);

  return readPersisted<T>(key);
}

function persistEntry<T>(key: string, entry: CacheEntry<T>) {
  if (typeof window === "undefined") return;

  try {
    const keyToStore = storageKey(key);
    const storedIndex = JSON.parse(window.localStorage.getItem(STORAGE_INDEX_KEY) ?? "[]") as string[];
    const nextIndex = [keyToStore, ...storedIndex.filter((item) => item !== keyToStore)];

    for (const expiredKey of nextIndex.splice(MAX_PERSISTED_ENTRIES)) {
      window.localStorage.removeItem(expiredKey);
    }

    window.localStorage.setItem(keyToStore, JSON.stringify(entry));
    window.localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(nextIndex));
  } catch {
    // Browsers can reject storage in private mode or when their quota is full.
  }
}

function storeEntry<T>(key: string, value: T, policy: CachePolicy) {
  const storedAt = Date.now();
  const entry: CacheEntry<T> = {
    value,
    storedAt,
    expiresAt: storedAt + policy.freshForMs,
    staleUntil: storedAt + policy.staleForMs,
  };

  memoryCache.set(key, entry);
  persistEntry(key, entry);
}

export async function withPublicApiCache<T>(
  key: string,
  policy: CachePolicy,
  fetcher: () => Promise<T>,
  canUseStale: (error: unknown) => boolean,
): Promise<T> {
  const cached = readEntry<T>(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const pending = pendingRequests.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const request = fetcher()
    .then((value) => {
      storeEntry(key, value, policy);
      return value;
    })
    .catch((error) => {
      if (cached && cached.staleUntil > Date.now() && canUseStale(error)) return cached.value;
      throw error;
    })
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, request);
  return request;
}

export function clearPublicApiCache() {
  memoryCache.clear();
  pendingRequests.clear();

  if (typeof window === "undefined") return;

  try {
    const storedIndex = JSON.parse(window.localStorage.getItem(STORAGE_INDEX_KEY) ?? "[]") as string[];
    storedIndex.forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.removeItem(STORAGE_INDEX_KEY);
  } catch {
    // Cache invalidation must never interrupt a successful mutation.
  }
}

export function publicApiCachePolicy(endpoint: string): CachePolicy | null {
  if (endpoint.startsWith("/categories") || endpoint.startsWith("/meta")) {
    return { freshForMs: 10 * 60_000, staleForMs: 7 * 24 * 60 * 60_000 };
  }

  if (endpoint.startsWith("/companies")) {
    return { freshForMs: 5 * 60_000, staleForMs: 24 * 60 * 60_000 };
  }

  if (/^\/equipment\/[^/]+\/availability(?:\?|$)/.test(endpoint)) {
    return { freshForMs: 10_000, staleForMs: 2 * 60_000 };
  }

  if (endpoint.startsWith("/equipment")) {
    return { freshForMs: 60_000, staleForMs: 24 * 60 * 60_000 };
  }

  if (endpoint.startsWith("/search/suggestions")) {
    return { freshForMs: 30_000, staleForMs: 10 * 60_000 };
  }

  if (endpoint.startsWith("/marketplace/requests")) {
    return { freshForMs: 60_000, staleForMs: 60 * 60_000 };
  }

  return null;
}
