import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  STATUS_FILTER_CHIPS,
  type StatusFilterId,
} from "@/lib/consultations/filters";
import { cn } from "@/lib/utils";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Filter } from "lucide-react-native";
import { useCallback, useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

type Props = {
  statusFilter: StatusFilterId;
  onStatusFilterChange: (id: StatusFilterId) => void;
};

export function ConsultationsFilters({
  statusFilter,
  onStatusFilterChange,
}: Props) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%"], []);

  const openSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  return (
    <>
      <View className="flex-row items-center gap-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="gap-2 pr-2"
        >
          {STATUS_FILTER_CHIPS.map((chip) => {
            const active = statusFilter === chip.id;
            return (
              <Pressable
                key={chip.id}
                onPress={() => onStatusFilterChange(chip.id)}
                className={cn(
                  "px-4 py-2 rounded-full border",
                  active
                    ? "bg-primary border-primary"
                    : "bg-background border-input",
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-white" : "text-foreground",
                  )}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
          onPress={openSheet}
          className="h-10 w-10 rounded-full border border-input items-center justify-center bg-background"
          accessibilityLabel="Mais filtros"
        >
          <Filter size={18} color="#687076" />
        </Pressable>
      </View>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
            opacity={0.5}
          />
        )}
      >
        <BottomSheetView style={styles.sheet}>
          <Text className="text-xl font-bold">Mais filtros</Text>
          <Text className="text-muted-foreground mt-3">
            Filtros avançados em breve.
          </Text>
          <Button className="w-full mt-6" onPress={() => sheetRef.current?.dismiss()}>
            <Text className="text-white">Fechar</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    padding: 24,
    flex: 1,
  },
});
