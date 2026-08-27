const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const payload = await response.json();

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message ?? "Une erreur est survenue.");
  }

  return payload.data as T;
}
