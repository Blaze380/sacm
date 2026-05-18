import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getCurrentUser } from "@/lib/auth/user";
import { useRouter } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function OnboardingStep3() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Utilizador");

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        try {
          const user = await getCurrentUser();
          if (user.firstName) {
            setFirstName(user.firstName);
          }
        } catch {
          // keep fallback name
        }
      })();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 justify-between p-4">
      <View className="flex-1 items-center justify-center px-8 gap-6">
        <CheckCircle size={80} color="#84cc16" />
        <Text className="text-3xl font-semibold text-center">
          Está preparado, {firstName}!
        </Text>
        <Text className="text-muted-foreground text-center text-base">
          O seu perfil está configurado. Pode começar a usar a SACM.
        </Text>
      </View>
      <View className="w-full px-6 pb-4">
        <Button
          className="w-full"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-white">Começar</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
