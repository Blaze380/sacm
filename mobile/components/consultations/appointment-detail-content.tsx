import { DetailFieldRow } from "@/components/consultations/detail-field-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  APPOINTMENT_PRIORITY_LABELS,
  APPOINTMENT_SOURCE_LABELS,
  APPOINTMENT_STATUS_LABELS,
} from "@/lib/consultations/detail-labels";
import { canBookFromReferredTriage } from "@/lib/consultations/detail-variant";
import type { HomeAppointmentItem, HomeTriageItem } from "@/lib/home/types";
import { themeColors } from "@/lib/theme-colors";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarCheck, CalendarDays } from "lucide-react-native";
import { View } from "react-native";

type AppointmentProps = {
  item: HomeAppointmentItem;
  specialtyMap: Record<string, string>;
};

type ReferredTriageProps = {
  item: HomeTriageItem;
  specialtyMap: Record<string, string>;
  consultationTypeMap: Record<string, string>;
  onBook?: () => void;
};

export function AppointmentDetailContent({
  item,
  specialtyMap,
}: AppointmentProps) {
  const { appointment, consultationTypeName, date } = item;
  const statusLabel =
    APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status;
  const sourceLabel =
    APPOINTMENT_SOURCE_LABELS[appointment.source] ?? appointment.source;
  const priorityLabel =
    APPOINTMENT_PRIORITY_LABELS[appointment.priority] ?? appointment.priority;
  const specialtyName =
    specialtyMap[appointment.specialtyId] ?? "Especialidade";

  return (
    <View className="gap-6">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
          <CalendarCheck size={24} color={themeColors.primary} />
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-lg font-semibold">{consultationTypeName}</Text>
          <Badge variant="outline">
            <Text className="text-xs">{statusLabel}</Text>
          </Badge>
        </View>
      </View>

      <DetailFieldRow
        label="Data e hora"
        value={format(date, "EEEE, d 'de' MMMM · HH:mm", { locale: pt })}
      />
      <DetailFieldRow label="Especialidade" value={specialtyName} />
      <DetailFieldRow label="Origem" value={sourceLabel} />
      <DetailFieldRow label="Prioridade" value={priorityLabel} />
      {appointment.notes?.trim() ? (
        <DetailFieldRow label="Notas" value={appointment.notes} />
      ) : null}
    </View>
  );
}

export function ReferredTriageDetailContent({
  item,
  specialtyMap,
  consultationTypeMap,
  onBook,
}: ReferredTriageProps) {
  const { triage, date } = item;
  const specialtyName = triage.specialtyId
    ? (specialtyMap[triage.specialtyId] ?? "—")
    : "—";
  const typeName = triage.consultationTypeId
    ? (consultationTypeMap[triage.consultationTypeId] ?? "—")
    : "—";
  const showBook = canBookFromReferredTriage(item) && onBook;

  return (
    <View className="gap-6">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
          <CalendarDays size={24} color={themeColors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold">{typeName}</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {specialtyName}
          </Text>
        </View>
      </View>

      <DetailFieldRow
        label="Data do encaminhamento"
        value={format(date, "EEEE, d 'de' MMMM", { locale: pt })}
      />
      <DetailFieldRow label="Queixa inicial" value={triage.complaint} />
      <DetailFieldRow label="Especialidade sugerida" value={specialtyName} />
      <DetailFieldRow label="Tipo de consulta" value={typeName} />

      <View className="rounded-xl bg-muted/50 p-4">
        <Text className="text-sm text-muted-foreground">
          A triagem foi aprovada. Agende a consulta para o horário que
          preferir.
        </Text>
      </View>

      {showBook ? (
        <Button onPress={onBook}>
          <Text>Agendar consulta</Text>
        </Button>
      ) : null}
    </View>
  );
}
