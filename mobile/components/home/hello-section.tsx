import { Text } from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import { HOME_HELLO_DESCRIPTION } from "@/lib/home/copy";
import { View } from "react-native";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

type Props = {
  firstName?: string | null;
  isLoading?: boolean;
};

export function HelloSection({ firstName, isLoading }: Props) {
  const name = firstName?.trim();

  if (isLoading && !name) {
    return (
      <View className="gap-1">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-full" />
      </View>
    );
  }

  return (
    <View className="gap-1">
      <Text className="text-2xl font-semibold">
        {getGreeting()}, {name || "Utilizador"}!
      </Text>
      <Text className="text-muted-foreground text-base">
        {HOME_HELLO_DESCRIPTION}
      </Text>
    </View>
  );
}
