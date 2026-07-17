import { storage } from "@/lib/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://kinoxplus.onrender.com";
const ACCESS_TOKEN_KEY = "session.accessToken";
const REFRESH_TOKEN_KEY = "session.refreshToken";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Nest's ValidationPipe returns { statusCode, message, error } where message
// is a string for most errors but an array of per-field strings for
// validation failures — flatten either shape into one displayable message.
function extractMessage(body: string, fallback: string): string {
  try {
    const parsed = JSON.parse(body);
    if (Array.isArray(parsed?.message)) return parsed.message.join(", ");
    if (typeof parsed?.message === "string") return parsed.message;
  } catch {
    // Not JSON — fall through to the raw body/fallback below.
  }
  return body || fallback;
}

// Every success response on this API is wrapped as { success, data, meta }
// — unwrap to the inner payload so callers work with plain DTOs. Falls
// through unchanged if a response doesn't match the envelope (e.g. an
// undocumented endpoint that returns the DTO directly).
function unwrap<T>(json: unknown): T {
  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

function rawFetch(path: string, accessToken: string | null, init?: RequestInit) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  });
}

// Refresh tokens rotate server-side (a used one is invalidated), so
// concurrent 401s must share a single in-flight refresh instead of each
// firing their own — the second caller would otherwise present an
// already-burned token and fail.
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return null;
      try {
        const response = await rawFetch("/auth/refresh", null, {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) return null;
        const tokens = unwrap<{ accessToken: string; refreshToken: string }>(await response.json());
        await storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        await storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        // Keep the in-memory session store in sync. Dynamic import defers
        // resolution to call time, which avoids a static
        // services -> stores -> services circular dependency.
        const { useSessionStore } = await import("@/stores/sessionStore");
        useSessionStore.getState().syncTokens(tokens.accessToken, tokens.refreshToken);
        return tokens.accessToken;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

const REFRESH_EXEMPT_PATHS = new Set(["/auth/refresh", "/auth/login", "/auth/register", "/auth/otp/verify"]);

async function request<T>(path: string, init?: RequestInit, isRetry = false): Promise<T> {
  const accessToken = await storage.getItem(ACCESS_TOKEN_KEY);
  const response = await rawFetch(path, accessToken, init);

  if (response.status === 401 && !isRetry && accessToken && !REFRESH_EXEMPT_PATHS.has(path)) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) return request<T>(path, init, true);
    // Refresh failed — the session is genuinely dead, so clear it locally
    // rather than leaving the app holding tokens the server will keep
    // rejecting on every subsequent call.
    const { useSessionStore } = await import("@/stores/sessionStore");
    await useSessionStore.getState().logOut();
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ApiError(response.status, extractMessage(body, response.statusText));
  }

  if (response.status === 204) return undefined as T;
  return unwrap<T>(await response.json());
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { ApiError };
