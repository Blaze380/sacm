import { Text } from "@/components/ui/text";
import type { HomeAppointmentItem } from "@/lib/home/types";
import { themeColors } from "@/lib/theme-colors";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarCheck } from "lucide-react-native";
import { Pressable, View } from "react-native";

type Props = {
  item: HomeAppointmentItem;
  onPress?: () => void;
};

export function AppointmentCard({ item, onPress }: Props) {
  const time = format(item.date, "HH:mm", { locale: pt });

  const content = (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-4">
      <View className="h-11 w-11 rounded-full bg-primary/10 items-center justify-center">
        <CalendarCheck size={22} color={themeColors.primary} />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-base" numberOfLines={2}>
          {item.consultationTypeName}
        </Text>
      </View>
      <Text className="text-lg font-semibold text-primary">{time}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
}
