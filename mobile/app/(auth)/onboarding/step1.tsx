import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { PhoneInput } from "@/components/phone-input";
import { ControllerInput } from "@/components/ui/controlled-input";
import { Text } from "@/components/ui/text";
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
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, Pressable, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";

export default function OnboardingStep1() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingStep1FormData>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "+258",
    },
  });

  const birthDate = watch("birthDate");

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
      <View className="flex-row w-full gap-3">
        <ControllerInput
          control={control}
          name="firstName"
          className="flex-1"
          placeholder="Primeiro nome"
          textContentType="givenName"
          autoComplete="given-name"
          error={errors.firstName?.message}
        />
        <ControllerInput
          control={control}
          name="lastName"
          className="flex-1"
          placeholder="Apelido"
          textContentType="familyName"
          autoComplete="family-name"
          error={errors.lastName?.message}
        />
      </View>
      <PhoneInput
        control={control}
        name="phone"
        error={errors.phone?.message}
      />
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="border border-input rounded-md h-10 px-3 justify-center bg-background w-full"
      >
        <Text
          className={
            birthDate instanceof Date && !isNaN(birthDate.getTime())
              ? "text-foreground"
              : "text-muted-foreground"
          }
        >
          {birthDate instanceof Date && !isNaN(birthDate.getTime())
            ? format(birthDate, "dd/MM/yyyy")
            : "Data de nascimento"}
        </Text>
      </Pressable>
      {errors.birthDate?.message && (
        <Text className="text-red-400">{errors.birthDate.message}</Text>
      )}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={
            birthDate instanceof Date && !isNaN(birthDate.getTime())
              ? birthDate
              : new Date(2000, 0, 1)
          }
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            if (Platform.OS === "android") {
              setShowDatePicker(false);
            }
            if (date) {
              setValue("birthDate", date, { shouldValidate: true });
            }
          }}
        />
      )}
    </OnboardingScreen>
  );
}
