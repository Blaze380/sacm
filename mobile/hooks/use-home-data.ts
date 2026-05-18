import { buildPatientConsultationItems } from "@/lib/consultations/build-list";
import { fetchConsultationTypeMap } from "@/lib/api/consultation-types";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth/user";
import type { HomeUpcomingItem } from "@/lib/home/types";
import type { GetMe200 } from "@/gen/models/GetMe";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export function useHomeData() {
  const [user, setUser] = useState<GetMe200 | null>(null);
  const [items, setItems] = useState<HomeUpcomingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const typeMap = await fetchConsultationTypeMap();
      const merged = await buildPatientConsultationItems(
        currentUser.id,
        typeMap,
        { upcomingOnly: true },
      );

      setItems(merged.sort((a, b) => a.date.getTime() - b.date.getTime()));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { user, items, isLoading, error, refetch: load };
}
