import { AccountProfilePersonalFields } from "@/components/account/account-profile-personal-fields";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth/user";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  normalizeMozPhone,
  parseStoredPhoneToLocal,
} from "@/lib/phone/mozambique";
import {
  onboardingStep1Schema,
  type OnboardingStep1FormData,
} from "@/lib/validation/onboarding-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";

export default function OnboardingStep1() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<OnboardingStep1FormData>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "+258",
    },
  });

  const { control, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = form;

  const loadProfile = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone
          ? `+258${parseStoredPhoneToLocal(user.phone)}`
          : "",
        birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
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

  async function onSubmit(data: OnboardingStep1FormData) {
    setSubmitError(null);
    try {
      await updateCurrentUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: normalizeMozPhone(data.phone),
        birthDate: data.birthDate.toISOString(),
      });
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
      submitError={submitError}
    >
      <AccountProfilePersonalFields
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        showSectionTitle={false}
      />
    </OnboardingScreen>
  );
}
