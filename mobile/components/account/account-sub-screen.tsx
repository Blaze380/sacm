import { Text } from "@/components/ui/text";
import { themeColors } from "@/lib/theme-colors";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  children: ReactNode;
};

export function AccountSubScreen({ title, children }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View className="px-6 pt-2 pb-3 flex-row items-center gap-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center -ml-2 active:opacity-70"
            accessibilityLabel="Voltar"
          >
            <ChevronLeft size={24} color={themeColors.foreground} />
          </Pressable>
          <Text className="text-xl font-semibold flex-1">{title}</Text>
        </View>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-12 gap-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
