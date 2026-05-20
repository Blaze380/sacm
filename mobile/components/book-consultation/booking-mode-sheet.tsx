import { TypeOptionCard } from "@/components/book-consultation/type-option-card";
import { Text } from "@/components/ui/text";
import type { BookConsultationMode } from "@/lib/validation/book-consultation-schemas";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";

export type BookingModeSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type Props = {
  onSelect: (mode: BookConsultationMode) => void;
};

export const BookingModeSheet = forwardRef<BookingModeSheetRef, Props>(
  function BookingModeSheet({ onSelect }, ref) {
    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["40%"], []);

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const handleSelect = useCallback(
      (mode: BookConsultationMode) => {
        sheetRef.current?.dismiss();
        onSelect(mode);
      },
      [onSelect],
    );

    return (
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
          <Text className="text-xl font-bold">Novo pedido</Text>
          <Text className="text-muted-foreground mt-2">
            Como pretende marcar a sua consulta?
          </Text>
          <View className="gap-3 mt-6">
            <TypeOptionCard
              value="TRIAGE"
              title="Triagem"
              description="Não sei que consulta preciso — descrevo os sintomas e a equipa orienta."
              selected={false}
              onSelect={handleSelect}
            />
            <TypeOptionCard
              value="DIRECT"
              title="Marcar consulta"
              description="Já sei o tipo de consulta que quero."
              selected={false}
              onSelect={handleSelect}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    padding: 24,
    flex: 1,
  },
});
