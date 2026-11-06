import "server-only";

import { getBackendUrl } from "./config";

export async function laravelRequest(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Invalid Laravel API path.");
  }

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${getBackendUrl()}${path}`, {
    ...options,
    headers,
    cache: "no-store",
    signal: options.signal ?? AbortSignal.timeout(15000),
  });
}
