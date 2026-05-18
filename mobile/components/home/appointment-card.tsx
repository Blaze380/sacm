import { Text } from "@/components/ui/text";
import type { HomeAppointmentItem } from "@/lib/home/types";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarCheck } from "lucide-react-native";
import { View } from "react-native";

type Props = {
  item: HomeAppointmentItem;
};

export function AppointmentCard({ item }: Props) {
  const time = format(item.date, "HH:mm", { locale: pt });

  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-4">
      <View className="h-11 w-11 rounded-full bg-primary/10 items-center justify-center">
        <CalendarCheck size={22} color="#24b447" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-base" numberOfLines={2}>
          {item.consultationTypeName}
        </Text>
      </View>
      <Text className="text-lg font-semibold text-primary">{time}</Text>
    </View>
  );
}
