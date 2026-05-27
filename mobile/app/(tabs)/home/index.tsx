import { HelloSection } from "@/components/home/hello-section";
import { UpcomingList } from "@/components/home/upcoming-list";
import { WeekdayCheckStrip } from "@/components/home/weekday-check-strip";
import { Text } from "@/components/ui/text";
import { useBookingModeSheet } from "@/hooks/use-booking-mode-sheet";
import { useConsultationDetailSheet } from "@/hooks/use-consultation-detail-sheet";
import { useHomeData } from "@/hooks/use-home-data";
import { themeColors } from "@/lib/theme-colors";
import { Plus } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const { present, BookingModeSheet } = useBookingModeSheet();
  const {
    user,
    items,
    specialtyMap,
    consultationTypeMap,
    isLoading,
    error,
    refetch,
  } = useHomeData();
  const { openDetail, DetailSheet } = useConsultationDetailSheet({
    specialtyMap,
    consultationTypeMap,
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-8 gap-8"
        showsVerticalScrollIndicator={false}
      >
        <WeekdayCheckStrip />
        <HelloSection
          firstName={user?.firstName}
          isLoading={isLoading && !user?.firstName?.trim()}
        />
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-semibold">Próximas consultas</Text>
            <Pressable
              onPress={present}
              className="h-9 w-9 rounded-full bg-primary items-center justify-center"
              accessibilityLabel="Nova consulta"
            >
              <Plus size={20} color={themeColors.primaryForeground} />
            </Pressable>
          </View>
          <UpcomingList
            items={items}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onItemPress={openDetail}
          />
        </View>
      </ScrollView>
      <BookingModeSheet />
      <DetailSheet />
    </SafeAreaView>
  );
}
