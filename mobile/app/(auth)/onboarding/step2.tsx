import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { ControllerInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth/user";
import { getApiErrorMessage } from "@/lib/api/errors";
import { PROVINCE_OPTIONS } from "@/lib/onboarding/provinces";
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingStep2FormData>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      city: "",
      neighborhood: "",
    },
  });

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
        province: data.province,
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
      <ControlledSelect
        control={control}
        name="province"
        options={PROVINCE_OPTIONS}
        placeholder="Província"
        error={errors.province?.message}
      />
      <ControllerInput
        control={control}
        name="city"
        full
        placeholder="Cidade"
        textContentType="addressCity"
        error={errors.city?.message}
      />
      <ControllerInput
        control={control}
        name="neighborhood"
        full
        placeholder="Bairro"
        textContentType="fullStreetAddress"
        error={errors.neighborhood?.message}
      />
    </OnboardingScreen>
  );
}
