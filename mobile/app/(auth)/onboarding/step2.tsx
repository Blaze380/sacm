import { AccountProfileAddressFields } from "@/components/account/account-profile-address-fields";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { useOnboardingStepForm } from "@/hooks/use-onboarding-step-form";
import type { GetMe200ProvinceEnumKey } from "@/gen/models/GetMe";
import { updateCurrentUser } from "@/lib/auth/user";
import { getApiErrorMessage } from "@/lib/api/errors";
import { ONBOARDING_STEP2_DEFAULT_VALUES } from "@/lib/onboarding/form-defaults";
import {
  clearOnboardingStep2Draft,
  setOnboardingCurrentStep,
} from "@/lib/onboarding/storage";
import {
  onboardingStep2Schema,
  type OnboardingStep2FormData,
} from "@/lib/validation/onboarding-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function OnboardingStep2() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<OnboardingStep2FormData>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: ONBOARDING_STEP2_DEFAULT_VALUES,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const { isHydrating } = useOnboardingStepForm({ step: "step2", form });

  async function onSubmit(data: OnboardingStep2FormData) {
    setSubmitError(null);
    try {
      await updateCurrentUser({
        province: data.province as GetMe200ProvinceEnumKey,
        city: data.city.trim(),
        neighborhood: data.neighborhood.trim(),
      });
      await clearOnboardingStep2Draft();
      await setOnboardingCurrentStep("step3");
      router.replace("/(auth)/onboarding/step3");
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }

  return (
    <OnboardingScreen
      title="Seu endereço residencial"
      subtitle="Nós queremos fornecer uma experiência personalizada."
      buttonLabel="Finalizar"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      isLoadingContent={isHydrating}
      submitError={submitError}
    >
      {!isHydrating ? (
        <AccountProfileAddressFields
          control={control}
          errors={errors}
          showSectionTitle={false}
        />
      ) : null}
    </OnboardingScreen>
  );
}
