import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { BookConsultationWizard } from "@/components/book-consultation/book-consultation-wizard";
import { Text } from "@/components/ui/text";
import { getCurrentUser } from "@/lib/auth/user";
import { fetchTriageById } from "@/lib/api/triages";
import type { TriageItem } from "@/lib/api/triages";

export default function BookReferralScreen() {
  const { triageId } = useLocalSearchParams<{ triageId: string }>();
  const router = useRouter();
  const [triage, setTriage] = useState<TriageItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!triageId || typeof triageId !== "string") {
        setError("Triagem inválida.");
        return;
      }
      try {
        const user = await getCurrentUser();
        const item = await fetchTriageById(user.id, triageId);
        if (cancelled) return;
        if (!item || item.status !== "REENCAMINHADO") {
          setError("Encaminhamento não disponível para agendamento.");
          return;
        }
        if (!item.specialtyId || !item.consultationTypeId) {
          setError("Dados de encaminhamento incompletos.");
          return;
        }
        setTriage(item);
      } catch {
        if (!cancelled) setError("Não foi possível carregar a triagem.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [triageId]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-3 p-6">
        <Text className="text-center text-muted-foreground">{error}</Text>
        <Text className="text-primary" onPress={() => router.back()}>
          Voltar
        </Text>
      </View>
    );
  }

  if (!triage) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <BookConsultationWizard
      key={`REFERRAL-${triage.id}`}
      mode="REFERRAL"
      referral={{
        triageId: triage.id,
        specialtyId: triage.specialtyId!,
        consultationTypeId: triage.consultationTypeId!,
        priority: triage.priority ?? "MEDIA",
      }}
    />
  );
}
