import { AccountProfilePersonalFields } from "@/components/account/account-profile-personal-fields";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { useOnboardingStepForm } from "@/hooks/use-onboarding-step-form";
import { getApiErrorMessage } from "@/lib/api/errors";
import { updateCurrentUser } from "@/lib/auth/user";
import {
  clearOnboardingStep1Draft,
  setOnboardingCurrentStep,
} from "@/lib/onboarding/storage";
import { ONBOARDING_STEP1_DEFAULT_VALUES } from "@/lib/onboarding/form-defaults";
import { normalizeMozPhone } from "@/lib/phone/mozambique";
import {
  onboardingStep1Schema,
  type OnboardingStep1FormData,
} from "@/lib/validation/onboarding-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function OnboardingStep1() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<OnboardingStep1FormData>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: ONBOARDING_STEP1_DEFAULT_VALUES,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const { isHydrating } = useOnboardingStepForm({ step: "step1", form });

  async function onSubmit(data: OnboardingStep1FormData) {
    setSubmitError(null);
    try {
      await updateCurrentUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: normalizeMozPhone(data.phone),
        birthDate: data.birthDate.toISOString(),
      });
      await clearOnboardingStep1Draft();
      await setOnboardingCurrentStep("step2");
      router.push("/(auth)/onboarding/step2");
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }

  return (
    <OnboardingScreen
      title="Fale um pouco sobre você"
      subtitle="Nós queremos fornecer uma experiência personalizada."
      buttonLabel="Próximo"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      isLoadingContent={isHydrating}
      submitError={submitError}
    >
      {!isHydrating ? (
        <AccountProfilePersonalFields
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          showSectionTitle={false}
        />
      ) : null}
    </OnboardingScreen>
  );
}
