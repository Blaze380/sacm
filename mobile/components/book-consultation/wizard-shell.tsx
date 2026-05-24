import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { X } from "lucide-react-native";
import { ReactNode } from "react";
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
  subtitle: string;
  stepIndex: number;
  stepCount: number;
  children: ReactNode;
  primaryLabel: string;
  onPrimaryPress: () => void;
  onClosePress: () => void;
  showPrevious?: boolean;
  onPreviousPress?: () => void;
  isLoading?: boolean;
  submitError?: string | null;
};

export function WizardShell({
  title,
  subtitle,
  stepIndex,
  stepCount,
  children,
  primaryLabel,
  onPrimaryPress,
  onClosePress,
  showPrevious,
  onPreviousPress,
  isLoading,
  submitError,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <Pressable
          onPress={onClosePress}
          className="h-10 w-10 rounded-full items-center justify-center"
          accessibilityLabel="Fechar"
        >
          <X size={22} color="#11181C" />
        </Pressable>
        <Text className="text-muted-foreground text-sm">
          {stepIndex + 1} / {stepCount}
        </Text>
      </View>

      <View className="flex-1 px-6 gap-6">
        <View className="mt-4">
          <Text className="text-2xl font-semibold">{title}</Text>
          <Text className="text-muted-foreground mt-2">{subtitle}</Text>
        </View>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {submitError ? (
          <Text className="text-red-500">{submitError}</Text>
        ) : null}
      </View>

      <View className="px-6 pb-6 pt-2 gap-3">
        {showPrevious && onPreviousPress ? (
          <Button variant="outline" className="w-full" onPress={onPreviousPress}>
            <Text>Anterior</Text>
          </Button>
        ) : null}
        <Button
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
          onPress={onPrimaryPress}
        >
          <Text className="text-white">{primaryLabel}</Text>
        </Button>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
