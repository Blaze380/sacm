import { buildPatientConsultationItems } from "@/lib/consultations/build-list";
import {
  filterConsultationItems,
  type StatusFilterId,
} from "@/lib/consultations/filters";
import { fetchConsultationTypeMap } from "@/lib/api/consultation-types";
import { fetchSpecialtyMap } from "@/lib/api/specialties";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth/user";
import type { HomeUpcomingItem } from "@/lib/home/types";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";

export function useConsultationsData() {
  const [items, setItems] = useState<HomeUpcomingItem[]>([]);
  const [specialtyMap, setSpecialtyMap] = useState<Record<string, string>>({});
  const [consultationTypeMap, setConsultationTypeMap] = useState<
    Record<string, string>
  >({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await getCurrentUser();
      const [typeMap, specMap] = await Promise.all([
        fetchConsultationTypeMap(),
        fetchSpecialtyMap(),
      ]);
      const merged = await buildPatientConsultationItems(
        currentUser.id,
        typeMap,
        { upcomingOnly: false },
      );
      setSpecialtyMap(specMap);
      setConsultationTypeMap(typeMap);
      setItems(merged);
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

  const filteredItems = useMemo(
    () => filterConsultationItems(items, statusFilter, search),
    [items, statusFilter, search],
  );

  return {
    items,
    filteredItems,
    specialtyMap,
    consultationTypeMap,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refetch: load,
  };
}
