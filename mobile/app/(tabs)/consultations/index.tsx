import { ConsultationsFilters } from "@/components/consultations/consultations-filters";
import { ConsultationsHero } from "@/components/consultations/consultations-hero";
import { ConsultationsList } from "@/components/consultations/consultations-list";
import { useBookingModeSheet } from "@/hooks/use-booking-mode-sheet";
import { useConsultationsData } from "@/hooks/use-consultations-data";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsultationsTab() {
  const { present, BookingModeSheet } = useBookingModeSheet();
  const {
    filteredItems,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refetch,
  } = useConsultationsData();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-8 gap-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ConsultationsHero
          search={search}
          onSearchChange={setSearch}
          onAdd={present}
        />
        <ConsultationsFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <ConsultationsList
          items={filteredItems}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />
      </ScrollView>
      <BookingModeSheet />
    </SafeAreaView>
  );
}
