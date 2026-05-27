import {
  AppointmentDetailContent,
  ReferredTriageDetailContent,
} from "@/components/consultations/appointment-detail-content";
import { TriageDetailContent } from "@/components/consultations/triage-detail-content";
import { Text } from "@/components/ui/text";
import { getDetailSheetTitle } from "@/lib/consultations/detail-labels";
import { themeColors } from "@/lib/theme-colors";
import { getConsultationDetailVariant } from "@/lib/consultations/detail-variant";
import {
  fetchTriageByIdFromApi,
  triageNeedsDetailFetch,
  type TriageItem,
} from "@/lib/api/triages";
import type { HomeUpcomingItem } from "@/lib/home/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export type ConsultationDetailSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type Props = {
  item: HomeUpcomingItem | null;
  specialtyMap: Record<string, string>;
  consultationTypeMap: Record<string, string>;
  onBookReferral?: (triageId: string) => void;
  onDismiss?: () => void;
};

export const ConsultationDetailSheet = forwardRef<
  ConsultationDetailSheetRef,
  Props
>(function ConsultationDetailSheet(
  { item, specialtyMap, consultationTypeMap, onBookReferral, onDismiss },
  ref,
) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["92%"], []);
  const [enrichedTriage, setEnrichedTriage] = useState<TriageItem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const variant = item ? getConsultationDetailVariant(item) : "triage";
  const isReferredTriage =
    item?.kind === "triage" && item.triage.status === "REENCAMINHADO";
  const title = getDetailSheetTitle(variant, isReferredTriage);

  useEffect(() => {
    if (!item || item.kind !== "triage") {
      setEnrichedTriage(null);
      setLoadingDetail(false);
      return;
    }

    const base = item.triage;
    if (!triageNeedsDetailFetch(base)) {
      setEnrichedTriage(base);
      setLoadingDetail(false);
      return;
    }

    let cancelled = false;
    setLoadingDetail(true);
    setEnrichedTriage(base);

    void fetchTriageByIdFromApi(base.id)
      .then((full) => {
        if (!cancelled) setEnrichedTriage(full);
      })
      .catch(() => {
        if (!cancelled) setEnrichedTriage(base);
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [item]);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const triageForDisplay =
    item?.kind === "triage" ? (enrichedTriage ?? item.triage) : null;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleDismiss}
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
      <View style={styles.header}>
        <Text className="text-xl font-bold">{title}</Text>
        <Pressable
          onPress={() => sheetRef.current?.dismiss()}
          hitSlop={12}
          accessibilityLabel="Fechar"
        >
          <X size={24} color={themeColors.mutedIcon} />
        </Pressable>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loadingDetail ? (
          <View className="py-12 items-center">
            <ActivityIndicator />
          </View>
        ) : null}

        {!loadingDetail && item && variant === "triage" && triageForDisplay ? (
          <TriageDetailContent triage={triageForDisplay} date={item.date} />
        ) : null}

        {!loadingDetail && item?.kind === "appointment" ? (
          <AppointmentDetailContent
            item={item}
            specialtyMap={specialtyMap}
          />
        ) : null}

        {!loadingDetail &&
        item?.kind === "triage" &&
        variant === "appointment" &&
        triageForDisplay ? (
          <ReferredTriageDetailContent
            item={{ ...item, triage: triageForDisplay }}
            specialtyMap={specialtyMap}
            consultationTypeMap={consultationTypeMap}
            onBook={
              onBookReferral
                ? () => onBookReferral(triageForDisplay.id)
                : undefined
            }
          />
        ) : null}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
