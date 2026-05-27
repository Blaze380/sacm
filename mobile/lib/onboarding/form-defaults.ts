import type {
  OnboardingStep1FormData,
  OnboardingStep2FormData,
} from "@/lib/validation/onboarding-schemas";
import type { DefaultValues } from "react-hook-form";

export const ONBOARDING_STEP1_DEFAULT_VALUES: DefaultValues<OnboardingStep1FormData> =
  {
    firstName: "",
    lastName: "",
    phone: "+258",
  };

export const ONBOARDING_STEP2_DEFAULT_VALUES: DefaultValues<OnboardingStep2FormData> =
  {
    city: "",
    neighborhood: "",
  };
