import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  buttonLabel: string;
  onSubmit: () => void;
  isLoading?: boolean;
  submitError?: string | null;
};

export function OnboardingScreen({
  title,
  subtitle,
  children,
  buttonLabel,
  onSubmit,
  isLoading,
  submitError,
}: Props) {
  return (
    <SafeAreaView className="flex-1 justify-between p-4">
      <View className="w-full flex-col px-6 gap-8 flex-1">
        <View className="mt-16">
          <Text className="text-3xl font-semibold">{title}</Text>
          <Text className="text-muted-foreground mt-2">{subtitle}</Text>
        </View>
        <View className="flex-col gap-4">{children}</View>
        {submitError && (
          <Text className="text-red-500">{submitError}</Text>
        )}
      </View>
      <View className="w-full px-6 pb-4">
        <Button
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
          onPress={onSubmit}
        >
          <Text className="text-white">{buttonLabel}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
