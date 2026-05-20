import type { Router } from "expo-router";

let authRouter: Router | null = null;

export function setAuthRouter(router: Router): void {
  authRouter = router;
}

export function redirectToLogin(): void {
  authRouter?.replace("/(auth)/login");
}
