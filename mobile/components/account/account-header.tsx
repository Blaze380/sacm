import { Text } from "@/components/ui/text";
import { View } from "react-native";

type Props = {
  firstName?: string | null;
  email?: string;
};

export function AccountHeader({ firstName, email }: Props) {
  const name = firstName?.trim() || "Utilizador";

  return (
    <View className="gap-1">
      <Text className="text-3xl font-semibold">Conta</Text>
      <Text className="text-xl font-medium mt-2">{name}</Text>
      {email ? (
        <Text className="text-muted-foreground">{email}</Text>
      ) : null}
    </View>
  );
}
