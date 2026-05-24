import type { OnboardingRoute } from "@/lib/onboarding/progress";

export function shouldResumeRedirect(
  currentPath: string,
  targetRoute: OnboardingRoute,
): boolean {
  if (targetRoute === "/(tabs)/home" && currentPath.includes("step3")) {
    return false;
  }

  const pathToRoute: Record<string, OnboardingRoute> = {
    step1: "/(auth)/onboarding/step1",
    step2: "/(auth)/onboarding/step2",
    step3: "/(auth)/onboarding/step3",
  };

  for (const [segment, route] of Object.entries(pathToRoute)) {
    if (currentPath.includes(segment) && route === targetRoute) {
      return false;
    }
  }

  if (targetRoute === "/(tabs)/home") {
    return !currentPath.includes("(tabs)");
  }

  return !currentPath.includes(targetRoute.split("/").pop() ?? "");
}
