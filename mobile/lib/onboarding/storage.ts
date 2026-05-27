import * as SecureStore from "expo-secure-store";

export type OnboardingStepId = "step1" | "step2" | "step3";

export type OnboardingStep1Draft = {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate?: string;
};

export type OnboardingStep2Draft = {
  province?: string;
  city: string;
  neighborhood: string;
};

const KEYS = {
  currentStep: "onboarding_current_step",
  draftStep1: "onboarding_draft_step1",
  draftStep2: "onboarding_draft_step2",
  finished: "onboarding_finished",
} as const;

export async function getOnboardingCurrentStep(): Promise<OnboardingStepId | null> {
  const value = await SecureStore.getItemAsync(KEYS.currentStep);
  if (value === "step1" || value === "step2" || value === "step3") {
    return value;
  }
  return null;
}

export async function setOnboardingCurrentStep(step: OnboardingStepId): Promise<void> {
  await SecureStore.setItemAsync(KEYS.currentStep, step);
}

export async function isOnboardingFinished(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEYS.finished)) === "true";
}

export async function setOnboardingFinished(finished: boolean): Promise<void> {
  if (finished) {
    await SecureStore.setItemAsync(KEYS.finished, "true");
  } else {
    await SecureStore.deleteItemAsync(KEYS.finished);
  }
}

export async function getOnboardingStep1Draft(): Promise<OnboardingStep1Draft | null> {
  const raw = await SecureStore.getItemAsync(KEYS.draftStep1);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingStep1Draft;
  } catch {
    return null;
  }
}

export async function setOnboardingStep1Draft(
  draft: OnboardingStep1Draft,
): Promise<void> {
  await SecureStore.setItemAsync(KEYS.draftStep1, JSON.stringify(draft));
}

export async function clearOnboardingStep1Draft(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.draftStep1);
}

export async function getOnboardingStep2Draft(): Promise<OnboardingStep2Draft | null> {
  const raw = await SecureStore.getItemAsync(KEYS.draftStep2);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingStep2Draft;
  } catch {
    return null;
  }
}

export async function setOnboardingStep2Draft(
  draft: OnboardingStep2Draft,
): Promise<void> {
  await SecureStore.setItemAsync(KEYS.draftStep2, JSON.stringify(draft));
}

export async function clearOnboardingStep2Draft(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.draftStep2);
}

export async function clearOnboardingDraftsAndStep(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.currentStep),
    SecureStore.deleteItemAsync(KEYS.draftStep1),
    SecureStore.deleteItemAsync(KEYS.draftStep2),
  ]);
}

export async function clearAllOnboardingState(): Promise<void> {
  await clearOnboardingDraftsAndStep();
  await SecureStore.deleteItemAsync(KEYS.finished);
}

export async function resetOnboardingForNewAccount(): Promise<void> {
  await clearAllOnboardingState();
  await setOnboardingCurrentStep("step1");
  await setOnboardingFinished(false);
}
