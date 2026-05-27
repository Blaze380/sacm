import {
  ConsultationDetailSheet,
  type ConsultationDetailSheetRef,
} from "@/components/consultations/consultation-detail-sheet";
import type { HomeUpcomingItem } from "@/lib/home/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  specialtyMap: Record<string, string>;
  consultationTypeMap: Record<string, string>;
};

export function useConsultationDetailSheet({
  specialtyMap,
  consultationTypeMap,
}: Options) {
  const router = useRouter();
  const sheetRef = useRef<ConsultationDetailSheetRef>(null);
  const [selectedItem, setSelectedItem] = useState<HomeUpcomingItem | null>(
    null,
  );

  const openDetail = useCallback((item: HomeUpcomingItem) => {
    setSelectedItem(item);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      sheetRef.current?.present();
    }
  }, [selectedItem]);

  const closeDetail = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const handleDismiss = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleBookReferral = useCallback(
    (triageId: string) => {
      sheetRef.current?.dismiss();
      router.push({
        pathname: "/(tabs)/consultations/new/book-referral",
        params: { triageId },
      });
    },
    [router],
  );

  const DetailSheet = useCallback(
    () => (
      <ConsultationDetailSheet
        ref={sheetRef}
        item={selectedItem}
        specialtyMap={specialtyMap}
        consultationTypeMap={consultationTypeMap}
        onBookReferral={handleBookReferral}
        onDismiss={handleDismiss}
      />
    ),
    [
      selectedItem,
      specialtyMap,
      consultationTypeMap,
      handleBookReferral,
      handleDismiss,
    ],
  );

  return { openDetail, closeDetail, DetailSheet };
}
