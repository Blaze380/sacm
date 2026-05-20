import {
  BookingModeSheet,
  type BookingModeSheetRef,
} from "@/components/book-consultation/booking-mode-sheet";
import type { BookConsultationMode } from "@/lib/validation/book-consultation-schemas";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";

const ROUTES: Record<BookConsultationMode, string> = {
  TRIAGE: "/(tabs)/consultations/new/triage",
  DIRECT: "/(tabs)/consultations/new/direct",
};

export function useBookingModeSheet() {
  const router = useRouter();
  const sheetRef = useRef<BookingModeSheetRef>(null);

  const present = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const handleSelect = useCallback(
    (mode: BookConsultationMode) => {
      router.push(ROUTES[mode]);
    },
    [router],
  );

  const Sheet = useCallback(
    () => <BookingModeSheet ref={sheetRef} onSelect={handleSelect} />,
    [handleSelect],
  );

  return { present, BookingModeSheet: Sheet };
}
