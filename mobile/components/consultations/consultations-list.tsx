import { AppointmentCard } from "@/components/home/appointment-card";
import { TriageCard } from "@/components/home/triage-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import type { HomeUpcomingItem } from "@/lib/home/types";
import { View } from "react-native";

type Props = {
  items: HomeUpcomingItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function ConsultationsList({
  items,
  isLoading,
  error,
  onRetry,
}: Props) {
  if (isLoading) {
    return (
      <View className="gap-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="gap-3 items-center py-6">
        <Text className="text-red-500 text-center">{error}</Text>
        <Button variant="outline" onPress={onRetry}>
          <Text>Tentar novamente</Text>
        </Button>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-muted-foreground text-center">
          Nenhuma consulta encontrada.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {items.map((item) =>
        item.kind === "appointment" ? (
          <AppointmentCard key={`appt-${item.appointment.id}`} item={item} />
        ) : (
          <TriageCard key={`triage-${item.triage.id}`} item={item} />
        ),
      )}
    </View>
  );
}
