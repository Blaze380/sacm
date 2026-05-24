import { Button } from "@/components/ui/button";
import { ControllerInput } from "@/components/ui/controlled-input";
import { Text } from "@/components/ui/text";
import { getApiErrorMessage } from "@/lib/api/errors";
import { signIn } from "@/lib/auth/login";
import { getCurrentUser } from "@/lib/auth/user";
import {
  getOnboardingRoute,
  isOnboardingComplete,
} from "@/lib/onboarding/progress";
import { loginSchema, type LoginFormData } from "@/lib/validation/login-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await signIn(data.email, data.password);
      const user = await getCurrentUser();

      if (isOnboardingComplete(user)) {
        router.replace("/(tabs)/home");
      } else {
        router.replace(getOnboardingRoute(user));
      }
    } catch (error) {
      const message = getApiErrorMessage(error);
      setError("root", { message });
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center p-4">
      <View className="w-full flex-col px-10 gap-10">
        <View className="flex items-center justify-center mt-32">
          <Text>LOGO</Text>
          <Text className="text-3xl text-primary">Bem Vindo de Volta!</Text>
        </View>
        <View className="flex-col justify-center gap-5 items-center w-full">
          <ControllerInput
            control={control}
            className="w-full"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email?.message}
          />
          <ControllerInput
            control={control}
            className="w-full"
            name="password"
            placeholder="Palavra-passe"
            textContentType="password"
            secureTextEntry
            autoComplete="password"
            error={errors.password?.message}
          />
          {errors.root?.message && (
            <Text className="text-red-500 w-full">{errors.root.message}</Text>
          )}
          <View className="w-full items-center justify-center">
            <Button
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white">Entrar</Text>
            </Button>
            <View className="flex-row items-center justify-center gap-2 mt-4">
              <Text className="text-center">Não possui uma conta?</Text>
              <Link
                href="/(auth)/signup/step1"
                className="text-center text-primary"
              >
                Registe-se
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
