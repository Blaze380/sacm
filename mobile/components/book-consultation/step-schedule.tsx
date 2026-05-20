import { ControlledSelect } from "@/components/ui/controlled-select";
import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import { Text } from "@/components/ui/text";
import type { ConsultationTypeItem } from "@/lib/api/consultation-types";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useController, useFormContext } from "react-hook-form";
import { Platform, Pressable, View } from "react-native";
import { useState } from "react";

type Props = {
  consultationTypes: ConsultationTypeItem[];
  isLoadingOptions: boolean;
};

function withDefaultTime(date: Date): Date {
  const next = new Date(date);
  if (next.getHours() === 0 && next.getMinutes() === 0) {
    next.setHours(9, 0, 0, 0);
  }
  return next;
}

export function StepSchedule({
  consultationTypes,
  isLoadingOptions,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const {
    control,
    formState: { errors },
  } = useFormContext<BookConsultationFormValues>();
  const { field: dateField } = useController({ control, name: "date" });
  const { field: typeField } = useController({
    control,
    name: "consultationTypeId",
  });

  const options = consultationTypes.map((t) => ({ value: t.id, label: t.name }));
  const appointmentDate = dateField.value;
  const minDate = new Date();

  // #region agent log
  fetch("http://127.0.0.1:7651/ingest/99e5587c-42fc-439b-9250-4258fd9c3c1b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "98573e",
    },
    body: JSON.stringify({
      sessionId: "98573e",
      location: "step-schedule.tsx:render",
      message: "StepSchedule render",
      data: {
        optionsCount: options.length,
        isLoadingOptions,
        consultationTypeId: typeField.value,
        dateFieldValueType:
          appointmentDate === undefined
            ? "undefined"
            : appointmentDate instanceof Date
              ? "Date"
              : typeof appointmentDate,
      },
      timestamp: Date.now(),
      hypothesisId: "H4-H6",
    }),
  }).catch(() => {});
  // #endregion

  return (
    <View className="gap-4">
      <ControlledSelect
        control={control}
        name="consultationTypeId"
        options={options}
        placeholder={
          isLoadingOptions ? "A carregar tipos..." : "Tipo de consulta"
        }
        error={errors.consultationTypeId?.message}
      />

      <Pressable
        onPress={() => setShowPicker(true)}
        className="border border-input rounded-md h-10 px-3 justify-center bg-background w-full"
      >
        <Text
          className={
            appointmentDate instanceof Date && !isNaN(appointmentDate.getTime())
              ? "text-foreground"
              : "text-muted-foreground"
          }
        >
          {appointmentDate instanceof Date && !isNaN(appointmentDate.getTime())
            ? format(appointmentDate, "dd/MM/yyyy 'às' HH:mm", { locale: pt })
            : "Data e hora da consulta"}
        </Text>
      </Pressable>
      {errors.date?.message ? (
        <Text className="text-red-500">{errors.date.message}</Text>
      ) : null}

      {showPicker ? (
        <DateTimePicker
          mode={Platform.OS === "ios" ? "datetime" : "date"}
          value={
            appointmentDate instanceof Date && !isNaN(appointmentDate.getTime())
              ? appointmentDate
              : minDate
          }
          minimumDate={minDate}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selected) => {
            if (Platform.OS === "android") {
              setShowPicker(false);
            }
            if (selected) {
              const next = withDefaultTime(selected);
              dateField.onChange(next);
              // #region agent log
              fetch(
                "http://127.0.0.1:7651/ingest/99e5587c-42fc-439b-9250-4258fd9c3c1b",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Debug-Session-Id": "98573e",
                  },
                  body: JSON.stringify({
                    sessionId: "98573e",
                    location: "step-schedule.tsx:date-change",
                    message: "date picker changed",
                    data: { iso: next.toISOString() },
                    timestamp: Date.now(),
                    hypothesisId: "H4",
                  }),
                },
              ).catch(() => {});
              // #endregion
            }
          }}
        />
      ) : null}

      {Platform.OS === "ios" && showPicker ? (
        <Pressable
          onPress={() => setShowPicker(false)}
          className="self-end"
        >
          <Text className="text-primary font-medium">Concluir data</Text>
        </Pressable>
      ) : null}

      <ControlledTextarea
        control={control}
        name="notes"
        placeholder="Notas adicionais (opcional)"
        error={errors.notes?.message}
      />
    </View>
  );
}
