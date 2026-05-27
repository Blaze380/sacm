import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { formatRelativeDate } from "@/lib/datetime/relative";
import { themeColors } from "@/lib/theme-colors";
import {
  getTriageBadgeVariant,
  TRIAGE_STATUS_LABELS,
} from "@/lib/home/labels";
import type { HomeTriageItem } from "@/lib/home/types";
import { CalendarDays, Stethoscope } from "lucide-react-native";
import { Pressable, View } from "react-native";

type Props = {
  item: HomeTriageItem;
  onPress?: () => void;
};

export function TriageCard({ item, onPress }: Props) {
  const { triage } = item;
  const statusLabel = TRIAGE_STATUS_LABELS[triage.status] ?? triage.status;
  const relativeDate = formatRelativeDate(item.date);

  const content = (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-4">
      <View className="h-11 w-11 rounded-full bg-secondary items-center justify-center">
          <Stethoscope size={22} color={themeColors.primary} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-base" numberOfLines={2}>
          {triage.complaint}
        </Text>
        <View className="flex-row items-center gap-1">
            <CalendarDays size={14} color={themeColors.mutedIcon} />
          <Text className="text-sm text-muted-foreground">{relativeDate}</Text>
        </View>
      </View>
      <Badge variant={getTriageBadgeVariant(triage.status)}>
        <Text className="text-xs">{statusLabel}</Text>
      </Badge>
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
