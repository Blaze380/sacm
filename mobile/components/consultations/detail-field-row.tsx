import { Text } from "@/components/ui/text";
import { View } from "react-native";

type Props = {
  label: string;
  value: string;
};

export function DetailFieldRow({ label, value }: Props) {
  return (
    <View className="gap-1">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <Text className="text-base">{value}</Text>
    </View>
  );
}
