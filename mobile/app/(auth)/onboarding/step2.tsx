import { AccountProfileAddressFields } from "@/components/account/account-profile-address-fields";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import type { GetMe200ProvinceEnumKey } from "@/gen/models/GetMe";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth/user";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  onboardingStep2Schema,
  type OnboardingStep2FormData,
} from "@/lib/validation/onboarding-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";

export default function OnboardingStep2() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<OnboardingStep2FormData>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      city: "",
      neighborhood: "",
    },
  });

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  const loadProfile = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      reset({
        province: user.province,
        city: user.city ?? "",
        neighborhood: user.neighborhood ?? "",
      });
    } catch {
      // ignore preload errors
    }
  }, [reset]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  async function onSubmit(data: OnboardingStep2FormData) {
    setSubmitError(null);
    try {
      await updateCurrentUser({
        province: data.province as GetMe200ProvinceEnumKey,
        city: data.city.trim(),
        neighborhood: data.neighborhood.trim(),
      });
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
      submitError={submitError}
    >
      <AccountProfileAddressFields
        control={control}
        errors={errors}
        showSectionTitle={false}
      />
    </OnboardingScreen>
  );
}
