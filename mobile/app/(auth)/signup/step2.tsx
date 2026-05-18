import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckValidationText } from "@/components/check-validation-text";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerInput } from "@/components/ui/controlled-input";
import {
  signupPasswordSchema,
  type SignupPasswordFormData,
} from "@/lib/validation/signup-schemas";
import { getPasswordRuleStatus } from "@/lib/validation/password";
import { registerAndLogin } from "@/lib/auth/signup";
import { getApiErrorMessage } from "@/lib/api/errors";

export default function SignupStep2() {
  const params = useLocalSearchParams<{ email: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const router = useRouter();
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%"], []);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupPasswordFormData>({
    resolver: zodResolver(signupPasswordSchema),
    defaultValues: {
      email: typeof email === "string" ? email : "",
      password: "",
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";
  const ruleStatus = getPasswordRuleStatus(password);

  useEffect(() => {
    if (!email || typeof email !== "string") {
      router.back();
    }
  }, [email, router]);

  const handlePresentModalPress = useCallback(() => {
    setSubmitError(null);
    ref.current?.present();
  }, []);

  function openTermsSheet() {
    handlePresentModalPress();
  }

  async function onSubmit(data: SignupPasswordFormData) {
    setSubmitError(null);
    try {
      await registerAndLogin(data.email, data.password);
      ref.current?.dismiss();
      router.replace("/(auth)/onboarding/step1");
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSubmitError(message);
      setError("root", { message });
    }
  }

  if (!email || typeof email !== "string") {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-between p-4">
      <View className=" w-full px-10  flex-col gap-14">
        <View className="flex items-start justify-center mt-14">
          <Text className="text-3xl">Criar senha para</Text>
          <Text className="text-3xl text-primary ">{email}</Text>
        </View>
        <ControllerInput
          control={control}
          name="password"
          placeholder="Palavra-passe"
          textContentType="password"
          secureTextEntry
          error={errors.password?.message}
        />
        <View className="flex-col">
          <CheckValidationText
            text="Mínimo 8 caracteres"
            status={ruleStatus.minLength}
          />
          <CheckValidationText
            text="Pelo menos uma letra minúscula"
            status={ruleStatus.hasLowercase}
          />
          <CheckValidationText
            text="Pelo menos uma letra maiúscula"
            status={ruleStatus.hasUppercase}
          />
        </View>
        {errors.root?.message && (
          <Text className="text-red-500">{errors.root.message}</Text>
        )}
      </View>
      <View className="w-full items-center justify-center flex px-10 mb-3">
        <Button className="w-full" onPress={handleSubmit(openTermsSheet)}>
          <Text className="text-white">Continuar</Text>
        </Button>
      </View>
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={-1}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
            opacity={0.5}
          />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View className="flex-col items-center justify-center w-full px-4">
            <Text className="text-xl text-center self-start font-bold">
              Aceitar termos
            </Text>
            <Text className="text-start self-start mt-4 text-muted-foreground">
              Ao criar a conta, concorda com os termos e a política de
              privacidade da SACM.
            </Text>
            {submitError && (
              <Text className="text-red-500 mt-3 self-start">{submitError}</Text>
            )}
          </View>
          <Button
            className="w-11/12 mt-3"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white">Criar conta</Text>
          </Button>
          <Button
            variant="secondary"
            className="w-11/12 mt-3"
            disabled={isSubmitting}
            onPress={() => ref.current?.dismiss()}
          >
            <Text>Cancelar</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 5,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
});
