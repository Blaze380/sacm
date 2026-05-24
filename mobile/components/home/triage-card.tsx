import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { formatRelativeDate } from "@/lib/datetime/relative";
import {
  getTriageBadgeVariant,
  TRIAGE_STATUS_LABELS,
} from "@/lib/home/labels";
import type { HomeTriageItem } from "@/lib/home/types";
import { useRouter } from "expo-router";
import { CalendarDays, Stethoscope } from "lucide-react-native";
import { View } from "react-native";

type Props = {
  item: HomeTriageItem;
};

export function TriageCard({ item }: Props) {
  const router = useRouter();
  const { triage } = item;
  const statusLabel = TRIAGE_STATUS_LABELS[triage.status] ?? triage.status;
  const relativeDate = formatRelativeDate(item.date);
  const canBook = triage.status === "REENCAMINHADO";

  return (
    <View className="gap-3 rounded-xl border border-border bg-card p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 rounded-full bg-secondary items-center justify-center">
          <Stethoscope size={22} color="#24b447" />
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-semibold text-base" numberOfLines={2}>
            {triage.complaint}
          </Text>
          <View className="flex-row items-center gap-1">
            <CalendarDays size={14} color="#687076" />
            <Text className="text-sm text-muted-foreground">{relativeDate}</Text>
          </View>
        </View>
        <Badge variant={getTriageBadgeVariant(triage.status)}>
          <Text className="text-xs">{statusLabel}</Text>
        </Badge>
      </View>
      {canBook ? (
        <Button
          size="sm"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/consultations/new/book-referral",
              params: { triageId: triage.id },
            })
          }
        >
          <Text>Agendar consulta</Text>
        </Button>
      ) : null}
    </View>
  );
}
