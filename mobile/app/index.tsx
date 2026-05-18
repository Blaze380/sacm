import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getCurrentUser } from "@/lib/auth/user";
import { getAccessToken } from "@/lib/auth/session";
import {
  getOnboardingRoute,
  isOnboardingComplete,
} from "@/lib/onboarding/progress";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingScreen() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const token = await getAccessToken();
      if (!token) {
        if (!cancelled) setCheckingSession(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (cancelled) return;

        if (isOnboardingComplete(user)) {
          router.replace("/(tabs)");
        } else {
          router.replace(getOnboardingRoute(user));
        }
      } catch {
        if (!cancelled) setCheckingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingSession) {
    return (
      <SafeAreaView className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 items-center justify-between p-4">
      <View className="flex items-center justify-center mt-32">
        <Text>LOGO</Text>
        <Text className="text-3xl text-white">SEJA BEM VINDO AO SACM!</Text>
      </View>

      <View className="w-full flex-col px-16 items-center justify-center mb-5">
        <Button className="bg-white w-full">
          <Link
            href="/(auth)/signup/step1"
            className="w-full text-center text-primary"
          >
            Começar
          </Link>
        </Button>
        <View className="flex-row items-center justify-center gap-2 mt-4">
          <Text className="text-white text-center">Já tem uma conta?</Text>
          <Link
            href="/(auth)/login"
            className="text-white text-center font-bold underline"
          >
            Faça login
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
