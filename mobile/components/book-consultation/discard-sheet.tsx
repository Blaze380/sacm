import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";

export type DiscardSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type Props = {
  onContinue: () => void;
  onCancel: () => void;
};

export const DiscardSheet = forwardRef<DiscardSheetRef, Props>(
  function DiscardSheet({ onContinue, onCancel }, ref) {
    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["32%"], []);

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const handleContinue = useCallback(() => {
      sheetRef.current?.dismiss();
      onContinue();
    }, [onContinue]);

    const handleCancel = useCallback(() => {
      sheetRef.current?.dismiss();
      onCancel();
    }, [onCancel]);

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
          <Text className="text-xl font-bold">Sair do formulário?</Text>
          <Text className="text-muted-foreground mt-2">
            Quer continuar a preencher ou cancelar?
          </Text>
          <Button className="w-full mt-6" onPress={handleContinue}>
            <Text className="text-white">Continuar a preencher</Text>
          </Button>
          <Button
            variant="outline"
            className="w-full mt-3"
            onPress={handleCancel}
          >
            <Text>Cancelar</Text>
          </Button>
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
