import { DetailFieldRow } from "@/components/consultations/detail-field-row";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { formatRelativeDate } from "@/lib/datetime/relative";
import { getTriageStatusMessage } from "@/lib/consultations/detail-labels";
import { TRIAGE_REJECTED_STATUS } from "@/lib/consultations/detail-variant";
import { themeColors } from "@/lib/theme-colors";
import {
  getTriageBadgeVariant,
  TRIAGE_STATUS_LABELS,
} from "@/lib/home/labels";
import type { TriageItem } from "@/lib/api/triages";
import { Stethoscope } from "lucide-react-native";
import { View } from "react-native";

type Props = {
  triage: TriageItem;
  date: Date;
};

export function TriageDetailContent({ triage, date }: Props) {
  const statusLabel = TRIAGE_STATUS_LABELS[triage.status] ?? triage.status;
  const statusMessage = getTriageStatusMessage(triage.status);

  return (
    <View className="gap-6">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 rounded-full bg-secondary items-center justify-center">
          <Stethoscope size={24} color={themeColors.primary} />
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-lg font-semibold" numberOfLines={2}>
            {triage.complaint}
          </Text>
          <Badge variant={getTriageBadgeVariant(triage.status)}>
            <Text className="text-xs">{statusLabel}</Text>
          </Badge>
        </View>
      </View>

      <DetailFieldRow
        label="Data do pedido"
        value={formatRelativeDate(date)}
      />
      <DetailFieldRow label="Sintoma principal" value={triage.symptom} />
      <DetailFieldRow label="Duração dos sintomas" value={triage.symptomDuration} />
      <DetailFieldRow label="Ação tomada" value={triage.actionTaken} />
      <DetailFieldRow
        label="Reação após ação"
        value={triage.reactionAfterAction}
      />

      {triage.status === TRIAGE_REJECTED_STATUS && triage.rejectionReason ? (
        <View className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 gap-2">
          <Text className="text-sm font-semibold text-destructive">
            Motivo da não aprovação
          </Text>
          <Text className="text-base">{triage.rejectionReason}</Text>
        </View>
      ) : null}

      {statusMessage ? (
        <View className="rounded-xl bg-muted/50 p-4">
          <Text className="text-sm text-muted-foreground">{statusMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}
