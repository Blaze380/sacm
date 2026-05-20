import axios from "axios";

export function isInvalidSessionError(error: unknown): boolean {
  if (!axios.isAxiosError(error) || !error.response) return false;

  const status = error.response.status;
  const url = error.config?.url ?? "";

  if (url.includes("/api/auth/login")) return false;

  if (status === 401) return true;

  if (status === 404 && url.includes("/api/users/me")) return true;

  return false;
}
