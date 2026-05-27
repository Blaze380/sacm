import type { GetMe200 } from "@/gen/models/GetMe";
import type { OnboardingStepId } from "@/lib/onboarding/storage";

export type OnboardingRoute =
  | "/(auth)/onboarding/step1"
  | "/(auth)/onboarding/step2"
  | "/(auth)/onboarding/step3"
  | "/(tabs)/home";

const STEP_ROUTES: Record<OnboardingStepId, OnboardingRoute> = {
  step1: "/(auth)/onboarding/step1",
  step2: "/(auth)/onboarding/step2",
  step3: "/(auth)/onboarding/step3",
};

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

/** Minimum step allowed from server profile completeness. */
export function getMinimumOnboardingStep(user: GetMe200): OnboardingStepId {
  if (!isStep1Complete(user)) return "step1";
  if (!isStep2Complete(user)) return "step2";
  return "step3";
}

export function stepToRoute(step: OnboardingStepId): OnboardingRoute {
  return STEP_ROUTES[step];
}

function stepOrder(step: OnboardingStepId): number {
  if (step === "step1") return 1;
  if (step === "step2") return 2;
  return 3;
}

function clampStep(
  desired: OnboardingStepId,
  minimum: OnboardingStepId,
): OnboardingStepId {
  return stepOrder(desired) >= stepOrder(minimum) ? desired : minimum;
}

export function resolveOnboardingRoute(
  user: GetMe200,
  opts: {
    currentStep?: OnboardingStepId | null;
    finished?: boolean;
  } = {},
): OnboardingRoute {
  if (opts.finished && isOnboardingComplete(user)) {
    return "/(tabs)/home";
  }

  const minimum = getMinimumOnboardingStep(user);

  if (!isOnboardingComplete(user)) {
    const step = opts.currentStep
      ? clampStep(opts.currentStep, minimum)
      : minimum;
    return stepToRoute(step);
  }

  if (!opts.finished) {
    const step = opts.currentStep
      ? clampStep(opts.currentStep, "step3")
      : "step3";
    return stepToRoute(step);
  }

  return "/(tabs)/home";
}

/** @deprecated Use resolveOnboardingRoute */
export function getOnboardingRoute(user: GetMe200): OnboardingRoute {
  return resolveOnboardingRoute(user, { finished: true });
}

export function getPostStep2Route(): OnboardingRoute {
  return "/(auth)/onboarding/step3";
}
