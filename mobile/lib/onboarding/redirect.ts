import type { GetMe200 } from "@/gen/models/GetMe";
import {
  getOnboardingCurrentStep,
  isOnboardingFinished,
} from "@/lib/onboarding/storage";
import {
  isOnboardingComplete,
  resolveOnboardingRoute,
  type OnboardingRoute,
} from "@/lib/onboarding/progress";

export function isOnOnboardingSegments(segments: string[]): boolean {
  return segments.includes("onboarding");
}

export function isOnTargetOnboardingRoute(
  segments: string[],
  target: OnboardingRoute,
): boolean {
  if (target === "/(tabs)/home") {
    return segments.includes("(tabs)");
  }

  const step = target.split("/").pop() ?? "";
  return segments.includes(step);
}

export async function getResolvedOnboardingRoute(
  user: GetMe200,
): Promise<OnboardingRoute> {
  const [currentStep, finished] = await Promise.all([
    getOnboardingCurrentStep(),
    isOnboardingFinished(),
  ]);

  return resolveOnboardingRoute(user, { currentStep, finished });
}

export async function shouldRedirectToOnboarding(
  user: GetMe200,
): Promise<boolean> {
  const finished = await isOnboardingFinished();
  return !isOnboardingComplete(user) || !finished;
}
