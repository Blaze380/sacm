import type { GetMe200 } from "@/gen/models/GetMe";

export type OnboardingRoute =
  | "/(auth)/onboarding/step1"
  | "/(auth)/onboarding/step2"
  | "/(auth)/onboarding/step3"
  | "/(tabs)";

function isFilled(value?: string | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isStep1Complete(user: GetMe200): boolean {
  return (
    isFilled(user.firstName) &&
    isFilled(user.lastName) &&
    isFilled(user.phone) &&
    isFilled(user.birthDate)
  );
}

export function isStep2Complete(user: GetMe200): boolean {
  return (
    isFilled(user.province) &&
    isFilled(user.city) &&
    isFilled(user.neighborhood)
  );
}

export function isOnboardingComplete(user: GetMe200): boolean {
  return isStep1Complete(user) && isStep2Complete(user);
}

export function getOnboardingRoute(user: GetMe200): OnboardingRoute {
  if (!isStep1Complete(user)) {
    return "/(auth)/onboarding/step1";
  }
  if (!isStep2Complete(user)) {
    return "/(auth)/onboarding/step2";
  }
  return "/(tabs)";
}

/** Route for in-flow navigation after step2 submit (success screen). */
export function getPostStep2Route(): OnboardingRoute {
  return "/(auth)/onboarding/step3";
}
