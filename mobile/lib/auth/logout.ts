import { logout } from "@/gen/clients/logout";
import { apiClient } from "@/lib/api-client";
import { redirectToLogin } from "@/lib/auth/auth-navigation";
import { clearAccessToken } from "@/lib/auth/session";
import { notifySessionCleared } from "@/lib/auth/session-state";
import { clearAllOnboardingState } from "@/lib/onboarding/storage";
import { clearCachedUser } from "@/lib/auth/user";

export async function logoutSession(): Promise<void> {
  try {
    await logout({ client: apiClient });
  } catch {
    // Best-effort: clear local session even if API fails
  }
  await clearAccessToken();
  clearCachedUser();
  await clearAllOnboardingState();
  notifySessionCleared();
  redirectToLogin();
}
