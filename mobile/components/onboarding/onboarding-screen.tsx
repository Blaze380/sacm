import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { themeColors } from "@/lib/theme-colors";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  buttonLabel: string;
  onSubmit: () => void;
  isLoading?: boolean;
  isLoadingContent?: boolean;
  submitError?: string | null;
};

export function OnboardingScreen({
  title,
  subtitle,
  children,
  buttonLabel,
  onSubmit,
  isLoading,
  isLoadingContent,
  submitError,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-4 flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-8 gap-8">
            <View>
              <Text className="text-3xl font-semibold">{title}</Text>
              <Text className="text-muted-foreground mt-2">{subtitle}</Text>
            </View>
            <View className="flex-col gap-4 min-h-[200px] justify-center">
              {isLoadingContent ? (
                <ActivityIndicator color={themeColors.primary} />
              ) : (
                children
              )}
            </View>
            {submitError ? (
              <Text className="text-red-500">{submitError}</Text>
            ) : null}
          </View>
        </ScrollView>
        <View className="px-6 pb-4 pt-2 border-t border-border bg-background">
          <Button
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || isLoadingContent}
            onPress={onSubmit}
          >
            <Text className="text-white">{buttonLabel}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
