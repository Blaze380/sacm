import { Text } from "@/components/ui/text";
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
};

export function HelloSection({ firstName }: Props) {
  const name = firstName?.trim() || "Utilizador";

  return (
    <View className="gap-1">
      <Text className="text-2xl font-semibold">
        {getGreeting()}, {name}!
      </Text>
      <Text className="text-muted-foreground text-base">
        {HOME_HELLO_DESCRIPTION}
      </Text>
    </View>
  );
}
