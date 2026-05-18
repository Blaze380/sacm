import { ControllerInput } from "@/components/ui/controlled-input";
import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import type { BookConsultationFormValues } from "@/lib/validation/book-consultation-schemas";
import { Control } from "react-hook-form";
import { View } from "react-native";

type Props = {
  control: Control<BookConsultationFormValues>;
  errors: Partial<Record<keyof BookConsultationFormValues, { message?: string }>>;
};

export function StepTriageSymptom({ control, errors }: Props) {
  return (
    <View className="gap-4">
      <ControlledTextarea
        control={control}
        name="symptom"
        placeholder="Descreva o sintoma principal"
        error={errors.symptom?.message}
      />
      <ControllerInput
        control={control}
        name="symptomDuration"
        full
        placeholder="Há quanto tempo? (ex.: 3 dias)"
        error={errors.symptomDuration?.message}
      />
    </View>
  );
}
