import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function TabScreen({ title, subtitle = "Em breve", children }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-semibold">{title}</Text>
        {subtitle ? (
          <Text className="text-muted-foreground mt-2">{subtitle}</Text>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
}
