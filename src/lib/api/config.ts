import "server-only";

export function getBackendUrl(): string {
  const url = process.env.LARAVEL_API_URL;

  if (!url) {
    throw new Error(
      "LARAVEL_API_URL is not configured."
    );
  }

  return url.replace(/\/+$/, "");
}
