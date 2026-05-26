import { logout } from "@/gen/clients/logout";
import { apiClient } from "@/lib/api-client";
import { redirectToLogin } from "@/lib/auth/auth-navigation";
import { clearAccessToken } from "@/lib/auth/session";

export async function logoutSession(): Promise<void> {
  try {
    await logout({ client: apiClient });
  } catch {
    // Best-effort: clear local session even if API fails
  }
  await clearAccessToken();
  redirectToLogin();
}
